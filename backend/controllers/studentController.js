const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs'); 
const Exam = require('../models/Exam'); // Make sure to import the Exam model at the top!
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

// const getStudentDashboardData = async (req, res) => {
//     try {
//         // 1. Fetch Messages targeted to Students
//         const messages = await Message.find({ recipientGroup: 'All Students' })
//             .populate('sender', 'name role')
//             .sort({ createdAt: -1 });

//         // 2. Fetch the logged-in student's personal attendance history
//         const attendanceDocs = await Attendance.find({ 'records.studentId': req.user._id })
//             .sort({ date: -1 }); // Newest first
            
//         const myAttendance = attendanceDocs.map(doc => {
//             const record = doc.records.find(r => r.studentId.toString() === req.user._id.toString());
//             return { 
//                 date: doc.date, 
//                 status: record ? record.status : 'Unknown' 
//             };
//         });

//         // Send it all back without the schedule data!
//         res.json({ messages, attendance: myAttendance });
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error loading dashboard' });
//     }
// };
const getStudentDashboardData = async (req, res) => {
    try {
        // 1. Fetch Messages
        const messages = await Message.find({ recipientGroup: 'All Students' })
            .populate('sender', 'name role')
            .sort({ createdAt: -1 });

        // 2. Fetch Attendance
        const attendanceDocs = await Attendance.find({ 'records.studentId': req.user._id })
            .sort({ date: -1 });
            
        const myAttendance = attendanceDocs.map(doc => {
            const record = doc.records.find(r => r.studentId.toString() === req.user._id.toString());
            return { date: doc.date, status: record ? record.status : 'Unknown' };
        });

        // 3. NEW: Fetch My Exams (Securely filtering by student ID)
        const myExams = await Exam.find({ 'marks.studentId': req.user._id })
            .sort({ examDate: -1 });

        // Extract ONLY this student's marks from the exams
        const formattedExams = myExams.map(exam => {
            const myMarkRecord = exam.marks.find(m => m.studentId.toString() === req.user._id.toString());
            
            // Calculate status exactly as the teacher sees it
            const passThreshold = exam.minPassMarks || 35;
            let status = 'Fail';
            if (myMarkRecord.isAbsent) status = 'Absent';
            else if (myMarkRecord.obtainedMarks >= passThreshold) status = 'Pass';

            return {
                _id: exam._id,
                name: exam.name,
                examDate: exam.examDate,
                maxMarks: exam.maxMarks,
                minPassMarks: passThreshold,
                obtainedMarks: myMarkRecord.obtainedMarks,
                isAbsent: myMarkRecord.isAbsent,
                status: status,
                percentage: myMarkRecord.isAbsent ? 0 : Math.round((myMarkRecord.obtainedMarks / exam.maxMarks) * 100)
            };
        });

        res.json({ messages, attendance: myAttendance, exams: formattedExams });
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: 'Server Error loading dashboard' });
    }
};
const deleteAllStudents = async (req, res) => {
    try {
        // We only delete users with the 'student' role
        await User.deleteMany({ role: 'student' });
        res.json({ message: 'All student accounts have been permanently deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error during student cleanup' });
    }
};
module.exports = { addStudent, getStudents, getStudentDashboardData, deleteAllStudents };