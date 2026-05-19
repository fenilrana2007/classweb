const mongoose = require('mongoose');

// 1. Master Fee Structure (Admin sets this once per standard)
const feeStructureSchema = new mongoose.Schema({
    std: { type: String, required: true, unique: true },
    totalFee: { type: Number, required: true, default: 0 }
});

// 2. Individual Payment Receipts
const feeReceiptSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amountPaid: { type: Number, required: true },
    paidBy: { type: String, required: true }, // e.g., "Ramesh (Father)" or "Self"
    receivedBy: { type: String, required: true }, // The Admin/Staff name who collected it
    paymentMode: { type: String, default: 'Cash' }, // Cash, UPI, Bank
    date: { type: Date, default: Date.now }
});

const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);
const FeeReceipt = mongoose.model('FeeReceipt', feeReceiptSchema);

module.exports = { FeeStructure, FeeReceipt };