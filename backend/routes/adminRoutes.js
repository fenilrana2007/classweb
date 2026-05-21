// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getAdminStats, 
    getTeachers, 
    addTeacher, 
    toggleBlockUser, 
    deleteUser, 
    updateTeacher, 
    getMessages, 
    sendMessage, 
    purgeSystemAll,
    deleteAllMessages,
    wipeExams,
    wipeFees,
    wipeGallery
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Route Security Guard
router.use(protect, adminOnly || require('../middlewares/authMiddleware').teacherOrAdmin);

// Core Administrative Endpoints
router.get('/stats', getAdminStats);
router.get('/teachers', getTeachers);
router.post('/teachers', addTeacher);
router.put('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);
router.put('/teachers/:id', updateTeacher);
router.get('/messages', getMessages);
router.post('/messages', sendMessage);

// =========================================================================
// THE MULTI-PURGE PURGATORY CONTROL INTERCEPT ROUTERS
// =========================================================================

router.delete('/students/all-cleanup', purgeSystemAll);        // Option 1: Global Wipe (Keeps Gallery Safe)
router.delete('/messages', deleteAllMessages);                 // Option 3: Noticeboard Wipe
router.delete('/exams-wipe-all', wipeExams);                   // Option 4: Academic Exams Wipe
router.delete('/fees-wipe-all', wipeFees);                     // Option 5: Financial Fee Ledger Wipe
router.delete('/achievements-wipe-all', wipeGallery);           // Option 6: Hall of Fame Gallery Wipe

module.exports = router;