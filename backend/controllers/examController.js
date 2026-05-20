const Exam = require('../models/Exam');
const User = require('../models/User');

// Create a new empty exam
const createExam = async (req, res) => {
    try {
        const exam = await Exam.create(req.body);
        res.status(201).json(exam);
    } catch (error) {
        res.status(500).json({ message: 'Error creating exam' });
    }
};

// Get all exams with populated student names
const getExams = async (req, res) => {
    try {
        const exams = await Exam.find()
            .populate('marks.studentId', 'name email phone')
            .sort({ examDate: -1 });
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exams' });
    }
};

// Update Marks for an Exam
const updateMarks = async (req, res) => {
    try {
        const { examId } = req.params;
        const { marks } = req.body; // Array of { studentId, obtainedMarks, isAbsent }
        
        const exam = await Exam.findByIdAndUpdate(
            examId, 
            { marks }, 
            { new: true }
        ).populate('marks.studentId', 'name email phone');
        
        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: 'Error saving marks' });
    }
};

// Delete Exam
const deleteExam = async (req, res) => {
    try {
        await Exam.findByIdAndDelete(req.params.id);
        res.json({ message: 'Exam deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting exam' });
    }
};
const deleteAllExams = async (req, res) => {
    try {
        await Exam.deleteMany({});
        res.json({ message: 'All exams and marks wiped successfully.' });
    } catch (error) {
        console.error("Wipe Exams Error:", error);
        res.status(500).json({ message: 'Error wiping exams from database' });
    }
};

// Make sure it is exported!
//module.exports = { createExam, getExams, updateMarks, deleteExam, deleteAllExams };
module.exports = { createExam, getExams, updateMarks, deleteExam , deleteAllExams};