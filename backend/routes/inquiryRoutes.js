const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');

// Read & Search
router.get('/', inquiryController.getAllInquiries); // Fixed req to router!
router.get('/:id', inquiryController.getInquiry);
router.post('/search', inquiryController.searchInquiries);

// Create
router.post('/', inquiryController.createInquiry);

// Updates & Actions
router.put('/:id/status', inquiryController.updateInquiryStatus);
router.post('/:id/response', inquiryController.createInquiryResponse);
router.post('/:id/forward', inquiryController.forwardInquiry);
router.post('/:id/close', inquiryController.closeInquiry);
router.post('/:id/reopen', inquiryController.reopenInquiry);
router.post('/:id/assign', inquiryController.assignInquiry);
router.post('/:id/unassign', inquiryController.unassignInquiry);
router.post('/:id/transfer', inquiryController.transferInquiry);
router.post('/:id/merge', inquiryController.mergeInquiries);

module.exports = router;