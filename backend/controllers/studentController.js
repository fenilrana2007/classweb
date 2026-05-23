// // backend/controllers/studentController.js
// const User = require('../models/User');
// const Attendance = require('../models/Attendance');
// const Message = require('../models/Message');
// const bcrypt = require('bcryptjs'); 
// const Exam = require('../models/Exam');
// const ClassLog = require('../models/ClassLog');

// const addStudent = async (req, res) => {
//     try {
//         const { name, email, phone, std, batch, bgroup, password } = req.body;
        
//         const existing = await User.findOne({ email });
//         if (existing) return res.status(400).json({ message: "User with this email already exists" });

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newStudent = await User.create({
//             name, email, password: hashedPassword, phone, std, batch, bgroup, role: 'student'
//         });

//         newStudent.password = undefined; 
//         res.status(201).json(newStudent);
//     } catch (error) { res.status(500).json({ message: 'Server Error adding student' }); }
// };

// const getStudents = async (req, res) => {
//     try {
//         const students = await User.find({ role: 'student' }).select('-password').sort({ name: 1 });
//         res.json(students);
//     } catch (error) { res.status(500).json({ message: 'Server Error fetching students' }); }
// };

// const getStudentDashboardData = async (req, res) => {
//     try {
//         const messages = await Message.find({ recipientGroup: 'All Students' })
//             .populate('sender', 'name role')
//             .sort({ createdAt: -1 });

//         const attendanceDocs = await Attendance.find({ 'records.studentId': req.user._id })
//             .sort({ date: -1 });
            
//         let myAttendance = [];
//         attendanceDocs.forEach(doc => {
//             if (doc.records) {
//                 const record = doc.records.find(r => 
//                     r.studentId && r.studentId.toString() === req.user._id.toString()
//                 );
//                 if (record) {
//                     myAttendance.push({ date: doc.date, status: record.status });
//                 }
//             }
//         });

//         const myExams = await Exam.find({ 'marks.studentId': req.user._id })
//             .sort({ examDate: -1 });

//         const formattedExams = myExams.map(exam => {
//             const myMarkRecord = exam.marks.find(m => m.studentId.toString() === req.user._id.toString());
//             const passThreshold = exam.minPassMarks || 35;
//             let status = 'Fail';
//             if (myMarkRecord.isAbsent) status = 'Absent';
//             else if (myMarkRecord.obtainedMarks >= passThreshold) status = 'Pass';

//             return {
//                 _id: exam._id,
//                 name: exam.name,
//                 examDate: exam.examDate,
//                 maxMarks: exam.maxMarks,
//                 minPassMarks: passThreshold,
//                 obtainedMarks: myMarkRecord.obtainedMarks,
//                 isAbsent: myMarkRecord.isAbsent,
//                 status: status,
//                 percentage: myMarkRecord.isAbsent ? 0 : Math.round((myMarkRecord.obtainedMarks / exam.maxMarks) * 100)
//             };
//         });

//         res.json({ messages, attendance: myAttendance, exams: formattedExams });
//     } catch (error) {
//         console.error("Dashboard Error:", error);
//         res.status(500).json({ message: 'Server Error loading dashboard' });
//     }
// };

// const deleteAllStudents = async (req, res) => {
//     try {
//         await User.deleteMany({ role: 'student' });
//         res.json({ message: 'All student accounts have been permanently deleted.' });
//     } catch (error) { res.status(500).json({ message: 'Server Error during student cleanup' }); }
// };

// const getMyClassLogs = async (req, res) => {
//     try {
//         const logs = await ClassLog.find({
//             std: req.user.std,
//             batch: { $in: [req.user.batch, 'All Batches'] }
//         }).sort({ date: -1 }); 
        
//         res.json(logs);
//     } catch (error) { res.status(500).json({ message: 'Error fetching class logs' }); }
// };

// module.exports = { addStudent, getStudents, getStudentDashboardData, deleteAllStudents, getMyClassLogs };
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs'); 
const Exam = require('../models/Exam');
const ClassLog = require('../models/ClassLog');

const addStudent = async (req, res) => {
    try {
        const { name, email, phone, std, batch, bgroup, password } = req.body;
        
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User with this email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStudent = await User.create({
            name, email, password: hashedPassword, phone, std, batch, bgroup, role: 'student'
        });

        newStudent.password = undefined; 
        res.status(201).json(newStudent);
    } catch (error) { res.status(500).json({ message: 'Server Error adding student' }); }
};

const getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password').sort({ name: 1 });
        res.json(students);
    } catch (error) { res.status(500).json({ message: 'Server Error fetching students' }); }
};

// --- NEW: Update Student ---
const updateStudent = async (req, res) => {
    try {
        const { name, email, phone, std, batch, bgroup, password } = req.body;
        let student = await User.findById(req.params.id);

        if (!student) return res.status(404).json({ message: "Student not found" });

        // Update fields
        student.name = name || student.name;
        student.email = email || student.email;
        student.phone = phone !== undefined ? phone : student.phone;
        student.std = std || student.std;
        student.batch = batch || student.batch;
        student.bgroup = bgroup !== undefined ? bgroup : student.bgroup;

        // Securely hash the new password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            student.password = await bcrypt.hash(password, salt);
        }

        const updatedStudent = await student.save();
        updatedStudent.password = undefined; // Don't send password back to frontend
        
        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating student' });
    }
};

// --- NEW: Delete Specific Student ---
const deleteStudent = async (req, res) => {
    try {
        const student = await User.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });
        
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error deleting student' });
    }
};

// --- NEW: Toggle Block Status ---
const toggleBlockStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Flip the boolean
        student.isBlocked = !student.isBlocked;
        await student.save();

        student.password = undefined;
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating status' });
    }
};

const getStudentDashboardData = async (req, res) => {
    try {
        const messages = await Message.find({ recipientGroup: 'All Students' })
            .populate('sender', 'name role')
            .sort({ createdAt: -1 });

        const attendanceDocs = await Attendance.find({ 'records.studentId': req.user._id })
            .sort({ date: -1 });
            
        let myAttendance = [];
        attendanceDocs.forEach(doc => {
            if (doc.records) {
                const record = doc.records.find(r => 
                    r.studentId && r.studentId.toString() === req.user._id.toString()
                );
                if (record) {
                    myAttendance.push({ date: doc.date, status: record.status });
                }
            }
        });

        const myExams = await Exam.find({ 'marks.studentId': req.user._id })
            .sort({ examDate: -1 });

        const formattedExams = myExams.map(exam => {
            const myMarkRecord = exam.marks.find(m => m.studentId.toString() === req.user._id.toString());
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
        await User.deleteMany({ role: 'student' });
        res.json({ message: 'All student accounts have been permanently deleted.' });
    } catch (error) { res.status(500).json({ message: 'Server Error during student cleanup' }); }
};

const getMyClassLogs = async (req, res) => {
    try {
        const logs = await ClassLog.find({
            std: req.user.std,
            batch: { $in: [req.user.batch, 'All Batches'] }
        }).sort({ date: -1 }); 
        
        res.json(logs);
    } catch (error) { res.status(500).json({ message: 'Error fetching class logs' }); }
};

module.exports = { 
    addStudent, 
    getStudents, 
    updateStudent,        // Exported
    deleteStudent,        // Exported
    toggleBlockStudent,   // Exported
    getStudentDashboardData, 
    deleteAllStudents, 
    getMyClassLogs 
};