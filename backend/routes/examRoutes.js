const express = require('express');
const router = express.Router();
const { createExam, getExams, updateMarks, deleteExam ,deleteAllExams} = require('../controllers/examController');
const { protect } = require('../middlewares/authMiddleware'); // Assuming you have protect
router.post('/', protect, createExam);
router.get('/', protect, getExams);
router.put('/:examId/marks', protect, updateMarks);
router.delete('/:id', protect, deleteExam);
router.delete('/all', protect, deleteAllExams);
module.exports = router;