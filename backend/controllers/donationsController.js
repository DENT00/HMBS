const pool = require('../config/db');

// ---------- CREATE DONATION ----------
exports.createDonation = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { donor_id, program_id, volume_ml, collection_date } = req.body;
        const staff_id = req.staff.staff_id;

        // 1. Validate per-session limit (30–240 mL)
        if (volume_ml < 30 || volume_ml > 240) {
            return res.status(400).json({ error: 'Volume must be between 30mL and 240mL.' });
        }

        // 2. Validate daily total (800 mL)
        const startOfDay = new Date(collection_date);
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date(collection_date);
        endOfDay.setHours(23,59,59,999);

        const [dailyRows] = await connection.query(
            `SELECT COALESCE(SUM(volume_ml),0) as total FROM Donations 
             WHERE donor_id = ? AND collection_date BETWEEN ? AND ?`,
            [donor_id, startOfDay, endOfDay]
        );
        if ((dailyRows[0].total || 0) + volume_ml > 800) {
            return res.status(400).json({ error: 'Daily limit of 800mL exceeded.' });
        }

        // 3. Insert donation with status 'Collected'
        const [result] = await connection.query(
            `INSERT INTO Donations (donor_id, program_id, staff_id, volume_ml, collection_date, status)
             VALUES (?, ?, ?, ?, ?, 'Collected')`,
            [donor_id, program_id, staff_id, volume_ml, collection_date]
        );

        await connection.commit();
        res.status(201).json({ message: 'Donation recorded.', donation_id: result.insertId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// ---------- PRE-PASTEURIZATION LAB RESULT ----------
exports.updatePrePasteurizationLab = async (req, res) => {
    const { donation_id } = req.params;
    const { result, test_date } = req.body; // 'Passed' or 'Failed'

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Check donation exists and status is 'Collected'
        const [donationRows] = await connection.query(
            'SELECT * FROM Donations WHERE donation_id = ? FOR UPDATE',
            [donation_id]
        );
        if (donationRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Donation not found.' });
        }
        const donation = donationRows[0];
        if (donation.status !== 'Collected') {
            await connection.rollback();
            return res.status(400).json({ error: 'Donation not in "Collected" status.' });
        }

        // Insert into PrepasteurizationTest
        await connection.query(
            `INSERT INTO PrepasteurizationTest (donation_id, test_date, result)
             VALUES (?, ?, ?)`,
            [donation_id, test_date, result]
        );

        // Update donation status
        let newStatus;
        if (result === 'Failed') {
            newStatus = 'Failed';
            // Optionally mark as disposed later; we'll keep it 'Failed'
        } else if (result === 'Passed') {
            newStatus = 'Passed';
        } else {
            await connection.rollback();
            return res.status(400).json({ error: 'Result must be "Passed" or "Failed".' });
        }
        await connection.query(
            'UPDATE Donations SET status = ? WHERE donation_id = ?',
            [newStatus, donation_id]
        );

        await connection.commit();
        res.json({ message: `Pre-pasteurization lab result recorded. Donation status: ${newStatus}` });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// ---------- CREATE PASTEURIZATION BATCH ----------
// Select multiple 'Passed' donations (from any program) and create a pasteurization batch
exports.createPasteurizationBatch = async (req, res) => {
    const { donation_ids, pasteurization_date } = req.body; // array of donation IDs
    const staff_id = req.staff.staff_id;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Verify all donations exist and are 'Passed'
        const placeholders = donation_ids.map(() => '?').join(',');
        const [donations] = await connection.query(
            `SELECT * FROM Donations WHERE donation_id IN (${placeholders}) AND status = 'Passed'`,
            donation_ids
        );
        if (donations.length !== donation_ids.length) {
            await connection.rollback();
            return res.status(400).json({ error: 'All donations must be in "Passed" status.' });
        }

        // 2. Create a Collection_Batch (pooling) – we'll create one for this pasteurization
        const [batchResult] = await connection.query(
            `INSERT INTO Collection_Batch (pooling_date, status, staff_id)
             VALUES (?, 'Processing', ?)`,
            [pasteurization_date, staff_id]
        );
        const batch_id = batchResult.insertId;

        // 3. Update all donations with this batch_id and set status to 'Pending' (waiting for pasteurization)
        await connection.query(
            `UPDATE Donations SET batch_id = ?, status = 'Pending' WHERE donation_id IN (${placeholders})`,
            [batch_id, ...donation_ids]
        );

        // 4. Create PasteurizationBatch record
        const [pastBatchResult] = await connection.query(
            `INSERT INTO PasteurizationBatch (batch_id, pasteurization_date, staff_id, status)
             VALUES (?, ?, ?, 'Pending')`,
            [batch_id, pasteurization_date, staff_id]
        );
        const pasteurization_id = pastBatchResult.insertId;

        await connection.commit();
        res.status(201).json({
            message: 'Pasteurization batch created.',
            batch_id,
            pasteurization_id,
            donation_count: donation_ids.length
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// ---------- UPDATE PASTEURIZATION BATCH STATUS (start/end) ----------
exports.updatePasteurizationStatus = async (req, res) => {
    const { pasteurization_id } = req.params;
    const { status, start_time, end_time } = req.body; // status: 'Completed' or 'Failed'

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Check if pasteurization batch exists
        const [pastRows] = await connection.query(
            'SELECT * FROM PasteurizationBatch WHERE pasteurization_id = ? FOR UPDATE',
            [pasteurization_id]
        );
        if (pastRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Pasteurization batch not found.' });
        }

        // If marking as 'Completed', also update the Collection_Batch status to 'Completed'
        if (status === 'Completed') {
            await connection.query(
                `UPDATE PasteurizationBatch SET status = 'Completed' WHERE pasteurization_id = ?`,
                [pasteurization_id]
            );
            // Update associated collection batch
            const batch_id = pastRows[0].batch_id;
            await connection.query(
                `UPDATE Collection_Batch SET status = 'Completed' WHERE batch_id = ?`,
                [batch_id]
            );
            // Also update donations to 'Passed' (or keep as 'Passed'? Actually they are already passed pre-lab, 
            // but we can keep them as 'Passed' or set to 'Pasteurized' – but schema doesn't have that. We'll leave them.)
        } else if (status === 'Failed') {
            await connection.query(
                `UPDATE PasteurizationBatch SET status = 'Failed' WHERE pasteurization_id = ?`,
                [pasteurization_id]
            );
            // Maybe mark donations as 'Disposed'? We'll handle later.
        } else {
            await connection.rollback();
            return res.status(400).json({ error: 'Status must be "Completed" or "Failed".' });
        }

        await connection.commit();
        res.json({ message: `Pasteurization batch status updated to ${status}.` });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// ---------- POST-PASTEURIZATION LAB RESULT ----------
exports.updatePostPasteurizationLab = async (req, res) => {
    const { pasteurization_id } = req.params;
    const { result, test_date, expiration_date } = req.body; // 'Passed' or 'Failed'

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Check pasteurization batch exists and is 'Completed'
        const [pastRows] = await connection.query(
            'SELECT * FROM PasteurizationBatch WHERE pasteurization_id = ? AND status = "Completed" FOR UPDATE',
            [pasteurization_id]
        );
        if (pastRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Pasteurization batch not completed or not found.' });
        }

        // Insert PostPasteurizationTest
        await connection.query(
            `INSERT INTO PostPasteurizationTest (pasteurization_id, test_date, result, expiration_date)
             VALUES (?, ?, ?, ?)`,
            [pasteurization_id, test_date, result, expiration_date || null]
        );

        if (result === 'Passed') {
            // Add to Inventory
            // First, calculate total volume from all donations in this batch
            const batch_id = pastRows[0].batch_id;
            const [volRows] = await connection.query(
                `SELECT SUM(volume_ml) as total FROM Donations WHERE batch_id = ?`,
                [batch_id]
            );
            const total_vol = volRows[0].total || 0;

            if (total_vol > 0) {
                await connection.query(
                    `INSERT INTO Inventory (pasteurization_id, available_volume_ml, dispensed_volume_ml, wasted_volume_ml)
                     VALUES (?, ?, 0, 0)`,
                    [pasteurization_id, total_vol]
                );
            }

            // Optionally update donations status to 'Passed' (or keep as is)
            // No need to change; they are already 'Passed' from pre-lab.
        } else if (result === 'Failed') {
            // Mark milk as disposed – we can update the Inventory? No inventory yet.
            // We'll just record the test result; disposal logic can be separate.
            // For simplicity, we'll skip inventory creation.
        } else {
            await connection.rollback();
            return res.status(400).json({ error: 'Result must be "Passed" or "Failed".' });
        }

        await connection.commit();
        res.json({ message: `Post-pasteurization lab result recorded: ${result}.` });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// ---------- DISPOSE MILK  ----------
exports.disposeMilk = async (req, res) => {
    const { donation_id } = req.params;
    const { reason } = req.body; // e.g., 'Failed lab test', 'Expired', 'Other'

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [donationRows] = await connection.query(
            'SELECT * FROM Donations WHERE donation_id = ? FOR UPDATE',
            [donation_id]
        );
        if (donationRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Donation not found.' });
        }

        // Update donation status to 'Disposed'
        await connection.query(
            'UPDATE Donations SET status = "Disposed" WHERE donation_id = ?',
            [donation_id]
        );

        // Optionally add a disposal record (we can create a Disposal table if needed)
        await connection.commit();
        res.json({ message: `Donation ${donation_id} marked as disposed. Reason: ${reason}` });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};