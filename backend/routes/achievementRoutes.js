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
router.get('/', protect, getAchievements); 
router.post('/', protect, createAchievement); 
router.put('/:id', protect, updateAchievement); 
router.delete('/:id', protect, deleteAchievement);

module.exports = router;