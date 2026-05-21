// backend/controllers/adminController.js
const User = require('../models/User');
const Message = require('../models/Message');
const Attendance = require('../models/Attendance');
const ClassLog = require('../models/ClassLog');
const Exam = require('../models/Exam'); 
const Fee = require('../models/Fee'); 
const Achievement = require('../models/Achievement');
const bcrypt = require('bcryptjs');

// 1. Get Platform-Wide Stats
const getAdminStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        
        const classesToday = 0; 
        
        res.json({ 
            totalStudents, 
            totalTeachers, 
            classesToday 
        });
    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 2. Manage Teachers (Fetch, Add, Block, Delete, Update)
const getTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('-password');
        res.json(teachers);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const addTeacher = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newTeacher = await User.create({
            name, email, phone, password: hashedPassword, role: 'teacher'
        });
        res.status(201).json(newTeacher);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.isBlocked = !user.isBlocked; 
        await user.save();
        res.json(user);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const updateTeacher = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const updatedTeacher = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, phone },
            { new: true } 
        ).select('-password');

        if (!updatedTeacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json(updatedTeacher);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// 3. Admin Noticeboard & Broadcast System
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().populate('sender', 'name role').sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const sendMessage = async (req, res) => {
    try {
        const { recipientGroup, content } = req.body;
        const message = await Message.create({ sender: req.user._id, recipientGroup, content });
        res.status(201).json(message);
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// =========================================================================
// SYSTEM PURGE SUB-ENGINE OPERATIONS (THE 6 SECTOR WIPES)
// =========================================================================

// OPTION 1: GLOBAL SYSTEM RESET (MODIFIED: GALLERY / ACHIEVEMENT DATA EXCLUDED)
const purgeSystemAll = async (req, res) => {
    try {
        await Promise.all([
            User.deleteMany({ role: 'student' }), // Drops student accounts cleanly
            Attendance.deleteMany({}),           // Drops global attendance logs
            Message.deleteMany({}),              // Drops noticeboard feeds
            Exam.deleteMany({}),                 // Drops all academic exams records
            ClassLog.deleteMany({})              // Drops teacher daily class work updates
            // Achievement.deleteMany({}) <--- EXCLUDED: Gallery is safely kept!
        ]);
        res.json({ message: 'Global system reset complete. Faculty accounts and Achievement Gallery items preserved successfully.' });
    } catch (err) {
        console.error("Global Purge Error:", err);
        res.status(500).json({ message: 'Server Error during global cleanup reset' });
    }
};

// OPTION 3: INDEPENDENT NOTICEBOARD FEED CLEAR
const deleteAllMessages = async (req, res) => {
    try {
        await Message.deleteMany({}); 
        res.json({ message: 'All platform messages have been permanently deleted.' });
    } catch (error) { 
        res.status(500).json({ message: 'Server Error' }); 
    }
};

// OPTION 4: INDEPENDENT ACADEMIC EXAMS CLEANUP
const wipeExams = async (req, res) => {
    try {
        await Exam.deleteMany({});
        res.json({ message: 'All student examination records and marks report sets deleted.' });
    } catch (error) {
        console.error("Wipe Exams Error:", error);
        res.status(500).json({ message: 'Server Error wiping examinations data' });
    }
};

// OPTION 5: INDEPENDENT FINANCIAL SNAPSHOT FLUSH
const wipeFees = async (req, res) => {
    try {
        await Fee.deleteMany({});
        res.json({ message: 'All transaction ledger collections and generated receipts flushed cleanly.' });
    } catch (error) {
        console.error("Wipe Fees Error:", error);
        res.status(500).json({ message: 'Server Error flushing financial files database logs' });
    }
};

// OPTION 6: INDEPENDENT GALLERY MASTER RESET
const wipeGallery = async (req, res) => {
    try {
        await Achievement.deleteMany({});
        res.json({ message: 'Hall of Fame student gallery has been reset.' });
    } catch (error) {
        console.error("Wipe Gallery Error:", error);
        res.status(500).json({ message: 'Server Error resetting achievement data records' });
    }
};

module.exports = {
    getAdminStats, getTeachers, addTeacher, toggleBlockUser, deleteUser, updateTeacher, 
    getMessages, sendMessage, 
    purgeSystemAll,    // Option 1
    deleteAllMessages, // Option 3
    wipeExams,         // Option 4
    wipeFees,          // Option 5
    wipeGallery        // Option 6
};