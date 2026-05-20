// backend/routes/feeRoutes.js
const express = require('express');
const router = express.Router();
const { setFeeStructure, getFeeStructure, recordPayment, getAllPayments, getMyFeeStatus, updatePayment, deletePayment, deleteAllPayments } = require('../controllers/feeController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/structure', protect, setFeeStructure);
router.get('/structure', protect, getFeeStructure);
router.post('/pay', protect, recordPayment);
router.get('/all-payments', protect, getAllPayments);

// THE MISSING ROUTE:
router.delete('/all-payments', protect, deleteAllPayments);

router.put('/pay/:id', protect, updatePayment);
router.delete('/pay/:id', protect, deletePayment);

// Student Route
router.get('/my-status', protect, getMyFeeStatus);

module.exports = router;