const express = require('express');
const router = express.Router();
const { setFeeStructure, getFeeStructure, recordPayment, getAllPayments, getMyFeeStatus,updatePayment,deletePayment } = require('../controllers/feeController');
const { protect } = require('../middlewares/authMiddleware');

// Admin Routes (You can add admin middleware here later)
router.post('/structure', protect, setFeeStructure);
router.get('/structure', protect, getFeeStructure);
router.post('/pay', protect, recordPayment);
router.get('/all-payments', protect, getAllPayments);

// Student Route
router.get('/my-status', protect, getMyFeeStatus);
// Add these to the Admin Routes section:
router.put('/pay/:id', protect, updatePayment);
router.delete('/pay/:id', protect, deletePayment);
module.exports = router;