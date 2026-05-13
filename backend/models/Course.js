const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    price: { type: Number, required: true },
    thumbnail: { type: String }, // Cloudinary URL
    modules: [{
        title: String,
        videos: [{
            title: String,
            videoUrl: String, // Secure streaming URL
            duration: Number
        }],
        notes: [{ title: String, fileUrl: String }]
    }],
    batchTime: { type: String },
    isPublished: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);