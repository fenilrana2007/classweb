// backend/routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getTeacherStats, getStudents, addStudent, updateStudent, 
    toggleBlockStudent, deleteStudent, submitAttendance, sendMessage , getAttendance,getMessages
} = require('../controllers/teacherController');
const { protect, teacherOrAdmin } = require('../middlewares/authMiddleware');

router.use(protect, teacherOrAdmin);

router.get('/stats', getTeacherStats);
router.get('/students', getStudents);
router.post('/students', addStudent);

// THE FIX: Here is the route answering line 123 in your frontend
router.put('/students/:id', updateStudent); 
router.put('/students/:id/block', toggleBlockStudent);
router.delete('/students/:id', deleteStudent);

router.post('/attendance', submitAttendance);
router.post('/messages', sendMessage);
router.get('/attendance', getAttendance); 
router.get('/messages', getMessages);
module.exports = router;