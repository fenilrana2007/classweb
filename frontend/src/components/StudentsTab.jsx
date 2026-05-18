import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { UserPlus, Search, Filter, Download, Trash2 } from 'lucide-react';

const StudentsTab = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Sorting & Filtering States
  const [filterStd, setFilterStd] = useState('All');
  const [filterBatch, setFilterBatch] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', std: '', batch: 'Morning', bgroup: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to load students");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/students', formData);
      setStudents([...students, res.data]);
      alert("Student registered successfully!");
      setShowForm(false);
      setFormData({ name: '', email: '', password: '', phone: '', std: '', batch: 'Morning', bgroup: '' });
    } catch (err) {
      alert(err.response?.data?.message || "Error adding student");
    }
  };

  const handleExportStudents = () => {
    if (students.length === 0) return alert("No student data to export.");

    let csvContent = "Name,Email,Phone,Standard,Batch,Blood Group\n";
    students.forEach(s => {
      csvContent += `"${s.name}","${s.email}","${s.phone || ''}","${s.std || ''}","${s.batch || ''}","${s.bgroup || ''}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Student_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearAllStudents = async () => {
    const confirmDelete = window.confirm("CRITICAL: This will permanently delete ALL students. Continue?");
    if (confirmDelete) {
      try {
        await api.delete('/students/all');
        setStudents([]);
        alert("All student records cleared.");
      } catch (err) {
        alert("Failed to clear students.");
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesStd = filterStd === 'All' || (student.std && student.std.includes(filterStd));
    const matchesBatch = filterBatch === 'All' || student.batch === filterBatch;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStd && matchesBatch && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* --- UPDATED HEADER WITH EXPORT & DELETE --- */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900">Student Management</h2>
        
        <div className="flex gap-2">
          <button onClick={handleExportStudents} className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-green-100 transition-shadow">
            <Download size={16} /> Export CSV
          </button>

          {currentUser.role === 'admin' && (
            <button onClick={handleClearAllStudents} className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-red-100 transition-shadow">
              <Trash2 size={16} /> Delete All
            </button>
          )}

          <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-blue-700">
            <UserPlus size={16} /> {showForm ? 'Cancel' : 'Register New'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600" />
            <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600" />
            <input required type="password" placeholder="Temp Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600" />
            <input type="text" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600" />
            
            <input type="text" placeholder="Standard (e.g. 10th)" value={formData.std} onChange={e => setFormData({...formData, std: e.target.value})} className="p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600" />
            <input type="text" placeholder="Blood Group" value={formData.bgroup} onChange={e => setFormData({...formData, bgroup: e.target.value})} className="p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600" />
            
            <select value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="p-2 border rounded col-span-1 md:col-span-2 outline-none focus:ring-2 focus:ring-blue-600">
              <option value="Morning">Morning Batch</option>
              <option value="Evening">Evening Batch</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Create Account</button>
        </form>
      )}

      {/* --- FILTERS --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex-1 flex items-center bg-white border rounded px-3 py-2 shadow-sm">
          <Search size={18} className="text-gray-400 mr-2" />
          <input type="text" placeholder="Search by name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full outline-none" />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Filter Standard" 
            value={filterStd === 'All' ? '' : filterStd} 
            onChange={e => setFilterStd(e.target.value || 'All')} 
            className="p-2 border rounded outline-none bg-white w-40" 
          />
          <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} className="p-2 border rounded outline-none bg-white">
            <option value="All">All Batches</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="p-4 text-sm font-bold text-gray-700">Student Info</th>
              <th className="p-4 text-sm font-bold text-gray-700">Standard & Batch</th>
              <th className="p-4 text-sm font-bold text-gray-700">Phone</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr><td colSpan="3" className="p-8 text-center text-gray-500">No students found.</td></tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold mr-2">{student.std || 'N/A'}</span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold">{student.batch || 'Unassigned'}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{student.phone}</td>
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