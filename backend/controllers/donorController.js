// 1. Give the Chef access to the pantry (MySQL database)
const db = require('../config/db');

// 2. Recipe 1: Fetching all donors (GET)
exports.getAllDonors = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM Donors');
        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Database Error in getAllDonors:', error);
        res.status(500).json({ success: false, message: 'Server failed to fetch donors.' });
    }
};

// 3. Recipe 2: Creating a new donor (POST)
exports.createDonor = async (req, res) => {
    // Unpack the data sent from the frontend
    const { dtn, first_name, last_name, birthdate, registration_date } = req.body;

    try {
        const sql = `
            INSERT INTO Donors (dtn, first_name, last_name, birthdate, registration_date) 
            VALUES (?, ?, ?, ?, ?)
        `; 
        
        // Execute the query safely using placeholders
        const [result] = await db.execute(sql, [dtn, first_name, last_name, birthdate, registration_date]);
        
        res.status(201).json({ 
            success: true,
            message: 'New donor created successfully',
            donorId: result.insertId 
        });

    } catch (error) {
        console.error('Database Error in createDonor:', error);
        res.status(500).json({ success: false, message: 'Server failed to create donor.' });
    }
};