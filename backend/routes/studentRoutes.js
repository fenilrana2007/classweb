const express = require('express');
const router = express.Router();
const { getStudentDashboardData } = require('../controllers/studentController');
const { protect } = require('../middlewares/authMiddleware');

// Only logged-in users can access this
router.get('/dashboard', protect, getStudentDashboardData);

module.exports = router;