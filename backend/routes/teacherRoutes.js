// backend/routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getTeacherStats, getStudents, addStudent, updateStudent, toggleBlockStudent, deleteStudent, 
    submitAttendance, getAttendance, deleteAttendance, wipeAllAttendance, // <- Exported new functions
    sendMessage, getMessages, 
    createClassLog, getClassLogs, updateClassLog, deleteClassLog

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

router.post('/messages', sendMessage);
router.get('/messages', getMessages);

router.post('/class-logs', protect, createClassLog);
router.get('/class-logs', protect, getClassLogs);
router.put('/class-logs/:id', protect, updateClassLog);
router.delete('/class-logs/:id', protect, deleteClassLog);

router.post('/attendance', protect, submitAttendance);
router.get('/attendance', protect, getAttendance);
router.delete('/attendance/:id', protect, deleteAttendance); // <-- ADD THIS LINE
router.delete('/attendance', protect, wipeAllAttendance); // <-- ADD THIS LINE
module.exports = router;