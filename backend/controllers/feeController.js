const { FeeStructure, FeeReceipt } = require('../models/Fee');
const User = require('../models/User');

// ==========================================
// ADMIN: Master Fee Structure
// ==========================================
const setFeeStructure = async (req, res) => {
    try {
        const { std, totalFee } = req.body;
        // Upsert: Update if exists, Create if it doesn't
        const structure = await FeeStructure.findOneAndUpdate(
            { std }, { totalFee }, { new: true, upsert: true }
        );
        res.json(structure);
    } catch (error) { res.status(500).json({ message: 'Error setting fee structure' }); }
};

const getFeeStructure = async (req, res) => {
    try {
        const structures = await FeeStructure.find();
        res.json(structures);
    } catch (error) { res.status(500).json({ message: 'Error fetching fee structure' }); }
};

// ==========================================
// ADMIN: Collect & View Payments
// ==========================================
const recordPayment = async (req, res) => {
    try {
        const { studentId, amountPaid, paidBy, paymentMode } = req.body;
        
        const receipt = await FeeReceipt.create({
            studentId, amountPaid, paidBy, paymentMode,
            receivedBy: req.user.name // Auto-fetch logged-in admin's name
        });
        
        // Populate student info before sending back
        await receipt.populate('studentId', 'name std batch');
        res.status(201).json(receipt);
    } catch (error) { res.status(500).json({ message: 'Error recording payment' }); }
};

const getAllPayments = async (req, res) => {
    try {
        const payments = await FeeReceipt.find()
            .populate('studentId', 'name std batch')
            .sort({ date: -1 }); // Newest first
        res.json(payments);
    } catch (error) { res.status(500).json({ message: 'Error fetching payments' }); }
};

// ==========================================
// STUDENT: Get My Fee Status
// ==========================================
const getMyFeeStatus = async (req, res) => {
    try {
        const student = await User.findById(req.user._id);
        
        // 1. Get the total fee for their standard
        const structure = await FeeStructure.findOne({ std: student.std });
        const totalFee = structure ? structure.totalFee : 0;

        // 2. Get all their past payments
        const receipts = await FeeReceipt.find({ studentId: req.user._id }).sort({ date: -1 });
        
        // 3. Calculate how much they have paid in total
        const totalPaid = receipts.reduce((sum, receipt) => sum + receipt.amountPaid, 0);
        const remainingDue = totalFee - totalPaid;

        res.json({ totalFee, totalPaid, remainingDue, history: receipts });
    } catch (error) { res.status(500).json({ message: 'Error fetching student fees' }); }
};
// ==========================================
// ADMIN: Update & Delete Payments
// ==========================================
const updatePayment = async (req, res) => {
    try {
        const receipt = await FeeReceipt.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('studentId', 'name std batch email phone');
        res.json(receipt);
    } catch (error) { res.status(500).json({ message: 'Error updating payment' }); }
};

const deletePayment = async (req, res) => {
    try {
        await FeeReceipt.findByIdAndDelete(req.params.id);
        res.json({ message: 'Payment deleted successfully' });
    } catch (error) { res.status(500).json({ message: 'Error deleting payment' }); }
};
const deleteAllPayments = async (req, res) => {
    await FeeReceipt.deleteMany({});
    res.json({ message: 'All payments wiped.' });
};
// Update your module.exports to include them:
module.exports = { setFeeStructure, getFeeStructure, recordPayment, getAllPayments, getMyFeeStatus, updatePayment, deletePayment, deleteAllPayments };
