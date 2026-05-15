// src/pages/TeacherPortal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  BookOpen, Calendar, Users, LayoutDashboard, UserPlus, 
  Ban, Edit, Trash2, MessageSquare, CheckSquare, Send
} from 'lucide-react';

const TeacherPortal = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState({ batches: 0, totalStudents: 0, classesToday: 0 });
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/teacher/stats');
        setStats(statsRes.data);
        const studentsRes = await api.get('/teacher/students');
        setStudents(studentsRes.data);
      } catch (error) {
        console.error("Failed to load teacher data");
      } finally {
        setIsLoading(false);
      }
    };
    if (user && user.role === 'teacher') fetchData();
  }, [user]);

  if (!user || user.role !== 'teacher') return <div className="p-10 text-center text-red-600 font-bold mt-20">Access Denied. Faculty Only.</div>;
  if (isLoading) return <div className="p-10 text-center mt-20 animate-pulse">Loading Portal Data...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="bg-purple-700 rounded-2xl p-8 text-white shadow-lg mb-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Faculty Portal</h1>
            <p className="text-purple-100 text-lg">Welcome back, {user.name}. Manage your batches and students.</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30 flex items-center gap-2">
            <BookOpen size={18} />
            <span className="font-bold uppercase tracking-wider text-sm">Teacher</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={18} />} text="Overview" />
        <TabButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={<Users size={18} />} text="Manage Students" />
        <TabButton active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} icon={<CheckSquare size={18} />} text="Attendance" />
        <TabButton active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} icon={<MessageSquare size={18} />} text="Messages" />
      </div>

      {activeTab === 'overview' && <OverviewTab stats={stats} />}
      {activeTab === 'students' && <StudentsTab students={students} setStudents={setStudents} />}
      {activeTab === 'attendance' && <AttendanceTab students={students} />}
      {activeTab === 'messages' && <MessagesTab />}

    </div>
  );
};

const TabButton = ({ active, onClick, icon, text }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${active ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
    {icon} {text}
  </button>
);

// --- 1. OVERVIEW TAB ---
const OverviewTab = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
      <div className="p-4 rounded-xl bg-purple-50 text-purple-600"><LayoutDashboard size={24} /></div>
      <div><p className="text-sm text-gray-500 font-medium">My Batches</p><p className="text-2xl font-bold">{stats.batches}</p></div>
    </div>
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
      <div className="p-4 rounded-xl bg-blue-50 text-blue-600"><Users size={24} /></div>
      <div><p className="text-sm text-gray-500 font-medium">Total Students</p><p className="text-2xl font-bold">{stats.totalStudents}</p></div>
    </div>
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
      <div className="p-4 rounded-xl bg-green-50 text-green-600"><Calendar size={24} /></div>
      <div><p className="text-sm text-gray-500 font-medium">Classes Today</p><p className="text-2xl font-bold">{stats.classesToday}</p></div>
    </div>
  </div>
);

// --- 2. MANAGE STUDENTS TAB (NOW WITH EDIT CAPABILITY) ---
const StudentsTab = ({ students, setStudents }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track if we are editing
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', std: '', batch: '', bgroup: '' });
  
  const standardOptions = ["1st Std", "2nd Std", "3rd Std", "4th Std", "5th Std", "6th Std", "7th Std", "8th Std", "9th Std", "10th Std", "11th Commerce", "12th Commerce"];

  // Open form for ADDING
  const handleAddNewClick = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', password: '', std: '', batch: '', bgroup: '' });
    setShowForm(!showForm);
  };

  // Open form for EDITING
  const handleEditClick = (student) => {
    setEditingId(student._id);
    setFormData({ 
      name: student.name, email: student.email, phone: student.phone || '', 
      password: '', std: student.std || '', batch: student.batch || '', bgroup: student.bgroup || '' 
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UPDATE Existing Student
        const res = await api.put(`/teacher/students/${editingId}`, formData);
        setStudents(students.map(s => s._id === editingId ? res.data : s));
        alert("Student Updated Successfully!");
      } else {
        // CREATE New Student
        const res = await api.post('/teacher/students', formData);
        setStudents([...students, res.data]);
        alert("Student Added Successfully!");
      }
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error saving student");
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      await api.put(`/teacher/students/${id}/block`);
      setStudents(students.map(s => s._id === id ? { ...s, isBlocked: !s.isBlocked } : s));
    } catch (err) { alert("Error updating status"); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this student?")) {
      try {
        await api.delete(`/teacher/students/${id}`);
        setStudents(students.filter(s => s._id !== id));
      } catch (err) { alert("Error deleting student"); }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Student Directory</h2>
        <button onClick={handleAddNewClick} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold">
          <UserPlus size={16} /> {showForm && !editingId ? 'Cancel' : 'Add New Student'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-purple-50 rounded-xl border border-purple-100">
          <h3 className="font-bold text-lg mb-4 text-purple-900">{editingId ? 'Edit Student Details' : 'Create New Student'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input required type="text" placeholder="Full Name" value={formData.name} className="p-2 border rounded" onChange={e => setFormData({...formData, name: e.target.value})} />
            
            {/* Email and Password cannot be edited easily here, disabled on edit mode */}
            <input required type="email" placeholder="Email" value={formData.email} disabled={editingId} className={`p-2 border rounded ${editingId ? 'bg-gray-100' : ''}`} onChange={e => setFormData({...formData, email: e.target.value})} />
            {!editingId && <input required type="password" placeholder="Password" value={formData.password} className="p-2 border rounded" onChange={e => setFormData({...formData, password: e.target.value})} />}
            
            <input type="text" placeholder="Phone" value={formData.phone} className="p-2 border rounded" onChange={e => setFormData({...formData, phone: e.target.value})} />
            
            <select required value={formData.std} className="p-2 border rounded" onChange={e => setFormData({...formData, std: e.target.value})}>
              <option value="">Select Standard</option>
              {standardOptions.map(std => <option key={std} value={std}>{std}</option>)}
            </select>
            
            <select required value={formData.batch} className="p-2 border rounded" onChange={e => setFormData({...formData, batch: e.target.value})}>
              <option value="">Select Batch</option>
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
            </select>
            <input type="text" placeholder="Blood Group (e.g. O+)" value={formData.bgroup} className="p-2 border rounded" onChange={e => setFormData({...formData, bgroup: e.target.value})} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700">
              {editingId ? 'Save Changes' : 'Save to Database'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-300">Cancel</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b"><th className="p-3">Name</th><th className="p-3">Batch info</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {students.length === 0 ? <tr><td colSpan="4" className="p-4 text-center text-gray-500">No students found. Add one above!</td></tr> : null}
            {students.map(student => (
              <tr key={student._id} className={`border-b hover:bg-gray-50 ${student.isBlocked ? 'opacity-50' : ''}`}>
                <td className="p-3 font-medium">{student.name}</td>
                <td className="p-3 text-sm">{student.std} • {student.batch}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${student.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {student.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEditClick(student)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Edit"><Edit size={16} /></button>
                  <button onClick={() => handleToggleBlock(student._id)} className="p-1 text-orange-600 hover:bg-orange-50 rounded" title={student.isBlocked ? "Unblock" : "Block"}><Ban size={16} /></button>
                  <button onClick={() => handleDelete(student._id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 3. ATTENDANCE TAB (NOW WITH DATE PICKER) ---
// --- 3. UPGRADED ATTENDANCE TAB (Record & View Modes) ---
// --- 3. UPGRADED ATTENDANCE TAB (With Smart Sorting & Absent Filtering) ---
const AttendanceTab = ({ students }) => {
  const [tabMode, setTabMode] = useState('record'); // 'record' or 'view'
  
  // States for Recording
  const [addDate, setAddDate] = useState(new Date().toISOString().split('T')[0]);
  const [addStd, setAddStd] = useState('All');
  const [addBatch, setAddBatch] = useState('All');
  const [markMode, setMarkMode] = useState('markPresent');
  const [selectedIds, setSelectedIds] = useState(new Set());

  // States for Viewing
  const [fetchDate, setFetchDate] = useState(new Date().toISOString().split('T')[0]);
  const [fetchStd, setFetchStd] = useState('All');
  const [fetchBatch, setFetchBatch] = useState('All');
  const [viewStatusFilter, setViewStatusFilter] = useState('All'); // New: Filter by Present/Absent
  const [viewData, setViewData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const standardOptions = ["1st Std", "2nd Std", "3rd Std", "4th Std", "5th Std", "6th Std", "7th Std", "8th Std", "9th Std", "10th Std", "11th Commerce", "12th Commerce"];

  // Filter students based on selected Std and Batch for recording
  const filteredStudents = students.filter(s => 
    (addStd === 'All' || s.std === addStd) && 
    (addBatch === 'All' || s.batch === addBatch)
  );

  const toggleStudent = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleSubmitAttendance = async () => {
    if (filteredStudents.length === 0) return alert("No students found in this class/batch!");

    const records = filteredStudents.map(student => {
      const isSelected = selectedIds.has(student._id);
      let status = (markMode === 'markPresent') ? (isSelected ? 'Present' : 'Absent') : (isSelected ? 'Absent' : 'Present');
      return { studentId: student._id, status };
    });

    try {
      await api.post('/teacher/attendance', { date: addDate, std: addStd, batch: addBatch, records });
      alert(`Attendance for ${addDate} Saved Successfully!`);
      setSelectedIds(new Set()); 
    } catch (err) { alert("Failed to save attendance."); }
  };

  const handleFetchAttendance = async () => {
    setIsFetching(true);
    try {
      const res = await api.get(`/teacher/attendance?date=${fetchDate}&std=${fetchStd}&batch=${fetchBatch}`);
      
      // 1. Get all students who SHOULD be in this list (based on filters)
      const expectedStudents = students.filter(s => 
        (fetchStd === 'All' || s.std === fetchStd) && 
        (fetchBatch === 'All' || s.batch === fetchBatch)
      );

      // 2. Gather all "Present" IDs from the database response
      const presentIds = new Set();
      res.data.forEach(recordDoc => {
        recordDoc.records.forEach(r => {
          if (r.status === 'Present' && r.studentId) {
            // Safely grab the ID whether it was populated or just a string
            const studentIdStr = typeof r.studentId === 'object' ? r.studentId._id : r.studentId;
            presentIds.add(studentIdStr.toString());
          }
        });
      });

      // 3. Smart calculation: If they are in expectedStudents but NOT in presentIds, they are Absent!
      const calculatedRecords = expectedStudents.map(student => ({
        name: student.name,
        std: student.std || 'N/A',
        batch: student.batch || 'N/A',
        status: presentIds.has(student._id.toString()) ? 'Present' : 'Absent'
      }));

      // 4. SORTING FIX: Sort by Standard -> then Batch -> then Alphabetical Name
      calculatedRecords.sort((a, b) => {
        if (a.std !== b.std) return a.std.localeCompare(b.std);
        if (a.batch !== b.batch) return a.batch.localeCompare(b.batch);
        return a.name.localeCompare(b.name);
      });

      setViewData(calculatedRecords);
    } catch (err) {
      alert("Failed to fetch attendance records.");
    } finally {
      setIsFetching(false);
    }
  };

  // Apply the "Present/Absent Only" filter to the display data
  const displayedRecords = viewData.filter(r => viewStatusFilter === 'All' || r.status === viewStatusFilter);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      
      {/* Top Toggle Switch */}
      <div className="flex gap-4 mb-8 border-b pb-4">
        <button onClick={() => setTabMode('record')} className={`pb-2 px-2 font-bold text-lg ${tabMode === 'record' ? 'border-b-4 border-purple-600 text-purple-700' : 'text-gray-400'}`}>Record Attendance</button>
        <button onClick={() => setTabMode('view')} className={`pb-2 px-2 font-bold text-lg ${tabMode === 'view' ? 'border-b-4 border-purple-600 text-purple-700' : 'text-gray-400'}`}>View Past Records</button>
      </div>

      {/* ======================= RECORD MODE ======================= */}
      {tabMode === 'record' && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-purple-50 p-4 rounded-xl border border-purple-100">
            <div>
              <label className="block text-sm font-bold text-purple-900 mb-1">Select Date</label>
              <input type="date" value={addDate} onChange={(e) => setAddDate(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-bold text-purple-900 mb-1">Standard</label>
              <select value={addStd} onChange={e => setAddStd(e.target.value)} className="w-full p-2 border rounded">
                <option value="All">All Standards</option>
                {standardOptions.map(std => <option key={std} value={std}>{std}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-purple-900 mb-1">Batch</label>
              <select value={addBatch} onChange={e => setAddBatch(e.target.value)} className="w-full p-2 border rounded">
                <option value="All">All Batches</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2 mb-6">
            <button onClick={() => setMarkMode('markPresent')} className={`px-4 py-2 rounded-md text-sm font-bold ${markMode === 'markPresent' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>Check Presents</button>
            <button onClick={() => setMarkMode('markAbsent')} className={`px-4 py-2 rounded-md text-sm font-bold ${markMode === 'markAbsent' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>Check Absentees</button>
          </div>
          
          <div className="space-y-2 mb-6 max-h-96 overflow-y-auto pr-2">
            {filteredStudents.length === 0 && <p className="text-gray-500 italic p-4 text-center border rounded-lg bg-gray-50">No students found for this filter.</p>}
            {filteredStudents.map(student => (
              <label key={student._id} className="flex items-center gap-4 p-3 border rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                <input type="checkbox" checked={selectedIds.has(student._id)} onChange={() => toggleStudent(student._id)} className="w-5 h-5 accent-purple-600" />
                <div><p className="font-bold text-gray-900">{student.name}</p><p className="text-xs text-gray-500">{student.std} • {student.batch}</p></div>
              </label>
            ))}
          </div>
          <button onClick={handleSubmitAttendance} className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors">Save Attendance for {addDate}</button>
        </div>
      )}
    
      {/* ======================= VIEW MODE ======================= */}
      {tabMode === 'view' && (
        <div className="animate-fade-in">
           <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200 items-end">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
              <input type="date" value={fetchDate} onChange={(e) => setFetchDate(e.target.value)} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Standard</label>
              <select value={fetchStd} onChange={e => setFetchStd(e.target.value)} className="w-full p-2 border rounded">
                <option value="All">All Standards</option>
                {standardOptions.map(std => <option key={std} value={std}>{std}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Batch</label>
              <select value={fetchBatch} onChange={e => setFetchBatch(e.target.value)} className="w-full p-2 border rounded">
                <option value="All">All Batches</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
            
            {/* NEW: Filter by Status */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Status Filter</label>
              <select value={viewStatusFilter} onChange={e => setViewStatusFilter(e.target.value)} className="w-full p-2 border rounded border-purple-300 font-bold text-purple-700">
                <option value="All">Show All</option>
                <option value="Present">Present Only</option>
                <option value="Absent">Absent Only</option>
              </select>
            </div>

            <button onClick={handleFetchAttendance} disabled={isFetching} className="bg-gray-900 text-white p-2 rounded-lg font-bold hover:bg-gray-800 h-10.5 flex items-center justify-center">
              {isFetching ? 'Loading...' : 'Fetch'}
            </button>
          </div>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b"><th className="p-3">Student Name</th><th className="p-3">Standard</th><th className="p-3">Batch</th><th className="p-3">Status</th></tr>
              </thead>
              <tbody>
                {displayedRecords.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-500">No records to display.</td></tr>
                ) : (
                  displayedRecords.map((record, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900">{record.name}</td>
                      <td className="p-3 text-sm text-gray-600">{record.std}</td>
                      <td className="p-3 text-sm text-gray-600">{record.batch}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
// --- 4. MESSAGES TAB ---
const MessagesTab = () => {
  const [content, setContent] = useState('');
  
  const handleSend = async () => {
    try {
      await api.post('/teacher/messages', { recipientGroup: 'All Students', content });
      alert("Message Sent!");
      setContent('');
    } catch (err) { alert("Failed to send"); }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Send className="text-purple-600" /> Announcements</h2>
      <textarea value={content} onChange={e => setContent(e.target.value)} rows="4" className="w-full p-3 border rounded-lg mb-4" placeholder="Type your message here..."></textarea>
      <button onClick={handleSend} className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold">Broadcast Message</button>
    </div>
  );
};

export default TeacherPortal;