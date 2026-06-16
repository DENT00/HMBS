const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST request to verify login credentials
router.post('/login', authController.login);

module.exports = router;