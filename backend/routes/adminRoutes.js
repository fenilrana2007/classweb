const express = require('express');
const router = express.Router();
const { 
    getAdminStats, getTeachers, addTeacher, toggleBlockUser, deleteUser, updateTeacher, getMessages, sendMessage 
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Ensure you actually have an `adminOnly` middleware in authMiddleware.js! 
// If you only have `teacherOrAdmin`, use `teacherOrAdmin` for now, but adminOnly is better.
router.use(protect, adminOnly || require('../middlewares/authMiddleware').teacherOrAdmin);

router.get('/stats', getAdminStats);
router.get('/teachers', getTeachers);
router.post('/teachers', addTeacher);
router.put('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);
// Add these lines right below your other router lines:
router.put('/teachers/:id', updateTeacher);
router.get('/messages', getMessages);
router.post('/messages', sendMessage);
module.exports = router;