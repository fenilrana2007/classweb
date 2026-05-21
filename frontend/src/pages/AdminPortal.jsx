// src/pages/AdminPortal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  ShieldCheck, Users, LayoutDashboard, UserPlus, 
  Ban, Edit, Trash2, Send, Bell, Clock, Download, FileText,
  GraduationCap, Menu, X, IndianRupee, Printer, Image
} from 'lucide-react';
import ExamsTab from '../components/ExamsTab';
import StudentsTab from '../components/StudentsTab';
import FeesTab from '../components/FeesTab';
import GalleryTab from '../components/GalleryTab';

const AdminPortal = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, classesToday: 0 });
  const [teachers, setTeachers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, teachersRes, msgsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/teachers'),
          api.get('/admin/messages')
        ]);
        setStats(statsRes.data);
        setTeachers(teachersRes.data);
        setMessages(msgsRes.data);
      } catch (error) {
        console.error("Failed to load admin data");
      } finally {
        setIsLoading(false);
      }
    };
    if (user && user.role === 'admin') fetchData();
  }, [user]);

  const handleExportMessages = () => {
    if (messages.length === 0) return alert("No messages to export.");
    let csvContent = "Date,Sender Name,Sender Role,Recipient Group,Message Content\n";
    messages.forEach(msg => {
      const date = new Date(msg.createdAt).toLocaleString();
      const senderName = msg.sender?.name || 'Unknown';
      const senderRole = msg.sender?.role || 'Unknown';
      const recipient = msg.recipientGroup;
      const safeContent = msg.content.replace(/,/g, ';').replace(/\n/g, ' '); 
      csvContent += `"${date}","${senderName}","${senderRole}","${recipient}","${safeContent}"\n`;
    });
    downloadCSV(csvContent, `ClassWeb_Message_Audit_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearAllMessages = async () => {
    const confirmDelete = window.confirm("CRITICAL WARNING: Are you sure you want to PERMANENTLY delete ALL messages across the entire platform? This action cannot be undone.");
    if (confirmDelete) {
      try {
        await api.delete('/admin/messages');
        setMessages([]); 
        alert("Platform communication log has been completely wiped.");
      } catch (err) { alert("Failed to delete messages."); }
    }
  };

  if (!user || user.role !== 'admin') return <div className="p-10 text-center text-red-600 font-bold mt-20">Access Denied. Master Admins Only.</div>;
  if (isLoading) return <div className="p-10 text-center mt-20 animate-pulse font-bold text-gray-800">Loading Master Control...</div>;

  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Admin Header */}
      <div className="bg-gray-900 rounded-2xl p-5 md:p-8 text-white shadow-lg mb-6 md:mb-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Admin Control Center</h1>
            <p className="text-gray-300 text-sm md:text-lg">Welcome back, {user.name}.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-white/20 flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-400 md:w-5 md:h-5" />
            <span className="font-bold uppercase tracking-wider text-xs md:text-sm text-green-400">Master Admin</span>
          </div>
        </div>
      </div>

      {/* MOBILE MENU TOGGLE BUTTON */}
      <div className="md:hidden flex justify-between items-center mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <span className="font-bold text-gray-700 flex items-center gap-2">
          {activeTab === 'overview' && <><LayoutDashboard size={18}/> System Overview</>}
          {activeTab === 'staff' && <><Users size={18}/> Manage Faculty</>}
          {activeTab === 'noticeboard' && <><Bell size={18}/> Noticeboard</>}
          {activeTab === 'broadcast' && <><Send size={18}/> Broadcast</>}
          {activeTab === 'students' && <><GraduationCap size={18}/> Manage Students</>}
          {activeTab === 'exams' && <><FileText size={18}/> Examinations</>}
          {activeTab === 'fees' && <><IndianRupee size={18} /> Fee Management</>}
          {activeTab === 'gallery' && <><Image size={18} /> Gallery</>}
        </span>
        <button className="text-gray-900 focus:outline-none bg-gray-100 p-1 rounded">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className={`${isMobileMenuOpen ? 'flex flex-col' : 'hidden'} md:flex md:flex-row flex-wrap gap-2 mb-6 md:mb-8 md:border-b md:border-gray-200 pb-2 md:pb-4 transition-all duration-300`}>
        <TabButton active={activeTab === 'overview'} onClick={() => handleTabSwitch('overview')} icon={<LayoutDashboard size={18} />} text="System Overview" />
        <TabButton active={activeTab === 'staff'} onClick={() => handleTabSwitch('staff')} icon={<Users size={18} />} text="Manage Faculty" />
        <TabButton active={activeTab === 'noticeboard'} onClick={() => handleTabSwitch('noticeboard')} icon={<Bell size={18} />} text="Noticeboard" />
        <TabButton active={activeTab === 'broadcast'} onClick={() => handleTabSwitch('broadcast')} icon={<Send size={18} />} text="Broadcast" />
        <TabButton active={activeTab === 'students'} onClick={() => handleTabSwitch('students')} icon={<GraduationCap size={18} />} text="Manage Students" />
        <TabButton active={activeTab === 'exams'} onClick={() => handleTabSwitch('exams')} icon={<FileText size={18} />} text="Examinations" />
        <TabButton active={activeTab === 'fees'} onClick={() => handleTabSwitch('fees')} icon={<IndianRupee size={18} />} text="Fee Management" />
        <TabButton active={activeTab === 'gallery'} onClick={() => handleTabSwitch('gallery')} icon={<Image size={18} />} text="Gallery" />
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && <OverviewTab stats={stats} downloadCSV={downloadCSV} />}
      {activeTab === 'staff' && <StaffTab teachers={teachers} setTeachers={setTeachers} />}
      {activeTab === 'noticeboard' && <NoticeboardTab messages={messages} onExport={handleExportMessages} onClear={handleClearAllMessages}/>}
      {activeTab === 'broadcast' && <BroadcastTab messages={messages} setMessages={setMessages} user={user} />}
      {activeTab === 'students' && <StudentsTab />} 
      {activeTab === 'exams' && <ExamsTab />} 
      {activeTab === 'fees' && <FeesTab />} 
      {activeTab === 'gallery' && <GalleryTab isAdmin={true} />}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, text }) => (
  <button onClick={onClick} className={`w-full md:w-auto flex justify-start md:justify-center items-center gap-2 px-4 py-3 md:py-2 rounded-lg font-medium transition-colors ${active ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
    {icon} {text}
  </button>
);

/* ==========================================
   1. OVERVIEW TAB (WITH EXCEL EXPORT & WIPE)
   ========================================== */
const OverviewTab = ({ stats, downloadCSV }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportAllAttendance = async (isBackupMode = false) => {
    setIsExporting(true);
    try {
      // Fetching all student attendance records with no date filter
      const res = await api.get('/teacher/attendance?date=All&std=All&batch=All');
      if (!res.data || res.data.length === 0) {
        alert("No attendance data found in the system to export.");
        setIsExporting(false);
        return false;
      }

      let csv = "Date,Standard,Batch,Student Name,Attendance Status\n";
      res.data.forEach(recordBlock => {
        const date = recordBlock.date;
        const std = recordBlock.std;
        const batch = recordBlock.batch;
        recordBlock.records.forEach(r => {
          const studentName = r.studentId?.name || "Deleted Student";
          csv += `"${date}","${std}","${batch}","${studentName}","${r.status}"\n`;
        });
      });

      const fileName = isBackupMode 
        ? `WIPE_BACKUP_Attendance_Ledger_${new Date().toISOString().split('T')[0]}.csv`
        : `ClassWeb_Master_Attendance_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
        
      downloadCSV(csv, fileName);
      setIsExporting(false);
      return true;
    } catch (err) {
      alert("Error generating attendance spreadsheet.");
      setIsExporting(false);
      return false;
    }
  };

  const handleWipeAllAttendance = async () => {
    const confirmWipe = window.confirm("🚨 CRITICAL ACTION 🚨\nAre you sure you want to permanently delete ALL student attendance history? \n\nClicking OK will automatically download an Excel/CSV backup copy first for safety.");
    if (confirmWipe) {
      const backupSuccessful = await handleExportAllAttendance(true);
      if (!backupSuccessful) {
        alert("Wipe aborted. Backup file failed to generate. Data is safe.");
        return;
      }
      
      const confirmDeleteText = window.prompt("Type 'DELETE' to confirm complete wipe of database logs:");
      if (confirmDeleteText === 'DELETE') {
        try {
          await api.delete('/teacher/attendance'); 
          alert("All historical database attendance logs have been securely wiped.");
          window.location.reload(); 
        } catch (err) { alert("Failed to clear database logs."); }
      } else {
        alert("Wipe cancelled. Your database is untouched.");
      }
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 md:p-4 rounded-xl bg-blue-50 text-blue-600"><Users size={24} /></div>
          <div><p className="text-xs md:text-sm text-gray-500 font-medium">Total Registered Students</p><p className="text-2xl md:text-3xl font-bold">{stats.totalStudents}</p></div>
        </div>
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 md:p-4 rounded-xl bg-purple-50 text-purple-600"><ShieldCheck size={24} /></div>
          <div><p className="text-xs md:text-sm text-gray-500 font-medium">Total Active Faculty</p><p className="text-2xl md:text-3xl font-bold">{stats.totalTeachers}</p></div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <h3 className="font-bold text-red-800 text-base md:text-lg flex items-center gap-2"><Ban size={20} className="text-red-600" /> System Danger Zone</h3>
          <p className="text-xs md:text-sm text-red-600 mt-0.5">Manage historical system logs or wipe global attendance tracking databases to start a fresh batch term year.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button 
            onClick={() => handleExportAllAttendance(false)} 
            disabled={isExporting}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold px-4 py-2.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Download size={16}/> {isExporting ? 'Exporting...' : 'Export Ledger (Excel/CSV)'}
          </button>
          <button 
            onClick={handleWipeAllAttendance} 
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-lg shadow transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Trash2 size={16}/> Wipe All Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   2. MANAGE STAFF TAB
   ========================================== */
const StaffTab = ({ teachers, setTeachers }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  const handleAddNewClick = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '', password: '' });
    setShowForm(!showForm);
  };

  const handleEditClick = (teacher) => {
    setEditingId(teacher._id);
    setFormData({ name: teacher.name, email: teacher.email, phone: teacher.phone || '', password: '' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/admin/teachers/${editingId}`, formData);
        setTeachers(teachers.map(t => t._id === editingId ? res.data : t));
        alert("Faculty Details Updated!");
      } else {
        const res = await api.post('/admin/teachers', formData);
        setTeachers([...teachers, res.data]);
        alert("Faculty Account Created!");
      }
      setShowForm(false);
    } catch (err) { alert(err.response?.data?.message || "Error saving faculty data"); }
  };

  const handleToggleBlock = async (id) => {
    try {
      await api.put(`/admin/users/${id}/block`);
      setTeachers(teachers.map(t => t._id === id ? { ...t, isBlocked: !t.isBlocked } : t));
    } catch (err) { alert("Error updating status"); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("CRITICAL: Delete this Faculty member permanently?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        setTeachers(teachers.filter(t => t._id !== id));
      } catch (err) { alert("Error deleting user"); }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-900">Faculty Directory</h2>
        <button onClick={handleAddNewClick} className="w-full md:w-auto bg-gray-900 text-white px-4 py-2 rounded-lg flex justify-center items-center gap-2 font-bold hover:bg-gray-800">
          <UserPlus size={16} /> {showForm && !editingId ? 'Cancel' : 'Add New Faculty'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 md:p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="font-bold text-base md:text-lg mb-4 text-gray-900">{editingId ? 'Edit Faculty Account' : 'Create Faculty Account'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input required type="text" placeholder="Full Name" value={formData.name} className="p-2 border rounded outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base" onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required type="email" placeholder="Email Address" disabled={editingId} value={formData.email} className={`p-2 border rounded outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base ${editingId ? 'bg-gray-200' : ''}`} onChange={e => setFormData({...formData, email: e.target.value})} />
            {!editingId && <input required type="password" placeholder="Secure Password" value={formData.password} className="p-2 border rounded outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base" onChange={e => setFormData({...formData, password: e.target.value})} />}
            <input type="text" placeholder="Phone Number" value={formData.phone} className="p-2 border rounded outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base" onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <button type="submit" className="w-full md:w-auto bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800">{editingId ? 'Save Changes' : 'Authorize Account'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="w-full md:w-auto bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-bold hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-125">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200"><th className="p-3 md:p-4 text-xs md:text-sm text-gray-500">Name</th><th className="p-3 md:p-4 text-xs md:text-sm text-gray-500">Contact</th><th className="p-3 md:p-4 text-xs md:text-sm text-gray-500">System Status</th><th className="p-3 md:p-4 text-xs md:text-sm text-gray-500">Actions</th></tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr><td colSpan="4" className="p-6 md:p-8 text-center text-sm text-gray-500">No faculty members found.</td></tr>
            ) : (
              teachers.map(teacher => (
                <tr key={teacher._id} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${teacher.isBlocked ? 'opacity-50' : ''}`}>
                  <td className="p-3 md:p-4 text-sm font-bold text-gray-900">{teacher.name}</td>
                  <td className="p-3 md:p-4 text-xs md:text-sm text-gray-600">{teacher.email}<br/>{teacher.phone}</td>
                  <td className="p-3 md:p-4">
                    <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold ${teacher.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {teacher.isBlocked ? 'Revoked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-3 md:p-4 flex gap-2">
                    <button onClick={() => handleEditClick(teacher)} className="p-1.5 md:p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg" title="Edit Details"><Edit size={16} /></button>
                    <button onClick={() => handleToggleBlock(teacher._id)} className="p-1.5 md:p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg" title={teacher.isBlocked ? "Restore Access" : "Revoke Access"}><Ban size={16} /></button>
                    <button onClick={() => handleDelete(teacher._id)} className="p-1.5 md:p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg" title="Delete Account"><Trash2 size={16} /></button>
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

/* ==========================================
   3. NOTICEBOARD TAB
   ========================================== */
const NoticeboardTab = ({ messages, onExport, onClear }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in max-w-5xl">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2"><Bell className="text-gray-900" /> Platform Communication Log</h2>
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <button onClick={onExport} className="flex-1 md:flex-none bg-green-50 text-green-700 border border-green-200 px-3 md:px-4 py-2 rounded-lg flex justify-center items-center gap-2 font-bold hover:bg-green-100 transition-colors shadow-sm text-sm md:text-base"><Download size={16} /> Export CSV</button>
        <button onClick={onClear} className="flex-1 md:flex-none bg-red-50 text-red-700 border border-red-200 px-3 md:px-4 py-2 rounded-lg flex justify-center items-center gap-2 font-bold hover:bg-red-100 transition-colors shadow-sm text-sm md:text-base"><Trash2 size={16} /> Clear All Logs</button>
      </div>
    </div>
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="p-8 md:p-12 text-center text-gray-500 bg-gray-50 border border-dashed rounded-xl">
          <Bell size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="font-bold text-base md:text-lg">Communication Log Empty</p>
          <p className="text-xs md:text-sm mt-1">No messages found on the platform.</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg._id} className="bg-gray-50/50 rounded-xl border border-gray-200 p-4 md:p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3 border-b border-gray-200 pb-3">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 text-white rounded-full flex items-center justify-center font-bold shrink-0 ${msg.sender?.role === 'admin' ? 'bg-gray-900' : 'bg-purple-600'}`}>{msg.sender?.name ? msg.sender.name.charAt(0).toUpperCase() : 'U'}</div>
                <div>
                  <p className="font-bold text-sm md:text-base text-gray-900">{msg.sender?.name || 'Unknown User'} <span className="text-[10px] md:text-xs font-normal text-gray-500">({msg.sender?.role})</span></p>
                  <p className="text-[10px] md:text-xs font-bold text-gray-700 uppercase tracking-wider">Sent To: {msg.recipientGroup}</p>
                </div>
              </div>
              <span className="text-[10px] md:text-xs text-gray-500 bg-white px-2 py-1 rounded-md border flex items-center gap-1 shadow-sm shrink-0"><Clock size={12}/> {new Date(msg.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm md:text-base text-gray-800 whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))
      )}
    </div>
  </div>
);

/* ==========================================
   4. BROADCAST TAB
   ========================================== */
const BroadcastTab = ({ messages, setMessages, user }) => {
  const [newContent, setNewContent] = useState('');
  const [recipient, setRecipient] = useState('All Staff & Admin');
  
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    try {
      const res = await api.post('/admin/messages', { recipientGroup: recipient, content: newContent });
      const newMessage = { ...res.data, sender: { name: user.name, role: user.role } };
      setMessages([newMessage, ...messages]); 
      alert("Master Broadcast Sent Successfully!");
      setNewContent('');
    } catch (err) { alert("Failed to send message."); }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in max-w-4xl">
      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2"><Send className="text-gray-900" /> System Broadcast</h2>
      <form onSubmit={handleSend}>
        <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">Select Target Audience</label>
        <select value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full md:w-1/2 p-2 md:p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base bg-white">
          <option value="All Staff & Admin">To: All Faculty & Administrators</option>
          <option value="All Students">To: All Students</option>
        </select>
        <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">Message Content</label>
        <textarea value={newContent} onChange={e => setNewContent(e.target.value)} rows="5" className="w-full p-2 md:p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base resize-y" placeholder="Type your official announcement here..." required></textarea>
        <button type="submit" className="w-full md:w-auto bg-gray-900 text-white px-6 md:px-8 py-3 rounded-lg font-bold hover:bg-gray-800 shadow-md">Broadcast Message</button>
      </form>
    </div>
  );
};

export default AdminPortal;