const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    academicYear: { type: String, required: true }, // e.g., "2025-2026"
    studentName: { type: String, required: true },
    std: { type: String, required: true },
    batch: { type: String, required: true },
    subjectMarks: { type: String }, // e.g., "Math: 99, Science: 95"
    result: { type: String, required: true }, // e.g., "1st Rank in School"
    photos: [{ type: String }], // Array of Cloudinary URLs
    customFields: [{
        title: { type: String },
        value: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);