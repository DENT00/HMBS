// 1. Give the Chef access to the MySQL database
const db = require('../config/db');

// 2. Recipe: Creating a new pasteurization batch (POST)
exports.createPasteurizationBatch = async (req, res) => {
    try {
        // Step A: The Waiter takes the order from the frontend (the ingredients)
        const { batch_id, pasteurization_date, staff_id } = req.body;

        // The Chef writes the SQL command to shove the ingredients into the oven
        // We use ? as placeholders to protect against hackers (SQL Injection)
        const sql = `
            INSERT INTO PasteurizationBatch (batch_id, pasteurization_date, staff_id)
            VALUES (?, ?, ?)
        `;
        
        // Step C: The Chef executes the command
        const [result] = await db.execute(sql, [batch_id, pasteurization_date, staff_id]);

        // Step D: Tell the frontend it was a success!
        res.status(201).json({
            success: true,
            message: 'Pasteurization batch created successfully!',
            // insertId is a special MySQL feature that hands us back the new auto-incremented ID
            new_pasteurization_id: result.insertId 
        });

    } catch (error) {
        console.error('Database Error in createPasteurizationBatch:', error);
        res.status(500).json({ success: false, message: 'Server failed to create batch.' });
    }
};