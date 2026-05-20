const express = require('express');
const router = express.Router();
const { addStudent, getStudents, getStudentDashboardData,deleteAllStudents,getMyClassLogs } = require('../controllers/studentController');
const { protect } = require('../middlewares/authMiddleware');

// ==========================================
// STUDENT ENDPOINTS
// ==========================================

// Dashboard Data (For the logged-in student)
router.get('/dashboard', protect, getStudentDashboardData);

// ==========================================
// ADMIN / TEACHER ENDPOINTS
// ==========================================

// Manage Student Accounts (You can add specific admin/teacher middleware here later if needed)
router.post('/', protect, addStudent);
router.get('/', protect, getStudents);
router.delete('/all', protect, deleteAllStudents);
router.get('/class-logs', protect, getMyClassLogs);
module.exports = router;