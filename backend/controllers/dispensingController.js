const pool = require('../config/db');

const PRICE_PER_ML = parseFloat(process.env.PRICE_PER_ML) || 15.00;

exports.dispenseMilk = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { inventory_id, beneficiary_id, volume_ml, dispensing_date, staff_id } = req.body;

        // Lock inventory row
        const [invRows] = await connection.query(
            'SELECT * FROM Inventory WHERE inventory_id = ? FOR UPDATE',
            [inventory_id]
        );
        if (invRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Inventory record not found.' });
        }
        const inventory = invRows[0];
        if (inventory.available_volume_ml < volume_ml) {
            await connection.rollback();
            return res.status(400).json({ error: 'Insufficient milk in stock.' });
        }

        // Check beneficiary
        const [benRows] = await connection.query('SELECT * FROM Beneficiary WHERE beneficiary_id = ?', [beneficiary_id]);
        if (benRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Beneficiary not found.' });
        }

        const total_price = volume_ml * PRICE_PER_ML;

        // Insert dispensing record
        const [dispResult] = await connection.query(
            `INSERT INTO Dispensing (inventory_id, beneficiary_id, staff_id, dispensing_date, volume_ml, price_per_ml, total_price)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [inventory_id, beneficiary_id, staff_id, dispensing_date || new Date().toISOString().split('T')[0], volume_ml, PRICE_PER_ML, total_price]
        );

        // Update inventory
        await connection.query(
            `UPDATE Inventory 
             SET available_volume_ml = available_volume_ml - ?,
                 dispensed_volume_ml = dispensed_volume_ml + ?
             WHERE inventory_id = ?`,
            [volume_ml, volume_ml, inventory_id]
        );

        await connection.commit();
        res.status(201).json({
            message: 'Milk dispensed successfully.',
            dispensing_id: dispResult.insertId,
            remaining_available_vol: inventory.available_volume_ml - volume_ml
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

exports.getDispensingReport = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT d.*, b.first_name, b.last_name, s.first_name as staff_first_name 
            FROM Dispensing d
            JOIN Beneficiary b ON d.beneficiary_id = b.beneficiary_id
            JOIN Staff s ON d.staff_id = s.staff_id
            ORDER BY d.dispensing_date DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};