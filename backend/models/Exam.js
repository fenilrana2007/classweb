const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    name: { type: String, required: true },
    std: { type: String, required: true },
    batch: { type: String, required: true }, 
    maxMarks: { type: Number, required: true },
    minPassMarks: { type: Number, required: true, default: 35 }, // <-- NEW FIELD
    examDate: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    marks: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        obtainedMarks: { type: Number },
        isAbsent: { type: Boolean, default: false }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);