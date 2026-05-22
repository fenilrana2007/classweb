import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { UserPlus, Search, Filter, Download, Trash2 } from 'lucide-react';

export const STANDARD_OPTIONS = [
  "1st Std", "2nd Std", "3rd Std", "4th Std", "5th Std", "6th Std", 
  "7th Std", "8th Std", "9th Std", "10th Std", 
  "11th Commerce", "12th Commerce", "11th Science", "12th Science"
];

const StudentsTab = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filterStd, setFilterStd] = useState('All');
  const [filterBatch, setFilterBatch] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', std: '', batch: 'Morning', bgroup: ''
  });

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try { const res = await api.get('/students'); setStudents(res.data); } 
    catch (err) { console.error("Failed to load students"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.std) return alert("Please select a Standard.");
    try {
      const res = await api.post('/students', formData);
      setStudents([...students, res.data]);
      alert("Student registered!");
      setShowForm(false);
      setFormData({ name: '', email: '', password: '', phone: '', std: '', batch: 'Morning', bgroup: '' });
    } catch (err) { alert(err.response?.data?.message || "Error adding student"); }
  };

  const handleExportStudents = () => {
    if (students.length === 0) return alert("No data.");
    let csv = "Name,Email,Phone,Standard,Batch,Blood Group\n";
    students.forEach(s => csv += `"${s.name}","${s.email}","${s.phone || ''}","${s.std || ''}","${s.batch || ''}","${s.bgroup || ''}"\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleClearAllStudents = async () => {
    if (window.confirm("CRITICAL: Delete ALL students?")) {
      try { await api.delete('/students/all'); setStudents([]); alert("Cleared."); } 
      catch (err) { alert("Failed."); }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesStd = filterStd === 'All' || student.std === filterStd; 
    const matchesBatch = filterBatch === 'All' || student.batch === filterBatch;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStd && matchesBatch && matchesSearch;
  });

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in overflow-x-hidden">
      
      {/* HEADER SECTION: Stacks on mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-900">Students</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button onClick={handleExportStudents} className="flex-1 sm:flex-none bg-green-50 text-green-700 border px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-green-100">
            <Download size={16} /> Export
          </button>
          {currentUser.role === 'admin' && (
            <button onClick={handleClearAllStudents} className="flex-1 sm:flex-none bg-red-50 text-red-700 border px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-red-100">
              <Trash2 size={16} /> Clear
            </button>
          )}
          <button onClick={() => setShowForm(!showForm)} className="flex-1 sm:flex-none bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-blue-700">
            <UserPlus size={16} /> {showForm ? 'Cancel' : 'New'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
          {/* ✅ FIXED GRID: 1 column mobile, 2 tablet, 4 desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-2 border rounded text-sm w-full" />
            <input required type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="p-2 border rounded text-sm w-full" />
            <input required type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="p-2 border rounded text-sm w-full" />
            <input type="text" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="p-2 border rounded text-sm w-full" />
            <select required value={formData.std} onChange={e => setFormData({...formData, std: e.target.value})} className="p-2 border rounded text-sm bg-white w-full">
              <option value="" disabled>Standard...</option>
              {STANDARD_OPTIONS.map(std => <option key={std} value={std}>{std}</option>)}
            </select>
            <input type="text" placeholder="Blood Group" value={formData.bgroup} onChange={e => setFormData({...formData, bgroup: e.target.value})} className="p-2 border rounded text-sm w-full" />
            <select value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="p-2 border rounded sm:col-span-2 text-sm bg-white w-full">
              <option value="Morning">Morning Batch</option>
              <option value="Evening">Evening Batch</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm w-full sm:w-auto">Create Account</button>
        </form>
      )}

      {/* SEARCH AND FILTER */}
      <div className="flex flex-col gap-3 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
        <div className="flex items-center bg-white border rounded px-3 py-2 shadow-sm">
          <Search size={18} className="text-gray-400 mr-2" />
          <input type="text" placeholder="Search name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full outline-none text-sm" />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={filterStd} onChange={e => setFilterStd(e.target.value)} className="flex-1 p-2 border rounded text-sm bg-white">
            <option value="All">All Standards</option>
            {STANDARD_OPTIONS.map(std => <option key={std} value={std}>{std}</option>)}
          </select>
          <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} className="flex-1 p-2 border rounded text-sm bg-white">
            <option value="All">All Batches</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>
        </div>
      </div>

      {/* TABLE WRAPPER: This prevents breaking the screen */}
      <div className="w-full overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="p-3 text-xs font-bold text-gray-700">Student</th>
              <th className="p-3 text-xs font-bold text-gray-700">Class</th>
              <th className="p-3 text-xs font-bold text-gray-700">Phone</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr><td colSpan="3" className="p-8 text-center text-sm text-gray-500">No students.</td></tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-sm text-gray-900">{student.name}</p>
                    <p className="text-[10px] text-gray-500">{student.email}</p>
                  </td>
                  <td className="p-3">
                    <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold mr-1">{student.std || 'N/A'}</span>
                    <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded text-[10px] font-bold">{student.batch || 'Unassigned'}</span>
                  </td>
                  <td className="p-3 text-sm text-gray-600">{student.phone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsTab;