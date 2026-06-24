const express = require('express');
const router = express.Router();

//brings the new inventory chef  into waiter's file
const inventoryController = require('../controllers/inventoryController');
//handle get request
router.get('/', inventoryController.getAllInventory);
//export
module.exports = router;