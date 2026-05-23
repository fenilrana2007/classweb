// const express = require('express');
// const router = express.Router();
// const { addStudent, getStudents, getStudentDashboardData,deleteAllStudents,getMyClassLogs } = require('../controllers/studentController');
// const { protect } = require('../middlewares/authMiddleware');

// // ==========================================
// // STUDENT ENDPOINTS
// // ==========================================

// // Dashboard Data (For the logged-in student)
// router.get('/dashboard', protect, getStudentDashboardData);

// // ==========================================
// // ADMIN / TEACHER ENDPOINTS
// // ==========================================

// // Manage Student Accounts (You can add specific admin/teacher middleware here later if needed)
// router.post('/', protect, addStudent);
// router.get('/', protect, getStudents);
// router.delete('/all', protect, deleteAllStudents);
// router.get('/class-logs', protect, getMyClassLogs);
// module.exports = router;
const express = require('express');
const router = express.Router();
const { 
    addStudent, 
    getStudents, 
    getStudentDashboardData,
    deleteAllStudents,
    getMyClassLogs,
    updateStudent,       // NEW
    deleteStudent,       // NEW
    toggleBlockStudent   // NEW
} = require('../controllers/studentController');
const { protect } = require('../middlewares/authMiddleware');

// ==========================================
// STUDENT ENDPOINTS
// ==========================================

// Dashboard Data (For the logged-in student)
router.get('/dashboard', protect, getStudentDashboardData);
router.get('/class-logs', protect, getMyClassLogs);

// ==========================================
// ADMIN / TEACHER ENDPOINTS
// ==========================================

// Manage Student Accounts
router.post('/', protect, addStudent);
router.get('/', protect, getStudents);

// DANGER ZONE (Must come before /:id routes so Express doesn't confuse "all" with an ID)
router.delete('/all', protect, deleteAllStudents);

// Specific Student Operations
router.put('/:id', protect, updateStudent);
router.delete('/:id', protect, deleteStudent);
router.put('/:id/block', protect, toggleBlockStudent);

module.exports = router;