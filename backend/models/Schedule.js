const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    time: { type: String, required: true },
    date: { type: Date, required: true },
    type: { 
        type: String, 
        enum: ['Live Class', 'Exam', 'Assignment'], 
        default: 'Live Class' 
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);