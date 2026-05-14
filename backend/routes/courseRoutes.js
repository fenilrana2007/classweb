// backend/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const { createCourse, getCourses, getCourseById } = require('../controllers/courseController');
const { protect, teacherOrAdmin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected routes (Only Teachers or Admins can create courses)
// We use upload.single('thumbnail') to look for a file attached to the field 'thumbnail'
router.post('/', protect, teacherOrAdmin, upload.single('thumbnail'), createCourse);

module.exports = router;