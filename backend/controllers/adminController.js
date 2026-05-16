const User = require('../models/User');
const Schedule = require('../models/Schedule');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs');

// 1. Get Platform-Wide Stats
const getAdminStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        
        // Count schedules for today
        const startOfDay = new Date().setHours(0, 0, 0, 0);
        const endOfDay = new Date().setHours(23, 59, 59, 999);
        const classesToday = await Schedule.countDocuments({ date: { $gte: startOfDay, $lte: endOfDay } });

        res.json({ totalStudents, totalTeachers, classesToday });
    } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// 2. Manage Teachers (Fetch, Add, Block, Delete)
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
// Add this to update a teacher's details
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

// Add these for the Admin Noticeboard & Broadcast system
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
module.exports = {
    getAdminStats, getTeachers, addTeacher, toggleBlockUser, deleteUser,updateTeacher, getMessages, sendMessage
};
