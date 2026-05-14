// backend/controllers/courseController.js
const Course = require('../models/Course');
const cloudinary = require('../config/cloudinary');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin or Teacher
const createCourse = async (req, res) => {
    try {
        const { title, description, price, batchTime } = req.body;
        let thumbnailUrl = '';

        // Check if a file was uploaded
        if (req.file) {
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'lms_thumbnails',
            });
            thumbnailUrl = result.secure_url;
        }

        const course = await Course.create({
            title,
            description,
            price, // Keeping price field for future payment module, even if skipped now
            batchTime,
            instructor: req.user._id,
            thumbnail: thumbnailUrl
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create course', error: error.message });
    }
};

// @desc    Get all published courses (For marketing site)
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        // Find all courses. In production, you might only want { isPublished: true }
        const courses = await Course.find({}).populate('instructor', 'name email');
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single course details
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name email');
        
        if (course) {
            res.status(200).json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { createCourse, getCourses, getCourseById };