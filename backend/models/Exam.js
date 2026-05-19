const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    name: { type: String, required: true },
    std: { type: String, required: true },
    batch: { type: String, required: true }, // e.g., Morning, Evening, All
    maxMarks: { type: Number, required: true },
    examDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    marks: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        obtainedMarks: { type: Number },
        isAbsent: { type: Boolean, default: false }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);