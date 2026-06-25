const db = require('../config/db');

// GET: Fetch all inventory records
exports.getAllInventory = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Inventory');
        res.status(200).json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        console.error('Error in getAllInventory:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch inventory.' });
    }
};

// POST: Add new pasteurized milk batch to freezer
exports.addInventory = async (req, res) => {
    try {
        const { pasteurization_id, available_volume_ml } = req.body;

        // TYPO GUARD: Prevent impossible or accidentally massive volumes
        if (available_volume_ml <= 0 || available_volume_ml > 10000) {
            return res.status(400).json({
                success: false,
                message: 'Invalid volume. Must be between 1ml and 10,000ml.'
            });
        }

        // INSERT: Database defaults dispensed and wasted to 0
        const sql = `
            INSERT INTO Inventory (pasteurization_id, available_volume_ml)
            VALUES (?, ?)
        `;
        const [result] = await db.execute(sql, [pasteurization_id, available_volume_ml]);
        
        res.status(201).json({
            success: true,
            message: 'Milk volume successfully added to inventory!',
            new_inventory_id: result.insertId
        });

    } catch (error) {
        console.error('Error in addInventory:', error);
        res.status(500).json({ success: false, message: 'Failed to add inventory.' });
    }
};