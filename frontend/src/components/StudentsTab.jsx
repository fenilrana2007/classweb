import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserPlus, Search, Filter } from 'lucide-react';

const StudentsTab = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // --- SORTING & FILTERING STATES ---
  const [filterStd, setFilterStd] = useState('All');
  const [filterBatch, setFilterBatch] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', std: '10th', batch: 'Morning', bgroup: ''
  });

  // Fetch Students from Database
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/students');
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to load students");
      }
    };
    fetchStudents();
  }, []);

  // Handle Adding a Student
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/students', formData);
      setStudents([...students, res.data]);
      alert("Student account created successfully!");
      setShowForm(false);
      setFormData({ name: '', email: '', password: '', phone: '', std: '10th', batch: 'Morning', bgroup: '' });
    } catch (err) {
      alert(err.response?.data?.message || "Error adding student");
    }
  };

  // --- THE FILTERING LOGIC ---
  const filteredStudents = students.filter(student => {
    const matchesStd = filterStd === 'All' || student.std === filterStd;
    const matchesBatch = filterBatch === 'All' || student.batch === filterBatch;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStd && matchesBatch && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in max-w-6xl mx-auto">
      
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900">Manage Students</h2>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-blue-700">
          <UserPlus size={16} /> {showForm ? 'Cancel' : 'Register New Student'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-2 border rounded" />
            <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="p-2 border rounded" />
            <input required type="password" placeholder="Temp Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="p-2 border rounded" />
            <input type="text" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="p-2 border rounded" />
            
            <input type="text" placeholder="Standard (e.g. 10th, 11th Science)" value={formData.std} onChange={e => setFormData({...formData, std: e.target.value})} className="p-2 border rounded" />
            <input type="text" placeholder="Blood Group" value={formData.bgroup} onChange={e => setFormData({...formData, bgroup: e.target.value})} className="p-2 border rounded" />
            
            <select value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="p-2 border rounded col-span-1 md:col-span-2">
              <option value="Morning">Morning Batch</option>
              <option value="Evening">Evening Batch</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Create Account</button>
        </form>
      )}

      {/* --- STANDARD & BATCH FILTERS --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex-1 flex items-center bg-white border rounded px-3 py-2 shadow-sm">
          <Search size={18} className="text-gray-400 mr-2" />
          <input type="text" placeholder="Search by name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full outline-none" />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          
          {/* Standard Filter */}
          <input 
            type="text" 
            placeholder="Filter Standard (e.g. 10th)" 
            value={filterStd === 'All' ? '' : filterStd} 
            onChange={e => setFilterStd(e.target.value || 'All')} 
            className="p-2 border rounded outline-none bg-white w-40" 
          />
          
          {/* Batch Filter */}
          <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} className="p-2 border rounded outline-none bg-white">
            <option value="All">All Batches</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>
        </div>
      </div>

      {/* --- STUDENT TABLE --- */}
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
              <tr><td colSpan="3" className="p-8 text-center text-gray-500">No students match your filters.</td></tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student._id} className="border-b border-gray-50 hover:bg-gray-50">
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