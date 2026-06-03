// backend/controllers/teacherController.js
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs');
const ClassLog = require('../models/ClassLog');

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
        res.json(student); 
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const deleteStudent = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// ==========================================
// ATTENDANCE MANAGEMENT ENGINE
// ==========================================

const submitAttendance = async (req, res) => {
    try {
        const { date, std, batch, records } = req.body;
        let attendance = await Attendance.findOne({ date, std, batch });
        
        if (attendance) {
            attendance.records = records; 
            await attendance.save();
        } else {
            attendance = await Attendance.create({ date, std, batch, records, submittedBy: req.user._id });
        }
        res.status(200).json(attendance);
    } catch (error) { res.status(500).json({ message: 'Server Error Saving Attendance' }); }
};

const getAttendance = async (req, res) => {
    try {
        const { date, std, batch, month } = req.query;
        let query = {};
        
        // UPGRADE: If date is 'All', do not filter by date. Fetch the whole ledger instead.
        if (date && date !== 'All') {
            query.date = date;
        } else if (month && month !== 'All') {
            query.date = { $regex: new RegExp('^' + month) };
        }
        
        if (std && std !== 'All') query.std = std;
        if (batch && batch !== 'All') query.batch = batch;

        const attendanceRecords = await Attendance.find(query).populate('records.studentId', 'name std batch');
        res.json(attendanceRecords);
    } catch (error) { res.status(500).json({ message: 'Server Error Fetching Attendance' }); }
};

const getStudentAttendanceSummary = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { month } = req.query;
        let query = { 'records.studentId': studentId };
        
        if (month && month !== 'All') {
            query.date = { $regex: new RegExp('^' + month) };
        }
        
        const attendanceRecords = await Attendance.find(query)
            .populate('records.studentId', 'name std batch')
            .populate('submittedBy', 'name role')
            .sort({ date: -1 });
            
        res.json(attendanceRecords);
    } catch (error) { res.status(500).json({ message: 'Server Error Fetching Student Attendance Summary' }); }
};

const deleteAttendance = async (req, res) => {
    try {
        await Attendance.findByIdAndDelete(req.params.id);
        res.json({ message: 'Specific attendance record deleted' });
    } catch (err) { res.status(500).json({ message: 'Error deleting attendance' }); }
};

const wipeAllAttendance = async (req, res) => {
    try {
        await Attendance.deleteMany({});
        res.json({ message: 'All attendance records wiped globally' });
    } catch (err) { res.status(500).json({ message: 'Error wiping attendance' }); }
};

// ==========================================
// MESSAGES & LOGS
// ==========================================

const sendMessage = async (req, res) => {
    try {
        const { recipientGroup, content } = req.body;
        const message = await Message.create({ sender: req.user._id, recipientGroup, content });
        res.status(201).json(message);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().populate('sender', 'name role').sort({ createdAt: -1 }); 
        res.json(messages);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const createClassLog = async (req, res) => {
    try {
        const log = await ClassLog.create({ ...req.body, teacherId: req.user._id });
        res.status(201).json(log);
    } catch (err) { res.status(500).json({ message: 'Error creating log' }); }
};

const getClassLogs = async (req, res) => {
    try {
        const logs = await ClassLog.find().sort({ date: -1 });
        res.json(logs);
    } catch (err) { res.status(500).json({ message: 'Error fetching logs' }); }
};

const updateClassLog = async (req, res) => {
    try {
        const log = await ClassLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(log);
    } catch (err) { res.status(500).json({ message: 'Error updating log' }); }
};

const deleteClassLog = async (req, res) => {
    try {
        await ClassLog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Log deleted' });
    } catch (err) { res.status(500).json({ message: 'Error deleting log' }); }
};

module.exports = {
    getTeacherStats, getStudents, addStudent, updateStudent, toggleBlockStudent, deleteStudent, 
    submitAttendance, getAttendance, getStudentAttendanceSummary, deleteAttendance, wipeAllAttendance, 
    sendMessage, getMessages, 
    createClassLog, getClassLogs, updateClassLog, deleteClassLog
};