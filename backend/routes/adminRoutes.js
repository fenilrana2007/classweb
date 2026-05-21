// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getAdminStats, 
    getTeachers, 
    addTeacher, 
    updateTeacher, 
    toggleBlockUser, 
    deleteUser, 
    getMessages, 
    sendMessage, 
    getGlobalClassLogs,
    purgeSystemAll,
    wipeAttendance,
    deleteAllMessages,
    wipeExams,
    wipeFees,
    wipeGallery
} = require('../controllers/adminController');

// Ensure you import your authentication middleware correctly
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Route Security Guard: Everything below this requires Admin privileges
// Fallback to teacherOrAdmin if adminOnly is not defined in your middleware
router.use(protect, adminOnly || require('../middlewares/authMiddleware').teacherOrAdmin);

// =========================================================================
// STANDARD ADMINISTRATIVE ENDPOINTS
// =========================================================================
router.get('/stats', getAdminStats);
router.get('/teachers', getTeachers);
router.post('/teachers', addTeacher);
router.put('/teachers/:id', updateTeacher);
router.put('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);
router.get('/messages', getMessages);
router.post('/messages', sendMessage);
router.get('/class-logs', getGlobalClassLogs);

// =========================================================================
// THE MULTI-PURGE CONTROL INTERCEPT ROUTERS
// =========================================================================
router.delete('/purge-all', purgeSystemAll);           // 1. Global System Reset
router.delete('/purge-attendance', wipeAttendance);    // 2. Attendance Wipe
router.delete('/purge-messages', deleteAllMessages);   // 3. Noticeboard Wipe
router.delete('/purge-exams', wipeExams);              // 4. Academic Exams Wipe
router.delete('/purge-fees', wipeFees);                // 5. Financial Fee Ledger Wipe
router.delete('/purge-gallery', wipeGallery);          // 6. Hall of Fame Gallery Wipe

module.exports = router;