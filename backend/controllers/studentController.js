const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs'); 

// ==========================================
// ADMIN / TEACHER FUNCTIONS (Manage Students)
// ==========================================

const addStudent = async (req, res) => {
    try {
        const { name, email, phone, std, batch, bgroup, password } = req.body;
        
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User with this email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStudent = await User.create({
            name, 
            email, 
            password: hashedPassword, 
            phone, 
            std, 
            batch, 
            bgroup,
            role: 'student'
        });

        newStudent.password = undefined; 
        res.status(201).json(newStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error adding student' });
    }
};

const getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' })
                                   .select('-password') 
                                   .sort({ name: 1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching students' });
    }
};

// ==========================================
// STUDENT PORTAL FUNCTIONS (Personal Data)
// ==========================================

const getStudentDashboardData = async (req, res) => {
    try {
        // 1. Fetch Messages targeted to Students
        const messages = await Message.find({ recipientGroup: 'All Students' })
            .populate('sender', 'name role')
            .sort({ createdAt: -1 });

        // 2. Fetch the logged-in student's personal attendance history
        const attendanceDocs = await Attendance.find({ 'records.studentId': req.user._id })
            .sort({ date: -1 }); // Newest first
            
        const myAttendance = attendanceDocs.map(doc => {
            const record = doc.records.find(r => r.studentId.toString() === req.user._id.toString());
            return { 
                date: doc.date, 
                status: record ? record.status : 'Unknown' 
            };
        });

        // Send it all back without the schedule data!
        res.json({ messages, attendance: myAttendance });
    } catch (error) {
        res.status(500).json({ message: 'Server Error loading dashboard' });
    }
};

module.exports = { addStudent, getStudents, getStudentDashboardData };