const express = require('express');
const router = express.Router();

// Bring the Chef into the Waiter's file
const pasteurizationController = require('../controllers/pasteurizationController');

// Handle POST requests (When the frontend submits a new batch to be processed)
router.post('/', pasteurizationController.createPasteurizationBatch);

module.exports = router;