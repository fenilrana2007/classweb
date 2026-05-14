const express = require('express');
const router = express.Router();
const { createSchedule, getSchedules } = require('../controllers/scheduleController');
const { protect, teacherOrAdmin } = require('../middlewares/authMiddleware');

router.post('/', protect, teacherOrAdmin, createSchedule);
router.get('/', protect, getSchedules);

module.exports = router;