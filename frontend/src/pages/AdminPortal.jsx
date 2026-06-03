
// // src/pages/AdminPortal.jsx
// import React, { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import api from '../services/api';
// import { 
//   ShieldCheck, Users, LayoutDashboard, UserPlus, 
//   Ban, Edit, Trash2, Send, Bell, Clock, Download, FileText,
//   GraduationCap, Menu, X, IndianRupee, Printer, Image, BookOpen, Filter, AlertTriangle
// } from 'lucide-react';
// import ExamsTab from '../components/ExamsTab';
// import StudentsTab from '../components/StudentsTab';
// import FeesTab from '../components/FeesTab';
// import GalleryTab from '../components/GalleryTab';

// const STANDARD_OPTIONS = [
//   "1st Std", "2nd Std", "3rd Std", "4th Std", "5th Std", "6th Std", 
//   "7th Std", "8th Std", "9th Std", "10th Std", "11th Commerce", "12th Commerce"
// ];

// const AdminPortal = () => {
//   const { user } = useContext(AuthContext);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
//   // Master States
//   const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, classesToday: 0 });
//   const [teachers, setTeachers] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [classLogs, setClassLogs] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [statsRes, teachersRes, msgsRes, logsRes] = await Promise.all([
//           api.get('/admin/stats'),
//           api.get('/admin/teachers'),
//           api.get('/admin/messages'),
//           api.get('/admin/class-logs') // Dedicated Admin endpoint to safely audit teacher logs
//         ]);
//         setStats(statsRes.data);
//         setTeachers(teachersRes.data);
//         setMessages(msgsRes.data);
//         setClassLogs(logsRes.data || []);
//       } catch (error) {
//         console.error("Failed to load admin management panels");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     if (user && user.role === 'admin') fetchData();
//   }, [user]);

//   if (!user || user.role !== 'admin') return <div className="p-10 text-center text-red-600 font-bold mt-20">Access Denied. Master Admins Only.</div>;
//   if (isLoading) return <div className="p-10 text-center mt-20 animate-pulse font-bold text-gray-800">Loading Master Control...</div>;

//   const handleTabSwitch = (tabName) => {
//     setActiveTab(tabName);
//     setIsMobileMenuOpen(false);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      
//       {/* Dashboard Top Banner */}
//       <div className="bg-gray-900 rounded-2xl p-5 md:p-8 text-white shadow-lg mb-6 md:mb-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Admin Control Center</h1>
//             <p className="text-gray-300 text-sm md:text-lg">Welcome back, {user.name}.</p>
//           </div>
//           <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-white/20 flex items-center gap-2">
//             <ShieldCheck size={16} className="text-green-400 md:w-5 md:h-5" />
//             <span className="font-bold uppercase tracking-wider text-xs md:text-sm text-green-400">Master Admin</span>
//           </div>
//         </div>
//       </div>

//       {/* --- MOBILE COMPONENT DROPDOWN NAVIGATION --- */}
//       <div className="md:hidden flex justify-between items-center mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
//         <span className="font-bold text-gray-700 flex items-center gap-2">
//           {activeTab === 'overview' && <><LayoutDashboard size={18}/> System Control</>}
//           {activeTab === 'staff' && <><Users size={18}/> Manage Faculty</>}
//           {activeTab === 'noticeboard' && <><Bell size={18}/> Noticeboard</>}
//           {activeTab === 'broadcast' && <><Send size={18}/> Broadcast</>}
//           {activeTab === 'students' && <><GraduationCap size={18}/> Manage Students</>}
//           {activeTab === 'exams' && <><FileText size={18}/> Examinations</>}
//           {activeTab === 'fees' && <><IndianRupee size={18} /> Fee Management</>}
//           {activeTab === 'classlogs' && <><BookOpen size={18} /> Teacher Logs</>}
//           {activeTab === 'gallery' && <><Image size={18} /> Gallery</>}
//         </span>
//         <button className="text-gray-900 focus:outline-none bg-gray-100 p-1 rounded">
//           {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//         </button>
//       </div>

//       {/* Desktop Layout Tabs bar */}
//       <div className={`${isMobileMenuOpen ? 'flex flex-col' : 'hidden'} md:flex md:flex-row flex-wrap gap-2 mb-6 md:mb-8 md:border-b md:border-gray-200 pb-2 md:pb-4 transition-all duration-300`}>
//         <TabButton active={activeTab === 'overview'} onClick={() => handleTabSwitch('overview')} icon={<LayoutDashboard size={18} />} text="System Control" />
//         <TabButton active={activeTab === 'staff'} onClick={() => handleTabSwitch('staff')} icon={<Users size={18} />} text="Manage Faculty" />
//         <TabButton active={activeTab === 'noticeboard'} onClick={() => handleTabSwitch('noticeboard')} icon={<Bell size={18} />} text="Noticeboard" />
//         <TabButton active={activeTab === 'broadcast'} onClick={() => handleTabSwitch('broadcast')} icon={<Send size={18} />} text="Broadcast" />
//         <TabButton active={activeTab === 'students'} onClick={() => handleTabSwitch('students')} icon={<GraduationCap size={18} />} text="Manage Students" />
//         <TabButton active={activeTab === 'exams'} onClick={() => handleTabSwitch('exams')} icon={<FileText size={18} />} text="Examinations" />
//         <TabButton active={activeTab === 'fees'} onClick={() => handleTabSwitch('fees')} icon={<IndianRupee size={18} />} text="Fee Management" />
//         <TabButton active={activeTab === 'classlogs'} onClick={() => handleTabSwitch('classlogs')} icon={<BookOpen size={18} />} text="Teacher Logs" />
//         <TabButton active={activeTab === 'gallery'} onClick={() => handleTabSwitch('gallery')} icon={<Image size={18} />} text="Gallery" />
//       </div>

//       {/* Conditional Panels View Routing Router Context */}
//       {activeTab === 'overview' && <OverviewTab stats={stats} messages={messages} classLogs={classLogs} />}
//       {activeTab === 'staff' && <StaffTab teachers={teachers} setTeachers={setTeachers} />}
//       {activeTab === 'noticeboard' && <NoticeboardTab messages={messages} setMessages={setMessages} />}
//       {activeTab === 'broadcast' && <BroadcastTab messages={messages} setMessages={setMessages} user={user} />}
//       {activeTab === 'students' && <StudentsTab />} 
//       {activeTab === 'exams' && <ExamsTab />} 
//       {activeTab === 'fees' && <FeesTab />} 
//       {activeTab === 'classlogs' && <TeacherLogsTab classLogs={classLogs} />}
//       {activeTab === 'gallery' && <GalleryTab isAdmin={true} />}
//     </div>
//   );
// };

// const TabButton = ({ active, onClick, icon, text }) => (
//   <button onClick={onClick} className={`w-full md:w-auto flex justify-start md:justify-center items-center gap-2 px-4 py-3 md:py-2 rounded-lg font-medium transition-colors ${active ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
//     {icon} {text}
//   </button>
// );

// /* =========================================================================
//    1. MAIN CONTROL TAB (THE COMPREHENSIVE 6 PURGE OPERATIONS GRID)
//    ========================================================================= */
// const OverviewTab = ({ stats, messages, classLogs }) => {
  
//   const downloadCSV = (content, title) => {
//     const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `${title}_Backup_${new Date().toISOString().split('T')[0]}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // --- AUTOMATIC PRE-PURGE EXPORT GENERATOR MAPPINGS ---
//   const handleBackupExport = async (target) => {
//     try {
//       if (target === 'attendance' || target === 'system_all') {
//         const res = await api.get('/teacher/attendance?date=All&std=All&batch=All');
//         let csv = "Date,Standard,Batch,Student System ID,Status\n";
//         res.data?.forEach(block => block.records?.forEach(r => {
//           csv += `"${block.date}","${block.std}","${block.batch}","${r.studentId?._id || r.studentId}","${r.status}"\n`;
//         }));
//         downloadCSV(csv, "Attendance_Ledger");
//       }
//       if (target === 'noticeboard' || target === 'system_all') {
//         let csv = "Timestamp,Sender,Group Targeted,Message Payload\n";
//         messages.forEach(m => { csv += `"${new Date(m.createdAt).toLocaleString()}","${m.sender?.name || 'Faculty'}","${m.recipientGroup}","${m.content.replace(/"/g, '""')}"\n`; });
//         downloadCSV(csv, "Noticeboard_Feeds");
//       }
//       if (target === 'classlogs' || target === 'system_all') {
//         let csv = "Date,Standard,Batch,Subject,Topic Taught,Homework Details\n";
//         classLogs.forEach(l => { csv += `"${l.date}","${l.std}","${l.batch}","${l.subject}","${l.topicTaught}","${l.homework || 'None'}"\n`; });
//         downloadCSV(csv, "Teacher_Lessons_Logs");
//       }
//       if (target === 'exams' || target === 'system_all') {
//         let csv = "Backup Timestamp,Total Students Profile Registry Metrics\n";
//         csv += `"${new Date().toLocaleString()}","${stats.totalStudents}"\n`;
//         downloadCSV(csv, "Academic_Exams_Snapshot");
//       }
//       if (target === 'fees' || target === 'system_all') {
//         let csv = "Backup Timestamp,Total Collected Registered Student Snapshot\n";
//         csv += `"${new Date().toLocaleString()}","${stats.totalStudents}"\n`;
//         downloadCSV(csv, "Financial_Fee_Ledger");
//       }
//       if (target === 'gallery') {
//         const res = await api.get('/achievements');
//         let csv = "Academic Year,Student Name,Standard,Result Description\n";
//         res.data?.forEach(a => { csv += `"${a.academicYear}","${a.studentName}","${a.std}","${a.result}"\n`; });
//         downloadCSV(csv, "Gallery_Hall_Of_Fame");
//       }
//       return true;
//     } catch (e) {
//       alert("Safety backup routine encountered error fields. Deletion suspended.");
//       return false;
//     }
//   };

//  const handlePurge = async (target, path, sectionTitle) => {
//     const confirmWipe = window.confirm(`🚨 DATA LOSS WARNING 🚨\nAre you sure you want to drop all data for [${sectionTitle}]?\n\nA complete Excel/CSV backup copy will be auto-downloaded for your files first.`);
//     if (!confirmWipe) return;

//     await handleBackupExport(target);

//     const secretKey = window.prompt(`Type "DELETE" to confirm data destruction for ${sectionTitle}:`);
//     if (secretKey === 'DELETE') {
//       try {
//         const localData = localStorage.getItem('user') || localStorage.getItem('userInfo');
//         const token = localData ? JSON.parse(localData).token : null;
//         const config = { headers: { Authorization: `Bearer ${token}` } };

//         // 🌟 SMART ROUTING: If deleting fees, use your existing feeRoutes endpoint!
//         let endpointUrl = `/admin/${path}`;
//         if (target === 'fees') {
//             endpointUrl = '/fees/all-payments'; // Make sure this matches your main server.js prefix (e.g., /api/fees)
//         }

//         // Execute the deletion
//         await api.delete(endpointUrl, config);
        
//         alert(`Purge Completed successfully for: ${sectionTitle}`);
//         window.location.reload();
//       } catch (err) { 
//         alert(`Server execution failed: ${err.response?.data?.message || err.message}`); 
//       }
//     } else {
//       alert("Mismatch. Destruction flow aborted safely.");
//     }
//   };
//   return (
//     <div className="animate-fade-in space-y-6">
//       {/* Numeric Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//         <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-100 shadow-sm flex items-center gap-4">
//           <div className="p-3 md:p-4 rounded-xl bg-blue-50 text-blue-600"><Users size={24} /></div>
//           <div><p className="text-xs md:text-sm text-gray-500 font-medium">Total Registered Students</p><p className="text-2xl md:text-3xl font-bold">{stats.totalStudents}</p></div>
//         </div>
//         <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-100 shadow-sm flex items-center gap-4">
//           <div className="p-3 md:p-4 rounded-xl bg-purple-50 text-purple-600"><ShieldCheck size={24} /></div>
//           <div><p className="text-xs md:text-sm text-gray-500 font-medium">Total Active Faculty</p><p className="text-2xl md:text-3xl font-bold">{stats.totalTeachers}</p></div>
//         </div>
//       </div>

//       {/* PURGE CONTROL MODULE GRID */}
//       <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
//         <div className="flex items-center gap-2 mb-2 text-red-700 font-black uppercase tracking-wider"><AlertTriangle size={24} /> purges database control terminal</div>
//         <p className="text-xs md:text-sm text-gray-500 mb-6">Wipe out structured categories independently. Triggers force an immediate Excel/CSV ledger download prior to deletion runs.</p>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
//           {/* 1. Global Reset Card */}
//           <div className="border border-red-300 bg-red-50/30 p-4 rounded-xl flex flex-col justify-between h-40">
//             <div>
//               <span className="font-extrabold text-sm text-red-900 block">1. Global Reset (Keeps Gallery & Staff)</span>
//               <span className="text-[11px] text-red-700 mt-1 block">Removes all students, attendance grids, exams metrics, logs, and fees. Mails/Gallery cards stay safe.</span>
//             </div>
//             <button onClick={() => handlePurge('system_all', 'purge-all', 'Global Clear (Safe Mode)')} className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs py-2 px-3 rounded shadow w-full">Execute Global Reset</button>
//           </div>

//           {/* 2. Attendance Reset Card */}
//           <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl flex flex-col justify-between h-40">
//             <div>
//               <span className="font-extrabold text-sm text-gray-900 block">2. Reset Attendance Records</span>
//               <span className="text-[11px] text-gray-500 mt-1 block">Wipes out daily student calendars, attendance presence registries, and lists across all standards.</span>
//             </div>
//             <button onClick={() => handlePurge('attendance', 'purge-attendance', 'Attendance Database')} className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-2 px-3 rounded shadow w-full">Wipe Attendance</button>
//           </div>

//           {/* 3. Noticeboard Reset Card */}
//           <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl flex flex-col justify-between h-40">
//             <div>
//               <span className="font-extrabold text-sm text-gray-900 block">3. Clear Announcement Logs</span>
//               <span className="text-[11px] text-gray-500 mt-1 block">Permanently purges recent communication bulletins, logs, and notice feeds across the dashboard.</span>
//             </div>
//             <button onClick={() => handlePurge('noticeboard', 'purge-messages', 'Noticeboard System')} className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-2 px-3 rounded shadow w-full">Wipe Announcements</button>
//           </div>

//           {/* 4. Exams Reset Card */}
//           <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl flex flex-col justify-between h-40">
//             <div>
//               <span className="font-extrabold text-sm text-gray-900 block">4. Clear Academic Results</span>
//               <span className="text-[11px] text-gray-500 mt-1 block">Deletes recorded student exam profiles, marks, fail/pass analytics, and reports.</span>
//             </div>
//             <button onClick={() => handlePurge('exams', 'purge-exams', 'Academic Examinations')} className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-2 px-3 rounded shadow w-full">Wipe Results</button>
//           </div>

//           {/* 5. Fees Reset Card */}
//           <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl flex flex-col justify-between h-40">
//             <div>
//               <span className="font-extrabold text-sm text-gray-900 block">5. Flush Fee Master Ledger</span>
//               <span className="text-[11px] text-gray-500 mt-1 block">Erases financial balance dues tracking sheets, transactions, and printable PDFs history logs.</span>
//             </div>
//             <button onClick={() => handlePurge('fees', 'purge-fees', 'Financial Fees Ledgers')} className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-2 px-3 rounded shadow w-full">Wipe Fees Ledger</button>
//           </div>

//           {/* 6. Gallery Reset Card */}
//           <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl flex flex-col justify-between h-40">
//             <div>
//               <span className="font-extrabold text-sm text-gray-900 block">6. Reset Achievement Gallery</span>
//               <span className="text-[11px] text-gray-500 mt-1 block">Clears out published student cards, campaign ranks, and photos from the shared gallery view.</span>
//             </div>
//             <button onClick={() => handlePurge('gallery', 'purge-gallery', 'Hall of Fame Gallery')} className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-2 px-3 rounded shadow w-full">Wipe Gallery cards</button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// /* ==========================================
//    2. MANAGE STAFF TAB
//    ========================================== */
// const StaffTab = ({ teachers, setTeachers }) => {
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

//   const handleAddNewClick = () => {
//     setEditingId(null);
//     setFormData({ name: '', email: '', phone: '', password: '' });
//     setShowForm(!showForm);
//   };

//   const handleEditClick = (teacher) => {
//     setEditingId(teacher._id);
//     setFormData({ name: teacher.name, email: teacher.email, phone: teacher.phone || '', password: '' });
//     setShowForm(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         const res = await api.put(`/admin/teachers/${editingId}`, formData);
//         setTeachers(teachers.map(t => t._id === editingId ? res.data : t));
//         alert("Faculty Details Updated!");
//       } else {
//         const res = await api.post('/admin/teachers', formData);
//         setTeachers([...teachers, res.data]);
//         alert("Faculty Account Created!");
//       }
//       setShowForm(false);
//     } catch (err) { alert(err.response?.data?.message || "Error saving faculty data"); }
//   };

//   const handleToggleBlock = async (id) => {
//     try {
//       await api.put(`/admin/users/${id}/block`);
//       setTeachers(teachers.map(t => t._id === id ? { ...t, isBlocked: !t.isBlocked } : t));
//     } catch (err) { alert("Error updating status"); }
//   };

//   const handleDelete = async (id) => {
//     if(window.confirm("CRITICAL: Delete this Faculty member permanently?")) {
//       try {
//         await api.delete(`/admin/users/${id}`);
//         setTeachers(teachers.filter(t => t._id !== id));
//       } catch (err) { alert("Error deleting user"); }
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
//         <h2 className="text-lg md:text-xl font-bold text-gray-900">Faculty Directory</h2>
//         <button onClick={handleAddNewClick} className="w-full md:w-auto bg-gray-900 text-white px-4 py-2 rounded-lg flex justify-center items-center gap-2 font-bold hover:bg-gray-800">
//           <UserPlus size={16} /> {showForm && !editingId ? 'Cancel' : 'Add New Faculty'}
//         </button>
//       </div>

//       {showForm && (
//         <form onSubmit={handleSubmit} className="mb-8 p-4 md:p-6 bg-gray-50 rounded-xl border border-gray-200">
//           <h3 className="font-bold text-base md:text-lg mb-4 text-gray-900">{editingId ? 'Edit Faculty Account' : 'Create Faculty Account'}</h3>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//             <input required type="text" placeholder="Full Name" value={formData.name} className="p-2 border rounded outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base" onChange={e => setFormData({...formData, name: e.target.value})} />
//             <input required type="email" placeholder="Email Address" disabled={editingId} value={formData.email} className={`p-2 border rounded outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base ${editingId ? 'bg-gray-200' : ''}`} onChange={e => setFormData({...formData, email: e.target.value})} />
//             {!editingId && <input required type="password" placeholder="Secure Password" value={formData.password} className="p-2 border rounded outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base" onChange={e => setFormData({...formData, password: e.target.value})} />}
//             <input type="text" placeholder="Phone Number" value={formData.phone} className="p-2 border rounded outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base" onChange={e => setFormData({...formData, phone: e.target.value})} />
//           </div>
//           <div className="flex flex-col md:flex-row gap-2 md:gap-4">
//             <button type="submit" className="w-full md:w-auto bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800">{editingId ? 'Save Changes' : 'Authorize Account'}</button>
//             <button type="button" onClick={() => setShowForm(false)} className="w-full md:w-auto bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-bold hover:bg-gray-400">Cancel</button>
//           </div>
//         </form>
//       )}

//       <div className="overflow-x-auto">
//         <table className="w-full text-left border-collapse `min-w-125`">
//           <thead>
//             <tr className="bg-gray-50 border-b border-gray-200"><th className="p-3 md:p-4 text-xs md:text-sm text-gray-500">Name</th><th className="p-3 md:p-4 text-xs md:text-sm text-gray-500">Contact</th><th className="p-3 md:p-4 text-xs md:text-sm text-gray-500">System Status</th><th className="p-3 md:p-4 text-xs md:text-sm text-gray-500">Actions</th></tr>
//           </thead>
//           <tbody>
//             {teachers.map(teacher => (
//               <tr key={teacher._id} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${teacher.isBlocked ? 'opacity-50' : ''}`}>
//                 <td className="p-3 md:p-4 text-sm font-bold text-gray-900">{teacher.name}</td>
//                 <td className="p-3 md:p-4 text-xs md:text-sm text-gray-600">{teacher.email}<br/>{teacher.phone}</td>
//                 <td className="p-3 md:p-4">
//                   <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold ${teacher.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
//                     {teacher.isBlocked ? 'Revoked' : 'Active'}
//                   </span>
//                 </td>
//                 <td className="p-3 md:p-4 flex gap-2">
//                   <button onClick={() => handleEditClick(teacher)} className="p-1.5 md:p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"><Edit size={16} /></button>
//                   <button onClick={() => handleToggleBlock(teacher._id)} className="p-1.5 md:p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg"><Ban size={16} /></button>
//                   <button onClick={() => handleDelete(teacher._id)} className="p-1.5 md:p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// /* ==========================================
//    3. NOTICEBOARD TAB
//    ========================================== */
// const NoticeboardTab = ({ messages, setMessages }) => {
//   const handleExport = () => {
//     let csv = "Date,Sender,Recipient,Content\n";
//     messages.forEach(m => { csv += `"${new Date(m.createdAt).toLocaleDateString()}","${m.sender?.name || 'Unknown'}","${m.recipientGroup}","${m.content.replace(/"/g, '""')}"\n`; });
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.setAttribute('download', 'Noticeboard_Audit_Logs.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleClear = async () => {
//     if(window.confirm("Clear all logs?")) {
//       try {
//         await api.delete('/admin/purge-messages');
//         setMessages([]);
//       } catch(e) { alert("Error deleting announcements"); }
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in max-w-5xl">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
//         <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2"><Bell size={18} /> Communications Audit Log</h2>
//         <div className="flex gap-2 w-full md:w-auto">
//           <button onClick={handleExport} className="p-2 border rounded bg-white text-xs font-bold text-gray-700 flex items-center gap-1 shadow-sm"><Download size={14}/> Export</button>
//           <button onClick={handleClear} className="p-2 border rounded bg-red-50 text-xs font-bold text-red-600 flex items-center gap-1 shadow-sm"><Trash2 size={14}/> Clear Logs</button>
//         </div>
//       </div>
//       <div className="space-y-3">
//         {messages.map(msg => (
//           <div key={msg._id} className="p-4 border rounded-xl bg-gray-50/50">
//             <span className="text-xs text-gray-400 float-right">{new Date(msg.createdAt).toLocaleDateString()}</span>
//             <span className="font-bold text-sm block text-gray-900">{msg.sender?.name || 'Faculty'}</span>
//             <span className="text-[10px] text-purple-600 uppercase font-bold tracking-wider">To: {msg.recipientGroup}</span>
//             <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{msg.content}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// /* ==========================================
//    4. BROADCAST TAB
//    ========================================== */
// const BroadcastTab = ({ messages, setMessages, user }) => {
//   const [newContent, setNewContent] = useState('');
//   const [recipient, setRecipient] = useState('All Staff & Admin');
  
//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!newContent.trim()) return;
//     try {
//       const res = await api.post('/admin/messages', { recipientGroup: recipient, content: newContent });
//       const newMessage = { ...res.data, sender: { name: user.name, role: user.role } };
//       setMessages([newMessage, ...messages]); 
//       alert("Master Broadcast Sent Successfully!");
//       setNewContent('');
//     } catch (err) { alert("Failed to send message."); }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in max-w-4xl">
//       <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2"><Send className="text-gray-900" /> System Broadcast</h2>
//       <form onSubmit={handleSend}>
//         <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">Select Target Audience</label>
//         <select value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full md:w-1/2 p-2 md:p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base bg-white">
//           <option value="All Staff & Admin">To: All Faculty & Administrators</option>
//           <option value="All Students">To: All Students</option>
//         </select>
        
//         <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">Message Content</label>
//         <textarea value={newContent} onChange={e => setNewContent(e.target.value)} rows="5" className="w-full p-2 md:p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base resize-y" placeholder="Type your official announcement here..." required></textarea>
        
//         <button type="submit" className="w-full md:w-auto bg-gray-900 text-white px-6 md:px-8 py-3 rounded-lg font-bold hover:bg-gray-800 shadow-md">Broadcast Message</button>
//       </form>
//     </div>
//   );
// };

// /* =========================================================================
//    5. TEACHER LOGS AUDIT TAB
//    ========================================================================= */
// const TeacherLogsTab = ({ classLogs }) => {
//   const [filterStd, setFilterStd] = useState('All');
//   const [filterBatch, setFilterBatch] = useState('All');

//   const filteredLogs = classLogs.filter(log => 
//     (filterStd === 'All' || log.std === filterStd) &&
//     (filterBatch === 'All' || log.batch === filterBatch)
//   );

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
//       <div>
//         <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><BookOpen className="text-purple-600" /> Faculty Lesson Logs Audit</h2>
//         <p className="text-xs text-gray-500 mt-0.5">Track topic coverages, homework tracking entries, and lecture timelines.</p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 border border-gray-100 p-4 rounded-xl my-6">
//         <div>
//           <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><Filter size={12}/> Standard wise filter</label>
//           <select value={filterStd} onChange={e => setFilterStd(e.target.value)} className="w-full p-2.5 border rounded-lg bg-white text-sm font-medium outline-none">
//             <option value="All">All Standards</option>
//             {STANDARD_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
//           </select>
//         </div>
//         <div>
//           <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><Filter size={12}/> Batch wise sorting</label>
//           <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} className="w-full p-2.5 border rounded-lg bg-white text-sm font-medium outline-none">
//             <option value="All">All Batches</option>
//             <option value="Morning">Morning Batch</option>
//             <option value="Evening">Evening Batch</option>
//             <option value="All Batches">All Batches (Combined)</option>
//           </select>
//         </div>
//       </div>

//       <div className="space-y-4">
//         {filteredLogs.length === 0 ? (
//           <p className="text-center text-gray-500 bg-gray-50 p-8 rounded-xl italic border border-dashed text-sm">No daily lesson logs posted for this filter combination.</p>
//         ) : (
//           filteredLogs.map(log => (
//             <div key={log._id} className="border border-gray-200 p-4 rounded-xl shadow-sm bg-white hover:border-purple-200 transition-colors">
//               <div className="flex flex-wrap justify-between border-b pb-2 mb-2 gap-2">
//                 <span className="font-bold text-purple-950 text-sm md:text-base">{log.subject} <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded ml-2">{log.std} • {log.batch}</span></span>
//                 <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1"><Clock size={12}/> {new Date(log.date).toLocaleDateString()}</span>
//               </div>
//               <p className="text-sm text-gray-800"><strong className="text-gray-900">Topic Covered:</strong> {log.topicTaught}</p>
//               <p className="text-sm text-gray-800 mt-1"><strong className="text-gray-900">Homework:</strong> {log.homework || <span className="text-gray-400 italic">None assigned</span>}</p>
//               {log.attachmentLink && (
//                 <a href={log.attachmentLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1 mt-3">Open Study Resource Link &rarr;</a>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminPortal;
// src/pages/AdminPortal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  ShieldCheck, Users, LayoutDashboard, UserPlus, 
  Ban, Edit, Trash2, Send, Bell, Clock, Download, FileText,
  GraduationCap, Menu, X, IndianRupee, Printer, Image, BookOpen, Filter, AlertTriangle, CheckSquare
} from 'lucide-react';
import ExamsTab from '../components/ExamsTab';
import StudentsTab from '../components/StudentsTab';
import FeesTab from '../components/FeesTab';
import GalleryTab from '../components/GalleryTab';
import { downloadFile } from '../services/downloadHelper';

const STANDARD_OPTIONS = [
  "1st Std", "2nd Std", "3rd Std", "4th Std", "5th Std", "6th Std", 
  "7th Std", "8th Std", "9th Std", "10th Std", "11th Commerce", "12th Commerce"
];

const AdminPortal = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
          api.get('/admin/class-logs') 
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
    
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      
      {/* Dashboard Top Banner */}
      <div className="bg-gray-900 rounded-2xl p-5 md:p-8 text-white shadow-lg mb-6 md:mb-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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

      {/* MOBILE COMPONENT DROPDOWN NAVIGATION */}
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
          {activeTab === 'attendance' && <><CheckSquare size={18}/> Attendance Analysis</>}
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
        <TabButton active={activeTab === 'attendance'} onClick={() => handleTabSwitch('attendance')} icon={<CheckSquare size={18} />} text="Attendance" />
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
      {activeTab === 'attendance' && <AdminAttendanceTab />}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, text }) => (
  <button onClick={onClick} className={`w-full md:w-auto flex justify-start md:justify-center items-center gap-2 px-4 py-3 md:py-2 rounded-lg font-medium transition-colors ${active ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
    {icon} {text}
  </button>
);

/* =========================================================================
   1. MAIN CONTROL TAB
   ========================================================================= */
const OverviewTab = ({ stats, messages, classLogs }) => {
  const downloadCSV = (content, title) => {
    downloadFile(content, `${title}_Backup_${new Date().toISOString().split('T')[0]}.csv`);
  };

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

 const handlePurge = async (target, path, sectionTitle) => {
    const confirmWipe = window.confirm(`🚨 DATA LOSS WARNING 🚨\nAre you sure you want to drop all data for [${sectionTitle}]?\n\nA complete Excel/CSV backup copy will be auto-downloaded for your files first.`);
    if (!confirmWipe) return;

    await handleBackupExport(target);

    const secretKey = window.prompt(`Type "DELETE" to confirm data destruction for ${sectionTitle}:`);
    if (secretKey === 'DELETE') {
      try {
        const localData = localStorage.getItem('user') || localStorage.getItem('userInfo');
        const token = localData ? JSON.parse(localData).token : null;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        let endpointUrl = `/admin/${path}`;
        if (target === 'fees') endpointUrl = '/fees/all-payments'; 

        await api.delete(endpointUrl, config);
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

      <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 text-red-700 font-black uppercase tracking-wider">
          <AlertTriangle size={24} /> Database Control Terminal
        </div>
        <p className="text-xs md:text-sm text-gray-500 mb-6">Wipe out structured categories independently. Triggers force an immediate Excel/CSV ledger download prior to deletion runs.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-red-300 bg-red-50/30 p-4 rounded-xl flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="font-extrabold text-sm text-red-900 block">1. Global Reset (Keeps Gallery & Staff)</span>
              <span className="text-[11px] text-red-700 mt-1 block">Removes all students, attendance grids, exams metrics, logs, and fees.</span>
            </div>
            <button onClick={() => handlePurge('system_all', 'purge-all', 'Global Clear (Safe Mode)')} className="mt-4 bg-red-700 hover:bg-red-800 text-white font-bold text-xs py-3 px-3 rounded shadow w-full transition-colors">Execute Global Reset</button>
          </div>

          <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="font-extrabold text-sm text-gray-900 block">2. Reset Attendance Records</span>
              <span className="text-[11px] text-gray-500 mt-1 block">Wipes out daily student calendars, attendance presence registries across all standards.</span>
            </div>
            <button onClick={() => handlePurge('attendance', 'purge-attendance', 'Attendance Database')} className="mt-4 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-3 px-3 rounded shadow w-full transition-colors">Wipe Attendance</button>
          </div>

          <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="font-extrabold text-sm text-gray-900 block">3. Clear Announcement Logs</span>
              <span className="text-[11px] text-gray-500 mt-1 block">Permanently purges recent communication bulletins and notice feeds.</span>
            </div>
            <button onClick={() => handlePurge('noticeboard', 'purge-messages', 'Noticeboard System')} className="mt-4 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-3 px-3 rounded shadow w-full transition-colors">Wipe Announcements</button>
          </div>

          <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="font-extrabold text-sm text-gray-900 block">4. Clear Academic Results</span>
              <span className="text-[11px] text-gray-500 mt-1 block">Deletes recorded student exam profiles, marks, fail/pass analytics, and reports.</span>
            </div>
            <button onClick={() => handlePurge('exams', 'purge-exams', 'Academic Examinations')} className="mt-4 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-3 px-3 rounded shadow w-full transition-colors">Wipe Results</button>
          </div>

          <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="font-extrabold text-sm text-gray-900 block">5. Flush Fee Master Ledger</span>
              <span className="text-[11px] text-gray-500 mt-1 block">Erases financial balance dues tracking sheets and transactions logs.</span>
            </div>
            <button onClick={() => handlePurge('fees', 'purge-fees', 'Financial Fees Ledgers')} className="mt-4 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-3 px-3 rounded shadow w-full transition-colors">Wipe Fees Ledger</button>
          </div>

          <div className="border border-gray-200 bg-gray-50/50 p-4 rounded-xl flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="font-extrabold text-sm text-gray-900 block">6. Reset Achievement Gallery</span>
              <span className="text-[11px] text-gray-500 mt-1 block">Clears out published student cards, campaign ranks, and photos.</span>
            </div>
            <button onClick={() => handlePurge('gallery', 'purge-gallery', 'Hall of Fame Gallery')} className="mt-4 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs py-3 px-3 rounded shadow w-full transition-colors">Wipe Gallery cards</button>
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
        <button onClick={handleAddNewClick} className="w-full md:w-auto bg-gray-900 text-white px-4 py-3 md:py-2 rounded-lg flex justify-center items-center gap-2 font-bold hover:bg-gray-800 transition-colors">
          <UserPlus size={16} /> {showForm && !editingId ? 'Cancel' : 'Add New Faculty'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 md:p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="font-bold text-base md:text-lg mb-4 text-gray-900">{editingId ? 'Edit Faculty Account' : 'Create Faculty Account'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <input required type="text" placeholder="Full Name" value={formData.name} className="p-3 md:p-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base w-full" onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required type="email" placeholder="Email Address" disabled={editingId} value={formData.email} className={`p-3 md:p-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base w-full ${editingId ? 'bg-gray-200' : ''}`} onChange={e => setFormData({...formData, email: e.target.value})} />
            {!editingId && <input required type="password" placeholder="Secure Password" value={formData.password} className="p-3 md:p-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base w-full" onChange={e => setFormData({...formData, password: e.target.value})} />}
            <input type="text" placeholder="Phone Number" value={formData.phone} className="p-3 md:p-2 border rounded-lg outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base w-full" onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
            <button type="submit" className="w-full sm:w-auto bg-gray-900 text-white px-6 py-3 md:py-2 rounded-lg font-bold hover:bg-gray-800">{editingId ? 'Save Changes' : 'Authorize Account'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="w-full sm:w-auto bg-gray-300 text-gray-800 px-4 py-3 md:py-2 rounded-lg font-bold hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      )}

      {/* ✅ Responsive Table Wrapper */}
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left border-collapse min-w-[600px]">
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
                  <button onClick={() => handleEditClick(teacher)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"><Edit size={16} /></button>
                  <button onClick={() => handleToggleBlock(teacher._id)} className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg"><Ban size={16} /></button>
                  <button onClick={() => handleDelete(teacher._id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
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
    downloadFile(csv, 'Noticeboard_Audit_Logs.csv');
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2"><Bell size={18} /> Communications Audit</h2>
        
        {/* ✅ Responsive Button Stack */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button onClick={handleExport} className="flex-1 sm:flex-none justify-center p-2.5 md:p-2 border rounded-lg bg-white text-sm md:text-xs font-bold text-gray-700 flex items-center gap-1 shadow-sm"><Download size={16}/> Export</button>
          <button onClick={handleClear} className="flex-1 sm:flex-none justify-center p-2.5 md:p-2 border rounded-lg bg-red-50 text-sm md:text-xs font-bold text-red-600 flex items-center gap-1 shadow-sm"><Trash2 size={16}/> Clear</button>
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
        <select value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full sm:w-1/2 p-3 md:p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base bg-white">
          <option value="All Staff & Admin">To: All Faculty & Administrators</option>
          <option value="All Students">To: All Students</option>
        </select>
        
        <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">Message Content</label>
        <textarea value={newContent} onChange={e => setNewContent(e.target.value)} rows="5" className="w-full p-3 md:p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-gray-900 text-sm md:text-base resize-y" placeholder="Type your official announcement here..." required></textarea>
        
        <button type="submit" className="w-full sm:w-auto bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 shadow-md">Broadcast Message</button>
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

      {/* ✅ Responsive Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 border border-gray-100 p-4 rounded-xl my-6">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><Filter size={12}/> Standard filter</label>
          <select value={filterStd} onChange={e => setFilterStd(e.target.value)} className="w-full p-2.5 border rounded-lg bg-white text-sm font-medium outline-none">
            <option value="All">All Standards</option>
            {STANDARD_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><Filter size={12}/> Batch sorting</label>
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
              <div className="flex flex-col sm:flex-row justify-between border-b pb-2 mb-2 gap-2">
                <span className="font-bold text-purple-950 text-sm md:text-base">{log.subject} <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded ml-1 md:ml-2">{log.std} • {log.batch}</span></span>
                <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded flex items-center gap-1 w-fit"><Clock size={12}/> {new Date(log.date).toLocaleDateString()}</span>
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

/* ==========================================
   6. ATTENDANCE AUDIT TAB
   ========================================== */
const AdminAttendanceTab = () => {
  const [mode, setMode] = useState('student'); // 'student' or 'batch'
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Student Mode States
  const [studentId, setStudentId] = useState('');
  const [month, setMonth] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [reportData, setReportData] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);

  // Batch Mode States
  const [batchStd, setBatchStd] = useState('All');
  const [batchBatch, setBatchBatch] = useState('All');
  const [batchMonth, setBatchMonth] = useState(new Date().toISOString().split('T')[0].substring(0, 7)); // Default to current YYYY-MM
  const [batchData, setBatchData] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);

  // Load all students on mount
  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await api.get('/students');
        setStudents(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  // Fetch Student Report
  const handleFetchStudentReport = async () => {
    if (!studentId) return;
    setReportLoading(true);
    try {
      const res = await api.get(`/admin/attendance/student/${studentId}?month=${month || 'All'}`);
      let records = res.data.map(doc => {
        const studentRec = doc.records.find(r => {
          const sId = typeof r.studentId === 'object' ? r.studentId._id : r.studentId;
          return sId.toString() === studentId.toString();
        });
        return {
          date: doc.date,
          std: doc.std,
          batch: doc.batch,
          status: studentRec ? studentRec.status : 'N/A'
        };
      });

      if (startDate) {
        records = records.filter(r => r.date >= startDate);
      }
      if (endDate) {
        records = records.filter(r => r.date <= endDate);
      }

      setReportData(records);
    } catch (err) {
      alert("Failed to load student attendance");
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    if (mode === 'student' && studentId) {
      handleFetchStudentReport();
    }
  }, [studentId, month, startDate, endDate, mode]);

  // Fetch Batch Overview
  const handleFetchBatchOverview = async () => {
    if (!batchMonth) return alert("Please select a month.");
    setBatchLoading(true);
    try {
      const res = await api.get(`/teacher/attendance?std=${batchStd}&batch=${batchBatch}&month=${batchMonth}`);
      const docs = res.data || [];
      
      const targetStudents = students.filter(s => 
        (batchStd === 'All' || s.std === batchStd) &&
        (batchBatch === 'All' || s.batch === batchBatch)
      );

      const studentStats = {};
      targetStudents.forEach(s => {
        studentStats[s._id] = { name: s.name, std: s.std, batch: s.batch, present: 0, total: 0 };
      });

      docs.forEach(doc => {
        doc.records.forEach(r => {
          const sId = typeof r.studentId === 'object' ? r.studentId._id : r.studentId;
          if (sId && studentStats[sId]) {
            studentStats[sId].total += 1;
            if (r.status === 'Present') {
              studentStats[sId].present += 1;
            }
          }
        });
      });

      const list = Object.values(studentStats).map(stat => {
        const pct = stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : 0;
        return {
          ...stat,
          percentage: pct
        };
      });

      list.sort((a, b) => b.percentage - a.percentage);
      setBatchData(list);
    } catch (err) {
      alert("Failed to load batch overview");
    } finally {
      setBatchLoading(false);
    }
  };

  useEffect(() => {
    if (mode === 'batch' && batchMonth && students.length > 0) {
      handleFetchBatchOverview();
    }
  }, [batchStd, batchBatch, batchMonth, mode, students]);

  // Exports
  const handleExportStudentReport = () => {
    if (reportData.length === 0) return alert("No report data available to export.");
    const selectedStudent = students.find(s => s._id === studentId);
    const studentName = selectedStudent ? selectedStudent.name : "Student";
    
    let csv = "Date,Standard,Batch,Status\n";
    reportData.forEach(r => {
      csv += `"${r.date}","${r.std}","${r.batch}","${r.status}"\n`;
    });
    downloadFile(csv, `${studentName}_Attendance_Report.csv`);
  };

  const handleExportBatchOverview = () => {
    if (batchData.length === 0) return alert("No batch data to export.");
    let csv = "Student Name,Standard,Batch,Present Days,Total Days,Percentage\n";
    batchData.forEach(r => {
      csv += `"${r.name}","${r.std}","${r.batch}",${r.present},${r.total},"${r.percentage}%"\n`;
    });
    downloadFile(csv, `Batch_Attendance_Overview_${batchMonth}.csv`);
  };

  // Student mode stats
  const totalDays = reportData.length;
  const presentDays = reportData.filter(r => r.status === 'Present').length;
  const absentDays = reportData.filter(r => r.status === 'Absent').length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const monthlySummary = getMonthlySummary();

  function getMonthlySummary() {
    const months = {};
    reportData.forEach(r => {
      const monthKey = r.date.substring(0, 7);
      if (!months[monthKey]) {
        months[monthKey] = { present: 0, total: 0 };
      }
      months[monthKey].total += 1;
      if (r.status === 'Present') {
        months[monthKey].present += 1;
      }
    });

    const summaryList = Object.keys(months).map(mKey => {
      const [year, month] = mKey.split('-');
      const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
      const monthName = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });
      const stat = months[mKey];
      const percentage = stat.total > 0 ? Math.round((stat.present / stat.total) * 100) : 0;
      return {
        key: mKey,
        monthName,
        present: stat.present,
        total: stat.total,
        percentage
      };
    });

    summaryList.sort((a, b) => b.key.localeCompare(a.key));
    return summaryList;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><CheckSquare className="text-gray-900" /> Attendance Audit Panel</h2>
          <p className="text-xs text-gray-500 mt-0.5">Audit student attendance ledgers, monthly trends, and batch metrics.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto shrink-0">
          <button 
            onClick={() => setMode('student')} 
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'student' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Student Profile
          </button>
          <button 
            onClick={() => setMode('batch')} 
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${mode === 'batch' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Batch Overview
          </button>
        </div>
      </div>

      {mode === 'student' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Select Student</label>
              <select 
                value={studentId} 
                onChange={e => setStudentId(e.target.value)} 
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              >
                <option value="">-- Choose Student --</option>
                {students.map(s => (
                  <option key={s._id} value={s._id}>{s.name} ({s.std || 'N/A'} - {s.batch || 'N/A'})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Filter by Month</label>
              <input 
                type="month" 
                value={month} 
                onChange={e => setMonth(e.target.value)} 
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">From Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">To Date</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <label className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 mr-2">Status Filter:</label>
              <select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)} 
                className="p-2 border rounded-lg text-sm bg-white font-semibold text-purple-700"
              >
                <option value="All">All Records</option>
                <option value="Present">Present Only</option>
                <option value="Absent">Absent Only</option>
              </select>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={handleFetchStudentReport} 
                disabled={reportLoading}
                className="flex-1 sm:flex-none px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold text-sm shadow transition-colors"
              >
                {reportLoading ? 'Loading...' : 'Refresh'}
              </button>
              <button 
                onClick={handleExportStudentReport} 
                className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm shadow flex items-center justify-center gap-1 transition-colors"
              >
                <Download size={16}/> Export CSV
              </button>
            </div>
          </div>

          {/* Stats Dashboard */}
          {studentId && reportData.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl text-center shadow-sm">
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Total Days</p>
                <h3 className="text-xl md:text-2xl font-black text-purple-900 mt-1">{totalDays}</h3>
              </div>
              <div className="bg-green-50 border border-green-100 p-4 rounded-xl text-center shadow-sm">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Present</p>
                <h3 className="text-xl md:text-2xl font-black text-green-900 mt-1">{presentDays}</h3>
              </div>
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center shadow-sm">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Absent</p>
                <h3 className="text-xl md:text-2xl font-black text-red-900 mt-1">{absentDays}</h3>
              </div>
              <div className={`p-4 rounded-xl text-center border shadow-sm ${
                attendancePercentage >= 80 ? 'bg-emerald-50 border-emerald-100' :
                attendancePercentage >= 60 ? 'bg-amber-50 border-amber-100' :
                'bg-rose-50 border-rose-100'
              }`}>
                <p className={`text-xs font-semibold uppercase tracking-wider ${
                  attendancePercentage >= 80 ? 'text-emerald-600' :
                  attendancePercentage >= 60 ? 'text-amber-600' :
                  'text-rose-600'
                }`}>Percentage</p>
                <h3 className={`text-xl md:text-2xl font-black mt-1 ${
                  attendancePercentage >= 80 ? 'text-emerald-900' :
                  attendancePercentage >= 60 ? 'text-amber-900' :
                  'text-rose-900'
                }`}>{attendancePercentage}%</h3>
              </div>
            </div>
          )}

          {/* Month-wise Attendance Table */}
          {studentId && monthlySummary.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-900">Month-wise Attendance Summary</h3>
              <div className="w-full overflow-x-auto border rounded-xl bg-white shadow-sm">
                <table className="w-full text-left border-collapse min-w-[400px]">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-3 text-xs font-bold text-gray-700">Month</th>
                      <th className="p-3 text-xs font-bold text-gray-700 text-center">Present Days / Total Days</th>
                      <th className="p-3 text-xs font-bold text-gray-700 text-right">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlySummary.map(mSummary => (
                      <tr key={mSummary.key} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm font-bold text-gray-900">{mSummary.monthName}</td>
                        <td className="p-3 text-sm text-gray-600 text-center">{mSummary.present} / {mSummary.total}</td>
                        <td className="p-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            mSummary.percentage >= 80 ? 'bg-green-100 text-green-700' :
                            mSummary.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>{mSummary.percentage}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Detailed Ledger Table */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-900">Detailed Attendance Ledger</h3>
            <div className="w-full overflow-x-auto border rounded-xl bg-white shadow-sm">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-3 md:p-4 text-xs md:text-sm font-bold text-gray-700">Date</th>
                    <th className="p-3 md:p-4 text-xs md:text-sm font-bold text-gray-700">Standard / Batch</th>
                    <th className="p-3 md:p-4 text-xs md:text-sm font-bold text-gray-700 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {!studentId ? (
                    <tr>
                      <td colSpan="3" className="p-6 md:p-8 text-center text-sm text-gray-500 italic">Please select a student from the dropdown.</td>
                    </tr>
                  ) : reportData.filter(r => statusFilter === 'All' || r.status === statusFilter).length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-6 md:p-8 text-center text-sm text-gray-500 italic">No attendance records found matching filters.</td>
                    </tr>
                  ) : (
                    reportData
                      .filter(r => statusFilter === 'All' || r.status === statusFilter)
                      .map((record, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-3 md:p-4 text-sm font-bold text-gray-900">{record.date}</td>
                          <td className="p-3 md:p-4 text-xs md:text-sm text-gray-600">{record.std} • {record.batch}</td>
                          <td className="p-3 md:p-4 text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>{record.status}</span>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {mode === 'batch' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Standard</label>
              <select 
                value={batchStd} 
                onChange={e => setBatchStd(e.target.value)} 
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              >
                <option value="All">All Standards</option>
                {STANDARD_OPTIONS.map(std => <option key={std} value={std}>{std}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Batch</label>
              <select 
                value={batchBatch} 
                onChange={e => setBatchBatch(e.target.value)} 
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              >
                <option value="All">All Batches</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Select Month</label>
              <input 
                type="month" 
                value={batchMonth} 
                onChange={e => setBatchMonth(e.target.value)} 
                className="w-full p-2.5 border rounded-lg text-sm bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button 
              onClick={handleFetchBatchOverview} 
              disabled={batchLoading}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-bold text-sm shadow transition-colors"
            >
              {batchLoading ? 'Loading...' : 'Refresh'}
            </button>
            <button 
              onClick={handleExportBatchOverview} 
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm shadow flex items-center justify-center gap-1 transition-colors"
            >
              <Download size={16}/> Export CSV
            </button>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto border rounded-xl bg-white shadow-sm">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3 md:p-4 text-xs md:text-sm font-bold text-gray-700">Student Name</th>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-bold text-gray-700">Standard / Batch</th>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-bold text-gray-700 text-center">Present Days / Total Days</th>
                  <th className="p-3 md:p-4 text-xs md:text-sm font-bold text-gray-700 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {batchData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-6 md:p-8 text-center text-sm text-gray-500 italic">No students found or no attendance sheets recorded for this month.</td>
                  </tr>
                ) : (
                  batchData.map((record, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3 md:p-4 text-sm font-bold text-gray-900">{record.name}</td>
                      <td className="p-3 md:p-4 text-xs md:text-sm text-gray-600">{record.std} • {record.batch}</td>
                      <td className="p-3 md:p-4 text-sm text-gray-600 text-center">{record.present} / {record.total}</td>
                      <td className="p-3 md:p-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          record.percentage >= 80 ? 'bg-green-100 text-green-700' :
                          record.percentage >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>{record.percentage}%</span>
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

export default AdminPortal;