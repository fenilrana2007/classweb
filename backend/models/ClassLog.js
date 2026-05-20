const mongoose = require('mongoose');

const classLogSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    std: { type: String, required: true },
    batch: { type: String, required: true },
    subject: { type: String, required: true },
    topicTaught: { type: String, required: true },
    homework: { type: String },
    attachmentLink: { type: String }, // Google Drive or Cloudinary URL
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('ClassLog', classLogSchema);