const express = require('express');
const router = express.Router();
const { setFeeStructure, getFeeStructure, recordPayment, getAllPayments, getMyFeeStatus } = require('../controllers/feeController');
const { protect } = require('../middlewares/authMiddleware');

// Admin Routes (You can add admin middleware here later)
router.post('/structure', protect, setFeeStructure);
router.get('/structure', protect, getFeeStructure);
router.post('/pay', protect, recordPayment);
router.get('/all-payments', protect, getAllPayments);

// Student Route
router.get('/my-status', protect, getMyFeeStatus);

module.exports = router;