const express = require('express');
const router = express.Router();

// 1. Bring the Chef into the Waiter's file
const donorController = require('../controllers/donorController');

// 2. Handle GET requests (When the frontend asks to see the donor list)
router.get('/', donorController.getAllDonors);

// 3. Handle POST requests (When the frontend sends a form to register a new donor)
router.post('/', donorController.createDonor);

// 4. Export the Waiter so server.js can use it
module.exports = router;