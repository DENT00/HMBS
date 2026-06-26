const express = require('express');
const router = express.Router();
const donationsController = require('../controllers/donationsController');

router.get('/', donationsController.getAllDonations);

router.post('/', donationsController.createDonation);
router.post('/:donation_id/pre-lab', donationsController.updatePrePasteurizationLab);
router.post('/:donation_id/dispose', donationsController.disposeMilk);
router.post('/batch', donationsController.createPasteurizationBatch);
router.put('/pasteurization/:pasteurization_id/status', donationsController.updatePasteurizationStatus);
router.post('/pasteurization/:pasteurization_id/post-lab', donationsController.updatePostPasteurizationLab);

module.exports = router;