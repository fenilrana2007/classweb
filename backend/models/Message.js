const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipientGroup: { type: String, required: true }, // e.g., "Admin", "10th-Morning"
    content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);