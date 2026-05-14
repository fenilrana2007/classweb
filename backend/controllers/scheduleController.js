const Schedule = require('../models/Schedule');

// @desc    Create a new schedule event
// @route   POST /api/schedules
// @access  Private/Admin
const createSchedule = async (req, res) => {
    try {
        const { title, time, date, type } = req.body;
        const schedule = await Schedule.create({
            title, time, date, type, createdBy: req.user._id
        });
        res.status(201).json(schedule);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all schedules (Ordered by closest date)
// @route   GET /api/schedules
// @access  Private
const getSchedules = async (req, res) => {
    try {
        // Fetch schedules that are for today or the future, sorted by date
        const schedules = await Schedule.find({ date: { $gte: new Date().setHours(0,0,0,0) } })
                                        .sort({ date: 1 });
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createSchedule, getSchedules };