
// src/pages/AdminPortal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  ShieldCheck, Users, LayoutDashboard, UserPlus, 
  Ban, Edit, Trash2, Send, Bell, Clock, Download, FileText,
  GraduationCap, Menu, X, IndianRupee, Printer, Image, BookOpen, Filter, AlertTriangle
} from 'lucide-react';
import ExamsTab from '../components/ExamsTab';
import StudentsTab from '../components/StudentsTab';
import FeesTab from '../components/FeesTab';
import GalleryTab from '../components/GalleryTab';

const STANDARD_OPTIONS = [
  "1st Std", "2nd Std", "3rd Std", "4th Std", "5th Std", "6th Std", 
  "7th Std", "8th Std", "9th Std", "10th Std", "11th Commerce", "12th Commerce"
];

const AdminPortal = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Master States
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, classesToday: 0 });
  const [teachers, setTeachers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [classLogs, setClassLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, teachersRes, msgsRes, logsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/teachers'),
          api.get('/admin/messages'),
          api.get('/admin/class-logs') // Dedicated Admin endpoint to safely audit teacher logs
        ]);
        setStats(statsRes.data);
        setTeachers(teachersRes.data);
        setMessages(msgsRes.data);
        setClassLogs(logsRes.data || []);
      } catch (error) {
        console.error("Failed to load admin management panels");
      } finally {
        setIsLoading(false);
      }
    };
    if (user && user.role === 'admin') fetchData();
  }, [user]);

  if (!user || user.role !== 'admin') return <div className="p-10 text-center text-red-600 font-bold mt-20">Access Denied. Master Admins Only.</div>;
  if (isLoading) return <div className="p-10 text-center mt-20 animate-pulse font-bold text-gray-800">Loading Master Control...</div>;

  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      
      {/* Dashboard Top Banner */}
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

      {/* --- MOBILE COMPONENT DROPDOWN NAVIGATION --- */}
      <div className="md:hidden flex justify-between items-center mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <span className="font-bold text-gray-700 flex items-center gap-2">
          {activeTab === 'overview' && <><LayoutDashboard size={18}/> System Control</>}
          {activeTab === 'staff' && <><Users size={18}/> Manage Faculty</>}
          {activeTab === 'noticeboard' && <><Bell size={18}/> Noticeboard</>}
          {activeTab === 'broadcast' && <><Send size={18}/> Broadcast</>}
          {activeTab === 'students' && <><GraduationCap size={18}/> Manage Students</>}
          {activeTab === 'exams' && <><FileText size={18}/> Examinations</>}
          {activeTab === 'fees' && <><IndianRupee size={18} /> Fee Management</>}
          {activeTab === 'classlogs' && <><BookOpen size={18} /> Teacher Logs</>}
          {activeTab === 'gallery' && <><Image size={18} /> Gallery</>}
        </span>
        <button className="text-gray-900 focus:outline-none bg-gray-100 p-1 rounded">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Desktop Layout Tabs bar */}
      <div className={`${isMobileMenuOpen ? 'flex flex-col' : 'hidden'} md:flex md:flex-row flex-wrap gap-2 mb-6 md:mb-8 md:border-b md:border-gray-200 pb-2 md:pb-4 transition-all duration-300`}>
        <TabButton active={activeTab === 'overview'} onClick={() => handleTabSwitch('overview')} icon={<LayoutDashboard size={18} />} text="System Control" />
        <TabButton active={activeTab === 'staff'} onClick={() => handleTabSwitch('staff')} icon={<Users size={18} />} text="Manage Faculty" />
        <TabButton active={activeTab === 'noticeboard'} onClick={() => handleTabSwitch('noticeboard')} icon={<Bell size={18} />} text="Noticeboard" />
        <TabButton active={activeTab === 'broadcast'} onClick={() => handleTabSwitch('broadcast')} icon={<Send size={18} />} text="Broadcast" />
        <TabButton active={activeTab === 'students'} onClick={() => handleTabSwitch('students')} icon={<GraduationCap size={18} />} text="Manage Students" />
        <TabButton active={activeTab === 'exams'} onClick={() => handleTabSwitch('exams')} icon={<FileText size={18} />} text="Examinations" />
        <TabButton active={activeTab === 'fees'} onClick={() => handleTabSwitch('fees')} icon={<IndianRupee size={18} />} text="Fee Management" />
        <TabButton active={activeTab === 'classlogs'} onClick={() => handleTabSwitch('classlogs')} icon={<BookOpen size={18} />} text="Teacher Logs" />
        <TabButton active={activeTab === 'gallery'} onClick={() => handleTabSwitch('gallery')} icon={<Image size={18} />} text="Gallery" />
      </div>

      {/* Conditional Panels View Routing Router Context */}
      {activeTab === 'overview' && <OverviewTab stats={stats} messages={messages} classLogs={classLogs} />}
      {activeTab === 'staff' && <StaffTab teachers={teachers} setTeachers={setTeachers} />}
      {activeTab === 'noticeboard' && <NoticeboardTab messages={messages} setMessages={setMessages} />}
      {activeTab === 'broadcast' && <BroadcastTab messages={messages} setMessages={setMessages} user={user} />}
      {activeTab === 'students' && <StudentsTab />} 
      {activeTab === 'exams' && <ExamsTab />} 
      {activeTab === 'fees' && <FeesTab />} 
      {activeTab === 'classlogs' && <TeacherLogsTab classLogs={classLogs} />}
      {activeTab === 'gallery' && <GalleryTab isAdmin={true} />}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, text }) => (
  <button onClick={onClick} className={`w-full md:w-auto flex justify-start md:justify-center items-center gap-2 px-4 py-3 md:py-2 rounded-lg font-medium transition-colors ${active ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
    {icon} {text}
  </button>
);

/* =========================================================================
   1. MAIN CONTROL TAB (THE COMPREHENSIVE 6 PURGE OPERATIONS GRID)
   ========================================================================= */
const OverviewTab = ({ stats, messages, classLogs }) => {
  
  const downloadCSV = (content, title) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title}_Backup_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- AUTOMATIC PRE-PURGE EXPORT GENERATOR MAPPINGS ---
  const handleBackupExport = async (target) => {
    try {
      if (target === 'attendance' || target === 'system_all') {
        const res = await api.get('/teacher/attendance?date=All&std=All&batch=All');
        let csv = "Date,Standard,Batch,Student System ID,Status\n";
        res.data?.forEach(block => block.records?.forEach(r => {
          csv += `"${block.date}","${block.std}","${block.batch}","${r.studentId?._id || r.studentId}","${r.status}"\n`;
        }));
        downloadCSV(csv, "Attendance_Ledger");
      }
      if (target === 'noticeboard' || target === 'system_all') {
        let csv = "Timestamp,Sender,Group Targeted,Message Payload\n";
        messages.forEach(m => { csv += `"${new Date(m.createdAt).toLocaleString()}","${m.sender?.name || 'Faculty'}","${m.recipientGroup}","${m.content.replace(/"/g, '""')}"\n`; });
        downloadCSV(csv, "Noticeboard_Feeds");
      }
      if (target === 'classlogs' || target === 'system_all') {
        let csv = "Date,Standard,Batch,Subject,Topic Taught,Homework Details\n";
        classLogs.forEach(l => { csv += `"${l.date}","${l.std}","${l.batch}","${l.subject}","${l.topicTaught}","${l.homework || 'None'}"\n`; });
        downloadCSV(csv, "Teacher_Lessons_Logs");
      }
      if (target === 'exams' || target === 'system_all') {
        let csv = "Backup Timestamp,Total Students Profile Registry Metrics\n";
        csv += `"${new Date().toLocaleString()}","${stats.totalStudents}"\n`;
        downloadCSV(csv, "Academic_Exams_Snapshot");
      }
      if (target === 'fees' || target === 'system_all') {
        let csv = "Backup Timestamp,Total Collected Registered Student Snapshot\n";
        csv += `"${new Date().toLocaleString()}","${stats.totalStudents}"\n`;
        downloadCSV(csv, "Financial_Fee_Ledger");
      }
      if (target === 'gallery') {
        const res = await api.get('/achievements');
        let csv = "Academic Year,Student Name,Standard,Result Description\n";
        res.data?.forEach(a => { csv += `"${a.academicYear}","${a.studentName}","${a.std}","${a.result}"\n`; });
        downloadCSV(csv, "Gallery_Hall_Of_Fame");
      }
      return true;
    } catch (e) {
      alert("Safety backup routine encountered error fields. Deletion suspended.");
      return false;
    }
  };

  // const handlePurge = async (target, path, sectionTitle) => {
  //   const confirmWipe = window.confirm(`🚨 DATA LOSS WARNING 🚨\nAre you sure you want to drop all data for [${sectionTitle}]?\n\nA complete Excel/CSV backup copy will be auto-downloaded for your files first.`);
  //   if (!confirmWipe) return;

  //   await handleBackupExport(target);

  //   const secretKey = window.prompt(`Type "DELETE" to confirm data destruction for ${sectionTitle}:`);
  //   if (secretKey === 'DELETE') {
  //     try {
  //       await api.delete(`/admin/${path}`);
  //       alert(`Purge Completed successfully for: ${sectionTitle}`);
  //       window.location.reload();
  //     } catch (err) { alert("Server validation failed to execute deletion script."); }
  //   } else {
  //     alert("Mismatch. Destruction flow aborted safely.");
  //   }
  // };
// const handlePurge = async (target, path, sectionTitle) => {
//     const confirmWipe = window.confirm(`🚨 DATA LOSS WARNING 🚨\nAre you sure you want to drop all data for [${sectionTitle}]?\n\nA complete Excel/CSV backup copy will be auto-downloaded for your files first.`);
//     if (!confirmWipe) return;

//     await handleBackupExport(target);

//     const secretKey = window.prompt(`Type "DELETE" to confirm data destruction for ${sectionTitle}:`);
//     if (secretKey === 'DELETE') {
//       try {
//         // 1. Manually grab the security token from your browser's local storage
//         const localData = localStorage.getItem('user') || localStorage.getItem('userInfo');
//         const token = localData ? JSON.parse(localData).token : null;

//         // 2. Force the token into the DELETE request's security headers
//         await api.delete(`/admin/${path}`, {
//             headers: { Authorization: `Bearer ${token}` }
//         });
        
//         alert(`Purge Completed successfully for: ${sectionTitle}`);
//         window.location.reload();
//       } catch (err) { 
//         // 3. Give us a clear alert if it still fails!
//         alert(`Server execution failed: ${err.response?.data?.message || err.message}`); 
//       }
//     } else {
//       alert("Mismatch. Destruction flow aborted safely.");
//     }
//   };
const handlePurge = async (target, path, sectionTitle) => {
    const confirmWipe = window.confirm(`🚨 DATA LOSS WARNING 🚨\nAre you sure you want to drop all data for [${sectionTitle}]?\n\nA complete Excel/CSV backup copy will be auto-downloaded for your files first.`);
    if (!confirmWipe) return;

    await handleBackupExport(target);

    const secretKey = window.prompt(`Type "DELETE" to confirm data destruction for ${sectionTitle}:`);
    if (secretKey === 'DELETE') {
      try {
        // 1. Manually grab your Admin security token
        const localData = localStorage.getItem('user') || localStorage.getItem('userInfo');
        const token = localData ? JSON.parse(localData).token : null;

        // 2. Force the token into the request so the backend doesn't block it!
        await api.delete(`/admin/${path}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        alert(`Purge Completed successfully for: ${sectionTitle}`);
        window.location.reload();
      } catch (err) { 
        alert(`Server execution failed: ${err.response?.data?.message || err.message}`); 
      }
    } else {
      alert("Mismatch. Destruction flow aborted safely.");
    }
  };
  return (
    <div className="animate-fade-in space-y-6">
      {/* Numeric Stats Grid */}
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

      {/* PURGE CONTROL MODULE GRID */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-red-700 font-black uppercase tracking-wider"><AlertTriangle size={24} /> purges database control terminal</div>
        <p className="text-xs md:text-sm text-gray-500 mb-6">Wipe out structured categories independently. Triggers force an immediate Excel/CSV ledger download prior to deletion runs.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* 1. Global Reset Card */}
          <div className="border border-red-300 bg-red-50/30 p-4 rounded-xl flex flex-col justify-between h-40">
            <div>
              <span className="font-extrabold text-sm text-red-900 block">1. Global Reset (Keeps Gallery & Staff)</span>
              <span className="text-[11px] text-red-700 mt-1 block">Removes all students, attendance grids, exams metrics, logs, and fees. Mails/Gallery cards stay safe.</span>
            </div>
            <button onClick={() => handlePurge('system_all', 'purge-all', 'Global Clear (Safe Mode)')} className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs py-2 px-3 rounded shadow w-full">Execute Global Reset</button>
          </div>

          {/* 2. Attendance Reset Card */}
          <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl flex flex-col justify-between h-40">
            <div>
              <span className="font-extrabold text-sm text-gray-900 block">2. Reset Attendance Records</span>
              <span className="text-[11px] text-gray-500 mt-1 block">Wipes out daily student calendars, attendance presence registries, and lists across all standards.</span>
            </div>
            <button onClick={() => handlePurge('attendance', 'purge-attendance', 'Attendance Database')} className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-2 px-3 rounded shadow w-full">Wipe Attendance</button>
          </div>

          {/* 3. Noticeboard Reset Card */}
          <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl flex flex-col justify-between h-40">
            <div>
              <span className="font-extrabold text-sm text-gray-900 block">3. Clear Announcement Logs</span>
              <span className="text-[11px] text-gray-500 mt-1 block">Permanently purges recent communication bulletins, logs, and notice feeds across the dashboard.</span>
            </div>
            <button onClick={() => handlePurge('noticeboard', 'purge-messages', 'Noticeboard System')} className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-2 px-3 rounded shadow w-full">Wipe Announcements</button>
          </div>

          {/* 4. Exams Reset Card */}
          <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl flex flex-col justify-between h-40">
            <div>
              <span className="font-extrabold text-sm text-gray-900 block">4. Clear Academic Results</span>
              <span className="text-[11px] text-gray-500 mt-1 block">Deletes recorded student exam profiles, marks, fail/pass analytics, and reports.</span>
            </div>
            <button onClick={() => handlePurge('exams', 'purge-exams', 'Academic Examinations')} className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-2 px-3 rounded shadow w-full">Wipe Results</button>
          </div>

          {/* 5. Fees Reset Card */}
          <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl flex flex-col justify-between h-40">
            <div>
              <span className="font-extrabold text-sm text-gray-900 block">5. Flush Fee Master Ledger</span>
              <span className="text-[11px] text-gray-500 mt-1 block">Erases financial balance dues tracking sheets, transactions, and printable PDFs history logs.</span>
            </div>
            <button onClick={() => handlePurge('fees', 'purge-fees', 'Financial Fees Ledgers')} className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-2 px-3 rounded shadow w-full">Wipe Fees Ledger</button>
          </div>

          {/* 6. Gallery Reset Card */}
          <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl flex flex-col justify-between h-40">
            <div>
              <span className="font-extrabold text-sm text-gray-900 block">6. Reset Achievement Gallery</span>
              <span className="text-[11px] text-gray-500 mt-1 block">Clears out published student cards, campaign ranks, and photos from the shared gallery view.</span>
            </div>
            <button onClick={() => handlePurge('gallery', 'purge-gallery', 'Hall of Fame Gallery')} className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-2 px-3 rounded shadow w-full">Wipe Gallery cards</button>
          </div>

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
        <table className="w-full text-left border-collapse `min-w-125`">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200"><th className="p-3 md:p-4 text-xs md:text-sm text-gray-500">Name</th><th className="p-3 md:p-4 text-xs md:text-sm text-gray-500">Contact</th><th className="p-3 md:p-4 text-xs md:text-sm text-gray-500">System Status</th><th className="p-3 md:p-4 text-xs md:text-sm text-gray-500">Actions</th></tr>
          </thead>
          <tbody>
            {teachers.map(teacher => (
              <tr key={teacher._id} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${teacher.isBlocked ? 'opacity-50' : ''}`}>
                <td className="p-3 md:p-4 text-sm font-bold text-gray-900">{teacher.name}</td>
                <td className="p-3 md:p-4 text-xs md:text-sm text-gray-600">{teacher.email}<br/>{teacher.phone}</td>
                <td className="p-3 md:p-4">
                  <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold ${teacher.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {teacher.isBlocked ? 'Revoked' : 'Active'}
                  </span>
                </td>
                <td className="p-3 md:p-4 flex gap-2">
                  <button onClick={() => handleEditClick(teacher)} className="p-1.5 md:p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"><Edit size={16} /></button>
                  <button onClick={() => handleToggleBlock(teacher._id)} className="p-1.5 md:p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg"><Ban size={16} /></button>
                  <button onClick={() => handleDelete(teacher._id)} className="p-1.5 md:p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ==========================================
   3. NOTICEBOARD TAB
   ========================================== */
const NoticeboardTab = ({ messages, setMessages }) => {
  const handleExport = () => {
    let csv = "Date,Sender,Recipient,Content\n";
    messages.forEach(m => { csv += `"${new Date(m.createdAt).toLocaleDateString()}","${m.sender?.name || 'Unknown'}","${m.recipientGroup}","${m.content.replace(/"/g, '""')}"\n`; });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'Noticeboard_Audit_Logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = async () => {
    if(window.confirm("Clear all logs?")) {
      try {
        await api.delete('/admin/purge-messages');
        setMessages([]);
      } catch(e) { alert("Error deleting announcements"); }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2"><Bell size={18} /> Communications Audit Log</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={handleExport} className="p-2 border rounded bg-white text-xs font-bold text-gray-700 flex items-center gap-1 shadow-sm"><Download size={14}/> Export</button>
          <button onClick={handleClear} className="p-2 border rounded bg-red-50 text-xs font-bold text-red-600 flex items-center gap-1 shadow-sm"><Trash2 size={14}/> Clear Logs</button>
        </div>
      </div>
      <div className="space-y-3">
        {messages.map(msg => (
          <div key={msg._id} className="p-4 border rounded-xl bg-gray-50/50">
            <span className="text-xs text-gray-400 float-right">{new Date(msg.createdAt).toLocaleDateString()}</span>
            <span className="font-bold text-sm block text-gray-900">{msg.sender?.name || 'Faculty'}</span>
            <span className="text-[10px] text-purple-600 uppercase font-bold tracking-wider">To: {msg.recipientGroup}</span>
            <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

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

/* =========================================================================
   5. TEACHER LOGS AUDIT TAB
   ========================================================================= */
const TeacherLogsTab = ({ classLogs }) => {
  const [filterStd, setFilterStd] = useState('All');
  const [filterBatch, setFilterBatch] = useState('All');

  const filteredLogs = classLogs.filter(log => 
    (filterStd === 'All' || log.std === filterStd) &&
    (filterBatch === 'All' || log.batch === filterBatch)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><BookOpen className="text-purple-600" /> Faculty Lesson Logs Audit</h2>
        <p className="text-xs text-gray-500 mt-0.5">Track topic coverages, homework tracking entries, and lecture timelines.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 border border-gray-100 p-4 rounded-xl my-6">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><Filter size={12}/> Standard wise filter</label>
          <select value={filterStd} onChange={e => setFilterStd(e.target.value)} className="w-full p-2.5 border rounded-lg bg-white text-sm font-medium outline-none">
            <option value="All">All Standards</option>
            {STANDARD_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><Filter size={12}/> Batch wise sorting</label>
          <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} className="w-full p-2.5 border rounded-lg bg-white text-sm font-medium outline-none">
            <option value="All">All Batches</option>
            <option value="Morning">Morning Batch</option>
            <option value="Evening">Evening Batch</option>
            <option value="All Batches">All Batches (Combined)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <p className="text-center text-gray-500 bg-gray-50 p-8 rounded-xl italic border border-dashed text-sm">No daily lesson logs posted for this filter combination.</p>
        ) : (
          filteredLogs.map(log => (
            <div key={log._id} className="border border-gray-200 p-4 rounded-xl shadow-sm bg-white hover:border-purple-200 transition-colors">
              <div className="flex flex-wrap justify-between border-b pb-2 mb-2 gap-2">
                <span className="font-bold text-purple-950 text-sm md:text-base">{log.subject} <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded ml-2">{log.std} • {log.batch}</span></span>
                <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1"><Clock size={12}/> {new Date(log.date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-800"><strong className="text-gray-900">Topic Covered:</strong> {log.topicTaught}</p>
              <p className="text-sm text-gray-800 mt-1"><strong className="text-gray-900">Homework:</strong> {log.homework || <span className="text-gray-400 italic">None assigned</span>}</p>
              {log.attachmentLink && (
                <a href={log.attachmentLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 mt-3">Open Study Resource Link &rarr;</a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPortal;