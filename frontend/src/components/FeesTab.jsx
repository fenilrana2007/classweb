import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { IndianRupee, PlusCircle, Settings, History, CheckCircle, Trash2, Edit, Download } from 'lucide-react';
import { STANDARD_OPTIONS } from './StudentsTab';
import html2pdf from 'html2pdf.js'; // Ensure you installed this!
import { AuthContext } from '../context/AuthContext';

const FeesTab = () => {
  const { user } = useContext(AuthContext); // Admin details
  const [viewMode, setViewMode] = useState('collect');
  
  const [structures, setStructures] = useState([]);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]); 
  
  const [filterStd, setFilterStd] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  
  // Added editingId to track if we are updating a payment
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ studentId: '', amountPaid: '', paidBy: '', paymentMode: 'Cash' });

  const [structData, setStructData] = useState({ std: STANDARD_OPTIONS[9], totalFee: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [structRes, payRes, studentRes] = await Promise.all([
        api.get('/fees/structure'),
        api.get('/fees/all-payments'),
        api.get('/students') 
      ]);
      setStructures(structRes.data);
      setPayments(payRes.data);
      setStudents(studentRes.data);
    } catch (err) { console.error("Error loading fee data"); }
  };

//   const handleSaveStructure = async (e) => { ... } // (Keep your existing structure code here)
  const handleSaveStructure = async (e) => {
    e.preventDefault();
    try {
      await api.post('/fees/structure', structData);
      alert(`Master Fee for ${structData.std} updated successfully!`);
      fetchData(); 
    } catch (err) { alert("Failed to save fee structure"); }
  };

  // --- 1. CONFIRM & COLLECT PAYMENT ---
  const handleCollectPayment = async (e) => {
    e.preventDefault();
    if (!formData.studentId) return alert("Please select a student.");
    
    const student = students.find(s => s._id === formData.studentId);
    const confirmMsg = editingId 
      ? `Confirm UPDATE of ₹${formData.amountPaid} for ${student.name}?` 
      : `Confirm NEW payment of ₹${formData.amountPaid} from ${student.name}?`;
      
    if (!window.confirm(confirmMsg)) return; // <-- Payment Confirmation Step!

    try {
      if (editingId) {
        const res = await api.put(`/fees/pay/${editingId}`, formData);
        setPayments(payments.map(p => p._id === editingId ? res.data : p));
        alert("Payment Updated Successfully!");
      } else {
        const res = await api.post('/fees/pay', formData);
        setPayments([res.data, ...payments]);
        alert("Payment Recorded Successfully!");
      }
      setFormData({ studentId: '', amountPaid: '', paidBy: '', paymentMode: 'Cash' });
      setEditingId(null);
      setViewMode('history');
    } catch (err) { alert("Failed to record payment"); }
  };

  // --- 2. ADMIN CRUD OPERATIONS ---
  const handleEditClick = (payment) => {
    setEditingId(payment._id);
    setFormData({
      studentId: payment.studentId._id,
      amountPaid: payment.amountPaid,
      paidBy: payment.paidBy,
      paymentMode: payment.paymentMode
    });
    setViewMode('collect');
  };

  const handleDeletePayment = async (id) => {
    if(window.confirm("CRITICAL: Are you sure you want to permanently delete this payment receipt?")) {
      try {
        await api.delete(`/fees/pay/${id}`);
        setPayments(payments.filter(p => p._id !== id));
        alert("Payment deleted.");
      } catch (err) { alert("Error deleting payment."); }
    }
  };

  // --- 3. ADMIN RECEIPT DOWNLOAD ---
  const handleDownloadReceipt = (receipt) => {
    const student = receipt.studentId;
    const paymentDate = new Date(receipt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const paymentTime = new Date(receipt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // HTML Template (Hidden from view, used only for PDF generation)
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px; color: #111827; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="font-size: 32px; font-weight: 900; color: #1e3a8a; margin: 0; text-transform: uppercase;">Unique Coaching Class</h1>
          <p style="font-size: 18px; color: #4b5563; margin-top: 5px; font-weight: bold;">OFFICIAL FEE RECEIPT</p>
        </div>
        <div style="text-align: right; margin-bottom: 20px; font-size: 14px; color: #6b7280;">
          <strong>Receipt ID:</strong> RCPT-${receipt._id.substring(18, 24).toUpperCase()}<br>
          <strong>Date:</strong> ${paymentDate}<br>
          <strong>Time:</strong> ${paymentTime}
        </div>
        <h3 style="color: #2563eb; text-transform: uppercase; margin-bottom: 10px;">Student Information</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; background: #f9fafb; width: 35%;">Student Name</th><td style="border: 1px solid #e5e7eb; padding: 10px;">${student.name}</td></tr>
          <tr><th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; background: #f9fafb;">Standard / Batch</th><td style="border: 1px solid #e5e7eb; padding: 10px;">${student.std} - ${student.batch}</td></tr>
        </table>
        <h3 style="color: #2563eb; text-transform: uppercase; margin-bottom: 10px;">Transaction Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; background: #f9fafb;">Paid By</th><td style="border: 1px solid #e5e7eb; padding: 10px;">${receipt.paidBy}</td></tr>
          <tr><th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; background: #f9fafb;">Mode</th><td style="border: 1px solid #e5e7eb; padding: 10px;">${receipt.paymentMode}</td></tr>
          <tr><th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; background: #f9fafb;">Processed By</th><td style="border: 1px solid #e5e7eb; padding: 10px;">${receipt.receivedBy}</td></tr>
          <tr><th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; background: #f0fdf4; color: #15803d; font-size: 16px;">Amount Paid</th><td style="border: 1px solid #e5e7eb; padding: 10px; background: #f0fdf4; color: #15803d; font-size: 16px; font-weight: bold;">₹${receipt.amountPaid.toLocaleString()}</td></tr>
        </table>
        <div style="margin-top: 60px; display: flex; justify-content: space-between; font-size: 14px;">
          <div><p>Thank you for your payment.</p><p style="font-size: 12px; color: #9ca3af;">*Computer-generated receipt.</p></div>
          <div style="text-align: center;"><div style="width: 200px; border-bottom: 1px solid #111827; margin-bottom: 5px;"></div>Authorized Signatory<br><strong>${receipt.receivedBy}</strong></div>
        </div>
      </div>
    `;

    // Direct PDF Download Logic
    const opt = {
      margin: 0.5,
      filename: `${student.name.replace(/\s+/g, '_')}_Receipt.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const eligibleStudents = students.filter(s => (!filterStd || s.std === filterStd) && (!filterBatch || s.batch === filterBatch));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      {/* ... (Keep your existing Header and Tab Buttons here) ... */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <IndianRupee className="text-green-600" /> Accounts & Fees
        </h2>
        <div className="flex gap-2 w-full md:w-auto bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setViewMode('collect')} className={`flex-1 md:flex-none px-4 py-2 text-sm font-bold rounded-md ${viewMode === 'collect' ? 'bg-white shadow-sm text-green-700' : 'text-gray-500 hover:text-gray-800'}`}>Collect</button>
          <button onClick={() => setViewMode('history')} className={`flex-1 md:flex-none px-4 py-2 text-sm font-bold rounded-md ${viewMode === 'history' ? 'bg-white shadow-sm text-green-700' : 'text-gray-500 hover:text-gray-800'}`}>History</button>
          <button onClick={() => setViewMode('structure')} className={`flex-1 md:flex-none px-4 py-2 text-sm font-bold rounded-md ${viewMode === 'structure' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}><Settings size={16} className="inline mr-1"/> Setup</button>
        </div>
      </div>

      {viewMode === 'collect' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleCollectPayment} className="bg-green-50/50 border border-green-100 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-green-900 flex items-center gap-2"><PlusCircle size={18}/> {editingId ? 'Edit Payment' : 'New Receipt'}</h3>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ studentId: '', amountPaid: '', paidBy: '', paymentMode: 'Cash' }); }} className="text-sm text-red-600 font-bold">Cancel Edit</button>}
            </div>
            
            {/* ... (Keep your existing form inputs here) ... */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="text-xs font-bold text-gray-600 uppercase">Filter Standard</label><select value={filterStd} onChange={e => setFilterStd(e.target.value)} className="w-full p-2 border rounded mt-1 bg-white text-sm"><option value="">All Standards</option>{STANDARD_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><label className="text-xs font-bold text-gray-600 uppercase">Filter Batch</label><select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} className="w-full p-2 border rounded mt-1 bg-white text-sm"><option value="">All Batches</option><option value="Morning">Morning</option><option value="Evening">Evening</option></select></div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-gray-600 uppercase">Select Student</label>
              <select required disabled={editingId} value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className="w-full p-2 border rounded mt-1 bg-white font-medium">
                <option value="" disabled>-- Select a Student --</option>
                {eligibleStudents.map(s => <option key={s._id} value={s._id}>{s.name} ({s.std} - {s.phone})</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="text-xs font-bold text-gray-600 uppercase">Amount (₹)</label><input required type="number" min="1" value={formData.amountPaid} onChange={e => setFormData({...formData, amountPaid: e.target.value})} className="w-full p-2 border rounded mt-1 font-bold text-green-700" /></div>
              <div><label className="text-xs font-bold text-gray-600 uppercase">Mode</label><select value={formData.paymentMode} onChange={e => setFormData({...formData, paymentMode: e.target.value})} className="w-full p-2 border rounded mt-1 bg-white"><option value="Cash">Cash</option><option value="UPI">UPI / Online</option><option value="Bank Transfer">Bank Transfer</option></select></div>
            </div>

            <div className="mb-6"><label className="text-xs font-bold text-gray-600 uppercase">Paid By (Name)</label><input required type="text" value={formData.paidBy} onChange={e => setFormData({...formData, paidBy: e.target.value})} className="w-full p-2 border rounded mt-1" /></div>

            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-700">{editingId ? 'Update Receipt' : 'Generate Receipt'}</button>
          </form>
        </div>
      )}

      {/* --- MODE 2: PAYMENT HISTORY WITH CRUD & DOWNLOAD --- */}
      {viewMode === 'history' && (
        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead><tr className="bg-gray-50 border-b"><th className="p-3 text-sm">Date & Time</th><th className="p-3 text-sm">Student</th><th className="p-3 text-sm">Amount</th><th className="p-3 text-sm">Mode & Payer</th><th className="p-3 text-sm text-center">Actions</th></tr></thead>
            <tbody>
              {payments.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-gray-500">No payments recorded yet.</td></tr> :
                payments.map(p => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-600">{new Date(p.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short'})}</td>
                    <td className="p-3 font-bold text-gray-900">{p.studentId?.name}<br/><span className="text-xs font-normal text-gray-500">{p.studentId?.std} • {p.studentId?.batch}</span></td>
                    <td className="p-3 font-bold text-green-600">₹{p.amountPaid}</td>
                    <td className="p-3 text-sm text-gray-800">{p.paymentMode}<br/><span className="text-xs text-gray-500">By: {p.paidBy}</span></td>
                    <td className="p-3 flex justify-center gap-2">
                      <button onClick={() => handleDownloadReceipt(p)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded" title="Download PDF"><Download size={16} /></button>
                      <button onClick={() => handleEditClick(p)} className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded" title="Edit"><Edit size={16} /></button>
                      <button onClick={() => handleDeletePayment(p._id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded" title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}

      {/* ... (Keep your Mode 3: Setup code here exactly as it was) ... */}
    </div>
  );
};

export default FeesTab;