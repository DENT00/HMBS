const db = require('../config/db');//giving access to the database connection

exports.getAllInventory = async (req, res) => {//getting all inventory records(GET)
    try {
        //asks the database to select all records from the Inventory table
        const [rows] = await db.execute('SELECT * FROM Inventory');
        res.status(200).json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        console.error('Database Error in getAllInventory:', error);
        res.status(500).json({ success: false, message: 'Server failed to fetch inventory records.' });
    }
};