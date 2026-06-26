// controllers/inquiryController.js
const pool = require('../config/db');

exports.getAllInquiries = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Inquiry ORDER BY inquiry_date DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchInquiries = async (req, res) => {
    try {
        const { q } = req.body;
        const search = `%${q || ''}%`;
        const [rows] = await pool.query(
            `SELECT * FROM Inquiry 
             WHERE inquiry_id LIKE ? OR status LIKE ?`,
            [search, search]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getInquiry = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Inquiry WHERE inquiry_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Inquiry not found.' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createInquiry = async (req, res) => {
    try {
        const { beneficiary_id, requested_volume_ml, inquiry_date } = req.body;

        // Check beneficiary exists
        const [ben] = await pool.query('SELECT * FROM Beneficiary WHERE beneficiary_id = ?', [beneficiary_id]);
        if (ben.length === 0) return res.status(404).json({ error: 'Beneficiary not found.' });

        // Check total available inventory (sum of available_volume_ml)
        const [invRows] = await pool.query('SELECT COALESCE(SUM(available_volume_ml),0) as total FROM Inventory');
        if (requested_volume_ml > invRows[0].total) {
            return res.status(400).json({ error: 'Insufficient inventory currently.' });
        }

        const [result] = await pool.query(
            `INSERT INTO Inquiry (beneficiary_id, inquiry_date, requested_volume_ml, status)
             VALUES (?, ?, ?, 'Pending')`,
            [beneficiary_id, inquiry_date || new Date().toISOString().split('T')[0], requested_volume_ml]
        );
        res.status(201).json({ message: 'Inquiry logged.', inquiry_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateInquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Fulfilled' or 'Notified'
        const [result] = await pool.query('UPDATE Inquiry SET status = ? WHERE inquiry_id = ?', [status, id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Inquiry not found.' });
        res.json({ message: `Inquiry status updated to ${status}.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createInquiryResponse = async (req, res) => {
    res.status(501).json({ error: 'Not implemented.' });
};

exports.forwardInquiry = async (req, res) => {
    res.status(501).json({ error: 'Not implemented.' });
};

exports.closeInquiry = async (req, res) => {
    res.status(501).json({ error: 'Not implemented.' });
};

exports.reopenInquiry = async (req, res) => {
    res.status(501).json({ error: 'Not implemented.' });
};

exports.assignInquiry = async (req, res) => {
    res.status(501).json({ error: 'Not implemented.' });
};

exports.unassignInquiry = async (req, res) => {
    res.status(501).json({ error: 'Not implemented.' });
};

exports.transferInquiry = async (req, res) => {
    res.status(501).json({ error: 'Not implemented.' });
};

exports.mergeInquiries = async (req, res) => {
    res.status(501).json({ error: 'Not implemented.' });
};
