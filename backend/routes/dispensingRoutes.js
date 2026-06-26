const express = require('express');
const router = express.Router();
const dispensingController = require('../controllers/dispensingController');

router.get('/report', dispensingController.getDispensingReport);
router.post('/', dispensingController.dispenseMilk);

module.exports = router;