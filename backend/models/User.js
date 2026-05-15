// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { 
        type: String, 
        enum: ['student', 'teacher', 'admin'], 
        default: 'student' 
    },
    // Tuition-Specific Fields
    std: { type: String }, // e.g., "10th", "11th Science"
    batch: { type: String, enum: ['Morning', 'Evening', ''] }, 
    bgroup: { type: String }, // Blood group
    
    // Management Toggles
    isBlocked: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);