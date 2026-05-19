const express = require('express');
const router = express.Router();
const { createExam, getExams, updateMarks, deleteExam } = require('../controllers/examController');

router.post('/', createExam);
router.get('/', getExams);
router.put('/:examId/marks', updateMarks);
router.delete('/:id', deleteExam);

module.exports = router;