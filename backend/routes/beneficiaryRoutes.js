const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiaryController');

router.post('/', beneficiaryController.registerBeneficiary);
router.get('/search', beneficiaryController.searchBeneficiaries);
router.get('/:id', beneficiaryController.getBeneficiary);

module.exports = router;