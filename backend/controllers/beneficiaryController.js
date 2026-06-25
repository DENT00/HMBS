const pool = require('../config/db');

exports.registerBeneficiary = async (req, res) => {
    try {
        const { first_name, last_name, middle_name, address, hospital_affiliation, contact_number, registration_date } = req.body;
        // Check duplicate contact
        const [existing] = await pool.query('SELECT * FROM Beneficiary WHERE contact_number = ?', [contact_number]);
        if (existing.length > 0) return res.status(409).json({ error: 'Beneficiary with this contact already exists.' });

        const [result] = await pool.query(
            `INSERT INTO Beneficiary (first_name, last_name, middle_name, address, hospital_affiliation, contact_number, registration_date)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [first_name, last_name, middle_name, address, hospital_affiliation, contact_number, registration_date || new Date().toISOString().split('T')[0]]
        );
        res.status(201).json({ message: 'Beneficiary registered.', beneficiary_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBeneficiary = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Beneficiary WHERE beneficiary_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found.' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchBeneficiaries = async (req, res) => {
    try {
        const { q } = req.query;
        const [rows] = await pool.query(
            `SELECT * FROM Beneficiary 
             WHERE first_name LIKE ? OR last_name LIKE ? OR contact_number LIKE ?`,
            [`%${q}%`, `%${q}%`, `%${q}%`]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};