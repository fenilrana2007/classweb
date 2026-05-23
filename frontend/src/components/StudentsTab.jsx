// import React, { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import api from '../services/api';
// import { UserPlus, Search, Filter, Download, Trash2 } from 'lucide-react';

// // Master List of Standards - Ensures perfect database matches!
// export const STANDARD_OPTIONS = [
//   "1st Std", "2nd Std", "3rd Std", "4th Std", "5th Std", "6th Std", 
//   "7th Std", "8th Std", "9th Std", "10th Std", 
//   "11th Commerce", "12th Commerce", "11th Science", "12th Science"
// ];

// const StudentsTab = () => {
//   const { user: currentUser } = useContext(AuthContext);
//   const [students, setStudents] = useState([]);
//   const [showForm, setShowForm] = useState(false);
  
//   // Sorting & Filtering States
//   const [filterStd, setFilterStd] = useState('All');
//   const [filterBatch, setFilterBatch] = useState('All');
//   const [searchQuery, setSearchQuery] = useState('');

//   // Form State
//   const [formData, setFormData] = useState({
//     name: '', email: '', password: '', phone: '', std: '', batch: 'Morning', bgroup: ''
//   });

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       const res = await api.get('/students');
//       setStudents(res.data);
//     } catch (err) {
//       console.error("Failed to load students");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.std) return alert("Please select a Standard from the dropdown.");
    
//     try {
//       const res = await api.post('/students', formData);
//       setStudents([...students, res.data]);
//       alert("Student registered successfully!");
//       setShowForm(false);
//       setFormData({ name: '', email: '', password: '', phone: '', std: '', batch: 'Morning', bgroup: '' });
//     } catch (err) {
//       alert(err.response?.data?.message || "Error adding student");
//     }
//   };

//   const handleExportStudents = () => {
//     if (students.length === 0) return alert("No student data to export.");

//     let csvContent = "Name,Email,Phone,Standard,Batch,Blood Group\n";
//     students.forEach(s => {
//       csvContent += `"${s.name}","${s.email}","${s.phone || ''}","${s.std || ''}","${s.batch || ''}","${s.bgroup || ''}"\n`;
//     });

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `Student_Export_${new Date().toISOString().split('T')[0]}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleClearAllStudents = async () => {
//     const confirmDelete = window.confirm("CRITICAL: This will permanently delete ALL students. Continue?");
//     if (confirmDelete) {
//       try {
//         await api.delete('/students/all');
//         setStudents([]);
//         alert("All student records cleared.");
//       } catch (err) {
//         alert("Failed to clear students.");
//       }
//     }
//   };

//   const filteredStudents = students.filter(student => {
//     // Because we use a dropdown now, we can use exact matching (===) instead of .includes()
//     const matchesStd = filterStd === 'All' || student.std === filterStd; 
//     const matchesBatch = filterBatch === 'All' || student.batch === filterBatch;
//     const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesStd && matchesBatch && matchesSearch;
//   });

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in max-w-6xl mx-auto">
      
//       <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
//         <h2 className="text-xl font-bold text-gray-900">Student Management</h2>
        
//         <div className="flex gap-2">
//           <button onClick={handleExportStudents} className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-green-100 transition-shadow">
//             <Download size={16} /> Export CSV
//           </button>

//           {currentUser.role === 'admin' && (
//             <button onClick={handleClearAllStudents} className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-red-100 transition-shadow">
//               <Trash2 size={16} /> Delete All
//             </button>
//           )}

//           <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-blue-700">
//             <UserPlus size={16} /> {showForm ? 'Cancel' : 'Register New'}
//           </button>
//         </div>
//       </div>

//       {showForm && (
//         <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//             <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600" />
//             <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600" />
//             <input required type="password" placeholder="Temp Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600" />
//             <input type="text" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600" />
            
//             {/* DROPDOWN FOR STANDARD */}
//             <select required value={formData.std} onChange={e => setFormData({...formData, std: e.target.value})} className="p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600 bg-white font-medium">
//               <option value="" disabled>Select Standard...</option>
//               {STANDARD_OPTIONS.map(std => <option key={std} value={std}>{std}</option>)}
//             </select>

//             <input type="text" placeholder="Blood Group" value={formData.bgroup} onChange={e => setFormData({...formData, bgroup: e.target.value})} className="p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600" />
            
//             <select value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="p-2 border rounded col-span-1 md:col-span-2 outline-none focus:ring-2 focus:ring-blue-600">
//               <option value="Morning">Morning Batch</option>
//               <option value="Evening">Evening Batch</option>
//             </select>
//           </div>
//           <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Create Account</button>
//         </form>
//       )}

//       <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
//         <div className="flex-1 flex items-center bg-white border rounded px-3 py-2 shadow-sm">
//           <Search size={18} className="text-gray-400 mr-2" />
//           <input type="text" placeholder="Search by name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full outline-none" />
//         </div>
        
//         <div className="flex items-center gap-2">
//           <Filter size={18} className="text-gray-500" />
          
//           {/* DROPDOWN FOR FILTERING */}
//           <select value={filterStd} onChange={e => setFilterStd(e.target.value)} className="p-2 border rounded outline-none bg-white w-48 font-medium shadow-sm">
//             <option value="All">All Standards</option>
//             {STANDARD_OPTIONS.map(std => <option key={std} value={std}>{std}</option>)}
//           </select>

//           <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} className="p-2 border rounded outline-none bg-white font-medium shadow-sm">
//             <option value="All">All Batches</option>
//             <option value="Morning">Morning</option>
//             <option value="Evening">Evening</option>
//           </select>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-gray-100 border-b border-gray-200">
//               <th className="p-4 text-sm font-bold text-gray-700">Student Info</th>
//               <th className="p-4 text-sm font-bold text-gray-700">Standard & Batch</th>
//               <th className="p-4 text-sm font-bold text-gray-700">Phone</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredStudents.length === 0 ? (
//               <tr><td colSpan="3" className="p-8 text-center text-gray-500">No students match your filters.</td></tr>
//             ) : (
//               filteredStudents.map(student => (
//                 <tr key={student._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
//                   <td className="p-4">
//                     <p className="font-bold text-gray-900">{student.name}</p>
//                     <p className="text-xs text-gray-500">{student.email}</p>
//                   </td>
//                   <td className="p-4">
//                     <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold mr-2">{student.std || 'N/A'}</span>
//                     <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold">{student.batch || 'Unassigned'}</span>
//                   </td>
//                   <td className="p-4 text-sm text-gray-600">{student.phone}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default StudentsTab;
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { UserPlus, Search, Filter, Download, Trash2, Edit, Ban, CheckCircle } from 'lucide-react';

// Master List of Standards - Ensures perfect database matches!
export const STANDARD_OPTIONS = [
  "1st Std", "2nd Std", "3rd Std", "4th Std", "5th Std", "6th Std", 
  "7th Std", "8th Std", "9th Std", "10th Std", 
  "11th Commerce", "12th Commerce", "11th Science", "12th Science"
];

const StudentsTab = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // NEW: Tracks which student is being edited
  
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

  // --- CRUD: CREATE & UPDATE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.std) return alert("Please select a Standard from the dropdown.");
    
    try {
      if (editingId) {
        // Update Existing Student
        const res = await api.put(`/students/${editingId}`, formData);
        setStudents(students.map(s => s._id === editingId ? res.data : s));
        alert("Student updated successfully!");
      } else {
        // Create New Student
        const res = await api.post('/students', formData);
        setStudents([...students, res.data]);
        alert("Student registered successfully!");
      }
      
      // Reset Form
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', email: '', password: '', phone: '', std: '', batch: 'Morning', bgroup: '' });
    } catch (err) {
      alert(err.response?.data?.message || "Error saving student");
    }
  };

  // --- CRUD: OPEN EDIT MODE ---
  const handleEdit = (student) => {
    setEditingId(student._id);
    setFormData({
      name: student.name,
      email: student.email,
      password: '', // Leave blank unless they want to change it
      phone: student.phone || '',
      std: student.std,
      batch: student.batch || 'Morning',
      bgroup: student.bgroup || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up to the form
  };

  // --- CRUD: DELETE STUDENT ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this student?")) {
      try {
        await api.delete(`/students/${id}`);
        setStudents(students.filter(s => s._id !== id));
      } catch (err) {
        alert("Failed to delete student.");
      }
    }
  };

  // --- CRUD: TOGGLE STATUS (BLOCK/ACTIVE) ---
  const handleToggleBlock = async (id) => {
    try {
      await api.put(`/students/${id}/block`);
      setStudents(students.map(s => s._id === id ? { ...s, isBlocked: !s.isBlocked } : s));
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleExportStudents = () => {
    if (students.length === 0) return alert("No student data to export.");

    let csvContent = "Name,Email,Phone,Standard,Batch,Blood Group,Status\n";
    students.forEach(s => {
      const status = s.isBlocked ? 'Blocked' : 'Active';
      csvContent += `"${s.name}","${s.email}","${s.phone || ''}","${s.std || ''}","${s.batch || ''}","${s.bgroup || ''}","${status}"\n`;
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
    const matchesStd = filterStd === 'All' || student.std === filterStd; 
    const matchesBatch = filterBatch === 'All' || student.batch === filterBatch;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStd && matchesBatch && matchesSearch;
  });

  return (
    // ✅ Main Wrapper with overflow-x-hidden for layout safety
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in overflow-x-hidden">
      
      {/* ✅ Responsive Header (Stacks on mobile) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-900">Student Management</h2>
        
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button onClick={handleExportStudents} className="flex-1 sm:flex-none bg-green-50 text-green-700 border border-green-200 px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-green-100 transition-shadow">
            <Download size={16} /> Export
          </button>

          {currentUser?.role === 'admin' && (
            <button onClick={handleClearAllStudents} className="flex-1 sm:flex-none bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-red-100 transition-shadow">
              <Trash2 size={16} /> Delete All
            </button>
          )}

          <button 
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) setEditingId(null); // Clear edit state if closing form
            }} 
            className="flex-1 sm:flex-none bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-blue-700"
          >
            <UserPlus size={16} /> {showForm ? 'Cancel' : 'Register New'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 md:p-6 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
          {/* ✅ Responsive Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
            <input required type="email" placeholder="Email Address" disabled={editingId} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600 text-sm ${editingId ? 'bg-gray-200' : ''}`} />
            <input type="password" required={!editingId} placeholder={editingId ? "Leave blank to keep current" : "Temp Password"} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
            <input type="text" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
            
            <select required value={formData.std} onChange={e => setFormData({...formData, std: e.target.value})} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600 bg-white font-medium text-sm">
              <option value="" disabled>Select Standard...</option>
              {STANDARD_OPTIONS.map(std => <option key={std} value={std}>{std}</option>)}
            </select>

            <input type="text" placeholder="Blood Group" value={formData.bgroup} onChange={e => setFormData({...formData, bgroup: e.target.value})} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-600 text-sm" />
            
            <select value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="w-full p-2 border rounded sm:col-span-2 outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white">
              <option value="Morning">Morning Batch</option>
              <option value="Evening">Evening Batch</option>
            </select>
          </div>
          <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 text-sm">
            {editingId ? 'Update Student Details' : 'Create Account'}
          </button>
        </form>
      )}

      {/* ✅ Responsive Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
        <div className="flex-1 flex items-center bg-white border rounded px-3 py-2 shadow-sm">
          <Search size={18} className="text-gray-400 mr-2 shrink-0" />
          <input type="text" placeholder="Search by name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full outline-none text-sm" />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select value={filterStd} onChange={e => setFilterStd(e.target.value)} className="flex-1 md:flex-none p-2 border rounded outline-none bg-white font-medium shadow-sm text-sm">
            <option value="All">All Standards</option>
            {STANDARD_OPTIONS.map(std => <option key={std} value={std}>{std}</option>)}
          </select>

          <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} className="flex-1 md:flex-none p-2 border rounded outline-none bg-white font-medium shadow-sm text-sm">
            <option value="All">All Batches</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>
        </div>
      </div>

      {/* ✅ Responsive Table Wrapper (Prevents screen breakage) */}
      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="p-4 text-sm font-bold text-gray-700">Student Info</th>
              <th className="p-4 text-sm font-bold text-gray-700">Standard & Batch</th>
              <th className="p-4 text-sm font-bold text-gray-700">Phone</th>
              <th className="p-4 text-sm font-bold text-gray-700">Status</th>
              <th className="p-4 text-sm font-bold text-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-sm text-gray-500">No students match your filters.</td></tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student._id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${student.isBlocked ? 'opacity-70' : ''}`}>
                  <td className="p-4">
                    <p className="font-bold text-sm text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.email}</p>
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold mr-2">{student.std || 'N/A'}</span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold">{student.batch || 'Unassigned'}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{student.phone || 'N/A'}</td>
                  
                  {/* Status Badge */}
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1 ${student.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {student.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="p-4 flex justify-center gap-2">
                    <button onClick={() => handleEdit(student)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors" title="Edit Student">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleToggleBlock(student._id)} className={`p-2 rounded-lg transition-colors ${student.isBlocked ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-orange-600 bg-orange-50 hover:bg-orange-100'}`} title={student.isBlocked ? "Unblock Student" : "Block Student"}>
                      {student.isBlocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                    </button>
                    {currentUser?.role === 'admin' && (
                      <button onClick={() => handleDelete(student._id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Delete Permanently">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
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