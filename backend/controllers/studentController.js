const Attendance = require('../models/Attendance');
const Message = require('../models/Message');
const Schedule = require('../models/Schedule');

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

        // 3. Fetch Upcoming Schedules (Today and future dates)
        const schedules = await Schedule.find({ date: { $gte: new Date().setHours(0,0,0,0) } })
            .sort({ date: 1 });

        // Send it all back in one fast package!
        res.json({ messages, attendance: myAttendance, schedules });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getStudentDashboardData };