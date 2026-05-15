// backend/controllers/teacherController.js
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs');

const getTeacherStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        res.json({ batches: 4, totalStudents, classesToday: 2 });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.json(students);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const addStudent = async (req, res) => {
    try {
        const { name, email, phone, password, std, batch, bgroup } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStudent = await User.create({
            name, email, phone, password: hashedPassword, role: 'student', std, batch, bgroup
        });
        res.status(201).json(newStudent);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// THE FIX: This is the update function your frontend is looking for!
const updateStudent = async (req, res) => {
    try {
        const { name, phone, std, batch, bgroup } = req.body;
        
        const updatedStudent = await User.findByIdAndUpdate(
            req.params.id,
            { name, phone, std, batch, bgroup },
            { new: true } 
        ).select('-password');

        if (!updatedStudent) return res.status(404).json({ message: 'Student not found in DB' });
        
        res.json(updatedStudent);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const toggleBlockStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        student.isBlocked = !student.isBlocked; 
        await student.save();
        res.json(student); // Send back updated student
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const deleteStudent = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const submitAttendance = async (req, res) => {
    try {
        const { date, std, batch, records } = req.body;
        const attendance = await Attendance.create({ date, std, batch, records, submittedBy: req.user._id });
        res.status(201).json(attendance);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const sendMessage = async (req, res) => {
    try {
        const { recipientGroup, content } = req.body;
        const message = await Message.create({ sender: req.user._id, recipientGroup, content });
        res.status(201).json(message);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};
// Add this new function to fetch attendance
const getAttendance = async (req, res) => {
    try {
        const { date, std, batch } = req.query;
        
        // Build our search filter
        let query = { date };
        if (std && std !== 'All') query.std = std;
        if (batch && batch !== 'All') query.batch = batch;

        // Find the record and "populate" the studentId so we get their actual names!
        const attendanceRecords = await Attendance.find(query).populate('records.studentId', 'name std batch');
        
        res.json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
// Fetch messages for the dashboard
const getMessages = async (req, res) => {
    try {
        // Fetch all messages, sort by newest first, and get the sender's name
        const messages = await Message.find()
            .populate('sender', 'name role')
            .sort({ createdAt: -1 }); 
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
module.exports = {
    getTeacherStats, getStudents, addStudent, updateStudent, toggleBlockStudent, deleteStudent, submitAttendance, sendMessage, getAttendance,getMessages
};