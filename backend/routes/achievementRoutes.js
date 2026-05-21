const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware'); // Ensures only logged-in users can access
const { 
    createAchievement, 
    getAchievements, 
    updateAchievement, 
    deleteAchievement 
} = require('../controllers/achievementController');

// The frontend calls /api/achievements, so the base routes are just '/'
app.use('/api/achievements', require('./routes/achievementRoutes'));
module.exports = router;