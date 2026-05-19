import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { IndianRupee, PlusCircle, Settings, History, CheckCircle } from 'lucide-react';
import { STANDARD_OPTIONS } from './StudentsTab';

const FeesTab = ({ students }) => {
  const [viewMode, setViewMode] = useState('collect'); // 'collect', 'history', 'structure'
  
  // States
  const [structures, setStructures] = useState([]);
  const [payments, setPayments] = useState([]);
  
  // Fee Collection Form
  const [filterStd, setFilterStd] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [formData, setFormData] = useState({ studentId: '', amountPaid: '', paidBy: '', paymentMode: 'Cash' });

  // Fee Structure Form
  const [structData, setStructData] = useState({ std: STANDARD_OPTIONS[9], totalFee: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [structRes, payRes] = await Promise.all([
        api.get('/fees/structure'),
        api.get('/fees/all-payments')
      ]);
      setStructures(structRes.data);
      setPayments(payRes.data);
    } catch (err) { console.error("Error loading fee data"); }
  };

  // 1. Save Master Fee Structure
  const handleSaveStructure = async (e) => {
    e.preventDefault();
    try {
      await api.post('/fees/structure', structData);
      alert(`Master Fee for ${structData.std} updated successfully!`);
      fetchData(); // Reload
    } catch (err) { alert("Failed to save fee structure"); }
  };

  // 2. Collect Payment
  const handleCollectPayment = async (e) => {
    e.preventDefault();
    if (!formData.studentId) return alert("Please select a student.");
    try {
      const res = await api.post('/fees/pay', formData);
      setPayments([res.data, ...payments]);
      alert("Payment Recorded Successfully!");
      setFormData({ studentId: '', amountPaid: '', paidBy: '', paymentMode: 'Cash' });
    } catch (err) { alert("Failed to record payment"); }
  };

  // Filter students based on Admin's dropdown selection
  const eligibleStudents = students.filter(s => 
    (!filterStd || s.std === filterStd) && (!filterBatch || s.batch === filterBatch)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      
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

      {/* --- MODE 1: COLLECT PAYMENT --- */}
      {viewMode === 'collect' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleCollectPayment} className="bg-green-50/50 border border-green-100 p-6 rounded-xl">
            <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2"><PlusCircle size={18}/> New Payment Receipt</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="text-xs font-bold text-gray-600 uppercase">Filter Standard</label><select value={filterStd} onChange={e => setFilterStd(e.target.value)} className="w-full p-2 border rounded mt-1 bg-white text-sm"><option value="">All Standards</option>{STANDARD_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><label className="text-xs font-bold text-gray-600 uppercase">Filter Batch</label><select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} className="w-full p-2 border rounded mt-1 bg-white text-sm"><option value="">All Batches</option><option value="Morning">Morning</option><option value="Evening">Evening</option></select></div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-gray-600 uppercase">Select Student</label>
              <select required value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className="w-full p-2 border rounded mt-1 bg-white font-medium">
                <option value="" disabled>-- Select a Student --</option>
                {eligibleStudents.map(s => <option key={s._id} value={s._id}>{s.name} ({s.std} - {s.phone})</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><label className="text-xs font-bold text-gray-600 uppercase">Amount (₹)</label><input required type="number" min="1" value={formData.amountPaid} onChange={e => setFormData({...formData, amountPaid: e.target.value})} className="w-full p-2 border rounded mt-1 font-bold text-green-700" placeholder="e.g. 5000" /></div>
              <div><label className="text-xs font-bold text-gray-600 uppercase">Mode</label><select value={formData.paymentMode} onChange={e => setFormData({...formData, paymentMode: e.target.value})} className="w-full p-2 border rounded mt-1 bg-white"><option value="Cash">Cash</option><option value="UPI">UPI / Online</option><option value="Bank Transfer">Bank Transfer</option></select></div>
            </div>

            <div className="mb-6"><label className="text-xs font-bold text-gray-600 uppercase">Paid By (Name)</label><input required type="text" value={formData.paidBy} onChange={e => setFormData({...formData, paidBy: e.target.value})} className="w-full p-2 border rounded mt-1" placeholder="e.g. Ramesh (Father)" /></div>

            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-700">Generate Receipt</button>
          </form>

          {/* Quick Stats side panel */}
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl hidden lg:block">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><History size={18}/> Recent Transactions</h3>
            <div className="space-y-3">
              {payments.slice(0, 5).map(p => (
                <div key={p._id} className="bg-white p-3 rounded shadow-sm border border-gray-100 flex justify-between items-center">
                  <div><p className="font-bold text-sm text-gray-900">{p.studentId?.name}</p><p className="text-[10px] text-gray-500">{new Date(p.date).toLocaleString()}</p></div>
                  <div className="text-right"><p className="font-bold text-green-600">+₹{p.amountPaid}</p><p className="text-[10px] text-gray-500">{p.paymentMode}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MODE 2: PAYMENT HISTORY --- */}
      {viewMode === 'history' && (
        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead><tr className="bg-gray-50 border-b"><th className="p-3 text-sm">Date & Time</th><th className="p-3 text-sm">Student</th><th className="p-3 text-sm">Amount</th><th className="p-3 text-sm">Mode & Payer</th><th className="p-3 text-sm">Collected By</th></tr></thead>
            <tbody>
              {payments.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-gray-500">No payments recorded yet.</td></tr> :
                payments.map(p => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-600">{new Date(p.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short'})}</td>
                    <td className="p-3 font-bold text-gray-900">{p.studentId?.name}<br/><span className="text-xs font-normal text-gray-500">{p.studentId?.std} • {p.studentId?.batch}</span></td>
                    <td className="p-3 font-bold text-green-600">₹{p.amountPaid}</td>
                    <td className="p-3 text-sm text-gray-800">{p.paymentMode}<br/><span className="text-xs text-gray-500">By: {p.paidBy}</span></td>
                    <td className="p-3 text-xs font-bold text-blue-600">{p.receivedBy}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODE 3: SETUP MASTER FEES --- */}
      {viewMode === 'structure' && (
        <div className="max-w-2xl">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6 text-sm">
            Set the total expected fee for an entire academic year. Students in this standard will have this amount set as their "Total Dues".
          </div>
          <form onSubmit={handleSaveStructure} className="flex gap-4 items-end mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex-1"><label className="font-bold text-xs text-gray-600 uppercase">Standard</label><select value={structData.std} onChange={e => setStructData({...structData, std: e.target.value})} className="w-full p-2 border rounded mt-1 bg-white">{STANDARD_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div className="flex-1"><label className="font-bold text-xs text-gray-600 uppercase">Total Yearly Fee (₹)</label><input required type="number" min="0" value={structData.totalFee} onChange={e => setStructData({...structData, totalFee: e.target.value})} className="w-full p-2 border rounded mt-1" placeholder="e.g. 15000" /></div>
            <button type="submit" className="bg-gray-900 text-white font-bold py-2 px-6 rounded shadow hover:bg-gray-800">Save</button>
          </form>

          <h3 className="font-bold text-gray-900 mb-4">Current Fee Structures</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {structures.map(s => (
              <div key={s._id} className="border border-gray-200 p-4 rounded-lg shadow-sm text-center">
                <p className="text-xs font-bold text-gray-500 uppercase">{s.std}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">₹{s.totalFee.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeesTab;