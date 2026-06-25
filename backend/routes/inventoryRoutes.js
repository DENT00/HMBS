const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Existing GET Route (Checking the freezer)
router.get('/', inventoryController.getAllInventory);

// NEW POST Route (Putting milk into the freezer)
router.post('/', inventoryController.addInventory);

module.exports = router;