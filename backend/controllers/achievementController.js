// const Achievement = require('../models/Achievement');

// const createAchievement = async (req, res) => {
//     try {
//         const achievement = await Achievement.create(req.body);
//         res.status(201).json(achievement);
//     } catch (err) { res.status(500).json({ message: 'Error creating achievement' }); }
// };

// const getAchievements = async (req, res) => {
//     try {
//         // Sort by newest academic year first
//         const achievements = await Achievement.find().sort({ academicYear: -1, createdAt: -1 });
//         res.json(achievements);
//     } catch (err) { res.status(500).json({ message: 'Error fetching achievements' }); }
// };

// const updateAchievement = async (req, res) => {
//     try {
//         const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(achievement);
//     } catch (err) { res.status(500).json({ message: 'Error updating achievement' }); }
// };

// const deleteAchievement = async (req, res) => {
//     try {
//         await Achievement.findByIdAndDelete(req.params.id);
//         res.json({ message: 'Achievement deleted' });
//     } catch (err) { res.status(500).json({ message: 'Error deleting achievement' }); }
// };

// module.exports = { createAchievement, getAchievements, updateAchievement, deleteAchievement };
const Achievement = require('../models/Achievement');

const createAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.create(req.body);
        res.status(201).json(achievement);
    } catch (err) { res.status(500).json({ message: 'Error creating achievement' }); }
};

const getAchievements = async (req, res) => {
    try {
        // Sort by newest first
        const achievements = await Achievement.find().sort({ academicYear: -1, createdAt: -1 });
        res.status(200).json(achievements);
    } catch (err) { res.status(500).json({ message: 'Error fetching achievements' }); }
};

const updateAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
        res.json(achievement);
    } catch (err) { res.status(500).json({ message: 'Error updating achievement' }); }
};

const deleteAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findByIdAndDelete(req.params.id);
        if (!achievement) return res.status(404).json({ message: 'Achievement not found' });
        res.json({ message: 'Achievement deleted' });
    } catch (err) { res.status(500).json({ message: 'Error deleting achievement' }); }
};

module.exports = { createAchievement, getAchievements, updateAchievement, deleteAchievement };