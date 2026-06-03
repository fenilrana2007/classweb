
// // export default StudentPortal;
// import html2pdf from 'html2pdf.js';
// import React, { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import api from '../services/api';
// // Added Menu and X icons for the mobile dropdown
// import { BookOpen, Bell, CheckCircle, Clock, FileText, Check, X, Filter, Menu ,IndianRupee, Printer,Image} from 'lucide-react';
// import GalleryTab from '../components/GalleryTab';
// const StudentPortal = () => {
//   const { user } = useContext(AuthContext);
//   const [activeTab, setActiveTab] = useState('noticeboard');
  
//   // NEW: State to handle the mobile menu toggle
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
//   const [dashboardData, setDashboardData] = useState({
//     messages: [],
//     attendance: [],
//     exams: [] 
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await api.get('/student/dashboard');
//         setDashboardData({
//           messages: res.data.messages || [],
//           attendance: res.data.attendance || [],
//           exams: res.data.exams || []
//         });
//       } catch (error) {
//         console.error("Failed to load student data", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     if (user && user.role === 'student') fetchData();
//   }, [user]);

//   if (!user || user.role !== 'student') {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="p-10 text-center text-red-600 font-bold bg-red-50 rounded-xl border border-red-200">
//           Access Denied. Students Only.
//         </div>
//       </div>
//     );
//   }

//   if (isLoading) return <div className="p-10 text-center mt-20 animate-pulse font-bold text-blue-600">Loading your workspace...</div>;

//   const totalClasses = dashboardData.attendance.length;
//   const presentClasses = dashboardData.attendance.filter(a => a.status === 'Present').length;
//   const attendancePercentage = totalClasses === 0 ? 100 : Math.round((presentClasses / totalClasses) * 100);

//   // Helper function to handle tab switching and closing the menu on mobile
//   const handleTabSwitch = (tabName) => {
//     setActiveTab(tabName);
//     setIsMobileMenuOpen(false); // Close menu after clicking
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      
//       {/* Student Header - Made responsive (p-5 on mobile, p-8 on desktop) */}
//       <div className="bg-blue-600 rounded-2xl p-5 md:p-8 text-white shadow-lg mb-6 md:mb-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Student Dashboard</h1>
//             <p className="text-blue-100 text-sm md:text-lg">Welcome back, {user.name}.</p>
//           </div>
//           <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-white/30 flex items-center gap-2">
//             <BookOpen size={16} className="md:w-5 md:h-5" />
//             <span className="font-bold uppercase tracking-wider text-xs md:text-sm">Std: {user.std || 'Student'}</span>
//           </div>
//         </div>
//       </div>

//       {/* --- MOBILE MENU TOGGLE BUTTON --- */}
//       <div className="md:hidden flex justify-between items-center mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
//         <span className="font-bold text-gray-700 flex items-center gap-2">
//           {activeTab === 'noticeboard' && <><Bell size={18}/> Noticeboard</>}
//           {activeTab === 'attendance' && <><CheckCircle size={18}/> My Attendance</>}
//           {/* {activeTab === 'exams' && <><FileText size={18}/> My Results</>}
          
//           {activeTab === 'gallery' && <GalleryTab isAdmin={false} />}}   */}
        
//           {activeTab === 'exams' && <><FileText size={18}/> My Results</>}
//           {activeTab === 'fees' && <><IndianRupee size={18}/> My Fees</>}
//           {activeTab === 'classlogs' && <><BookOpen size={18}/> Class Work & Docs</>}
//           {activeTab === 'gallery' && <><Image size={18}/> Gallery</>}
//         </span>
//         <button className="text-blue-600 focus:outline-none bg-blue-50 p-1 rounded">
//           {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//         </button>
//       </div>

//       {/* Navigation Tabs - Hidden on mobile unless menu is open */}
//       <div className={`${isMobileMenuOpen ? 'flex flex-col' : 'hidden'} md:flex md:flex-row flex-wrap gap-2 mb-6 md:mb-8 md:border-b md:border-gray-200 pb-2 md:pb-4 transition-all duration-300`}>
//         <TabButton active={activeTab === 'noticeboard'} onClick={() => handleTabSwitch('noticeboard')} icon={<Bell size={18} />} text="Noticeboard" />
//         <TabButton active={activeTab === 'attendance'} onClick={() => handleTabSwitch('attendance')} icon={<CheckCircle size={18} />} text="My Attendance" />
//         <TabButton active={activeTab === 'exams'} onClick={() => handleTabSwitch('exams')} icon={<FileText size={18} />} text="My Results" />
//         <TabButton active={activeTab === 'fees'} onClick={() => handleTabSwitch('fees')} icon={<IndianRupee size={18} />} text="My Fees" />
//         <TabButton active={activeTab === 'classlogs'} onClick={() => handleTabSwitch('classlogs')} icon={<BookOpen size={18} />} text="Class Work & Docs" />
//         <TabButton active={activeTab === 'gallery'} onClick={() => handleTabSwitch('gallery')} icon={<Image size={18} />} text="Gallery" />
//       </div>

//       {/* Tab Contents */}
//       {activeTab === 'noticeboard' && <NoticeboardTab messages={dashboardData.messages} />}
//       {activeTab === 'attendance' && <AttendanceTab attendance={dashboardData.attendance} percentage={attendancePercentage} />}
//       {activeTab === 'exams' && <ExamsTab exams={dashboardData.exams} />}
//       {/* {activeTab === 'fees' && <FeesTab fees={dashboardData.fees} />} */}
//       {activeTab === 'fees' && <MyFeesTab />}
//       {activeTab === 'classlogs' && <StudentClassLogsTab />}
//       {activeTab === 'gallery' && <GalleryTab isAdmin={false} />}
//     </div>
//   );
// };

// // Updated TabButton to be full-width on mobile (w-full md:w-auto)
// const TabButton = ({ active, onClick, icon, text }) => (
//   <button onClick={onClick} className={`w-full md:w-auto flex justify-start md:justify-center items-center gap-2 px-4 py-3 md:py-2 rounded-lg font-medium transition-colors ${active ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
//     {icon} {text}
//   </button>
// );

// /* ==========================================
//    1. NOTICEBOARD TAB 
//    ========================================== */
// const NoticeboardTab = ({ messages }) => (
//   <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
//     <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
//       <Bell className="text-blue-600" /> Recent Announcements
//     </h2>
//     <div className="space-y-4">
//       {messages.length === 0 ? (
//         <div className="p-8 text-center text-gray-500 bg-gray-50 border border-dashed rounded-xl">No new announcements from the faculty.</div>
//       ) : (
//         messages.map((msg) => (
//           <div key={msg._id} className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 md:p-5 hover:border-blue-300 transition-colors">
//             <div className="flex justify-between items-start mb-3 border-b border-blue-100 pb-3">
//               <div className="flex items-center gap-3">
//                 <div className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm shrink-0">
//                   {msg.sender?.name ? msg.sender.name.charAt(0).toUpperCase() : 'A'}
//                 </div>
//                 <div>
//                   <p className="font-bold text-sm md:text-base text-gray-900">{msg.sender?.name || 'Faculty'}</p>
//                   <p className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-wider">Announcement</p>
//                 </div>
//               </div>
//               <span className="text-[10px] md:text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1 shrink-0">
//                 <Clock size={12}/> {new Date(msg.createdAt).toLocaleDateString()}
//               </span>
//             </div>
//             <p className="text-sm md:text-base text-gray-800 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
//           </div>
//         ))
//       )}
//     </div>
//   </div>
// );

// /* ==========================================
//    2. ATTENDANCE TAB
//    ========================================== */
// const AttendanceTab = ({ attendance, percentage }) => (
//   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-fade-in">
//     <div className="col-span-1 space-y-6">
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 text-center">
//         <h3 className="text-gray-500 font-bold mb-4 text-sm md:text-base">Overall Attendance</h3>
//         <div className="relative inline-flex items-center justify-center">
//           <svg className="w-24 h-24 md:w-32 md:h-32 transform -rotate-90">
//             <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
//             {attendance.length > 0 && (
//                <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="283" strokeDashoffset={283 - (283 * percentage) / 100} className={percentage >= 75 ? "text-green-500 transition-all duration-1000" : "text-red-500 transition-all duration-1000"} />
//             )}
//           </svg>
//           <span className="absolute text-2xl md:text-3xl font-bold text-gray-900">{attendance.length === 0 ? 'N/A' : `${percentage}%`}</span>
//         </div>
//       </div>
//     </div>

//     <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
//       <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2"><CheckCircle className="text-blue-600" /> My Attendance History</h2>
//       <div className="overflow-x-auto border border-gray-100 rounded-xl">
//         <table className="w-full text-left border-collapse  `min-w-75`">
//           <thead><tr className="bg-gray-50 border-b border-gray-100"><th className="p-3 md:p-4 text-xs md:text-sm text-gray-500">Date</th><th className="p-3 md:p-4 text-xs md:text-sm text-gray-500">Status</th></tr></thead>
//           <tbody>
//             {attendance.length === 0 ? <tr><td colSpan="2" className="p-6 md:p-8 text-center text-sm text-gray-500">No records found.</td></tr> : 
//               attendance.map((record, index) => (
//                 <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
//                   <td className="p-3 md:p-4 text-sm font-bold text-gray-900">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
//                   <td className="p-3 md:p-4"><span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold ${record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{record.status}</span></td>
//                 </tr>
//               ))
//             }
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>
// );

// /* ==========================================
//    3. EXAMS & RESULTS TAB
//    ========================================== */
// const ExamsTab = ({ exams }) => {
//   const [filterStatus, setFilterStatus] = useState('All');
//   const [filterMonth, setFilterMonth] = useState('All');
//   const [sortDate, setSortDate] = useState('desc'); 

//   const availableMonths = [...new Set(exams.map(e => {
//     const d = new Date(e.examDate);
//     return `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
//   }))];

//   const processedExams = exams.filter(exam => {
//     const examMonthYear = `${new Date(exam.examDate).toLocaleString('default', { month: 'long' })} ${new Date(exam.examDate).getFullYear()}`;
//     const matchesStatus = filterStatus === 'All' || exam.status === filterStatus;
//     const matchesMonth = filterMonth === 'All' || examMonthYear === filterMonth;
//     return matchesStatus && matchesMonth;
//   }).sort((a, b) => {
//     return sortDate === 'desc' 
//       ? new Date(b.examDate) - new Date(a.examDate) 
//       : new Date(a.examDate) - new Date(b.examDate);
//   });

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
//       <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
//         <FileText className="text-blue-600" /> Academic Performance
//       </h2>

//       {/* FILTERING CONTROLS - Now stacks on mobile */}
//       <div className="flex flex-col md:flex-row gap-3 mb-6 bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
//         <div className="flex items-center gap-2 w-full md:w-auto">
//           <Filter size={18} className="text-gray-500 shrink-0" />
//           <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="p-2 border rounded outline-none bg-white font-medium shadow-sm w-full md:w-32 text-sm">
//             <option value="All">All Results</option>
//             <option value="Pass">Passed</option>
//             <option value="Fail">Failed</option>
//             <option value="Absent">Absent</option>
//           </select>
//         </div>

//         <div className="flex items-center gap-2 w-full md:w-auto md:ml-2">
//           <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="p-2 border rounded outline-none bg-white font-medium shadow-sm w-full md:w-40 text-sm">
//             <option value="All">All Months</option>
//             {availableMonths.map(month => <option key={month} value={month}>{month}</option>)}
//           </select>
//         </div>

//         <button onClick={() => setSortDate(sortDate === 'desc' ? 'asc' : 'desc')} className="p-2 border rounded bg-white font-medium shadow-sm w-full md:w-auto md:ml-auto hover:bg-gray-100 text-sm mt-2 md:mt-0">
//           {sortDate === 'desc' ? 'Sort: Newest First' : 'Sort: Oldest First'}
//         </button>
//       </div>

//       {/* EXAM LIST */}
//       <div className="space-y-4">
//         {processedExams.length === 0 ? (
//           <div className="p-6 md:p-8 text-center text-sm text-gray-500 bg-gray-50 border border-dashed rounded-xl">
//             No exams match your filters, or no marks have been recorded yet.
//           </div>
//         ) : (
//           processedExams.map((exam) => (
//             <div key={exam._id} className="border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
//               <div className="w-full md:w-auto border-b md:border-none border-gray-100 pb-3 md:pb-0">
//                 <h3 className="font-bold text-base md:text-lg text-gray-900 truncate">{exam.name}</h3>
//                 <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1.5 mt-1">
//                   <Clock size={12}/> {new Date(exam.examDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
//                 </p>
//               </div>

//               <div className="flex items-center gap-2 md:gap-6 bg-gray-50 p-2 md:p-3 rounded-lg border border-gray-100 w-full md:w-auto justify-between shrink-0">
//                 <div className="text-center flex-1 md:flex-none">
//                   <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Marks</p>
//                   <p className="font-bold text-lg md:text-xl text-gray-900">
//                     {exam.isAbsent ? 'AB' : exam.obtainedMarks} <span className="text-xs md:text-sm font-normal text-gray-500">/ {exam.maxMarks}</span>
//                   </p>
//                 </div>
                
//                 <div className="text-center border-l border-gray-200 pl-2 md:pl-6 flex-1 md:flex-none">
//                   <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Score</p>
//                   <p className="font-bold text-lg md:text-xl text-blue-600">{exam.percentage}%</p>
//                 </div>

//                 <div className="text-center border-l border-gray-200 pl-2 md:pl-6 flex-1 md:flex-none">
//                   <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Result</p>
//                   {exam.status === 'Pass' ? <span className="text-green-600 font-bold flex items-center justify-center gap-1 text-sm md:text-base"><Check size={14} className="hidden md:block"/> Pass</span> :
//                    exam.status === 'Fail' ? <span className="text-red-500 font-bold flex items-center justify-center gap-1 text-sm md:text-base"><X size={14} className="hidden md:block"/> Fail</span> :
//                    <span className="text-orange-500 font-bold flex items-center justify-center gap-1 text-sm md:text-base"><X size={14} className="hidden md:block"/> Absent</span>}
//                 </div>
//               </div>
              
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };  
// /* ==========================================
//    4. MY FEES TAB (With Official Receipts)
//    ========================================== */

// const MyFeesTab = () => {
//   const { user } = useContext(AuthContext); // Get student details for the receipt
//   const [feeData, setFeeData] = useState(null);

//   useEffect(() => {
//     const loadFees = async () => {
//       try {
//         const res = await api.get('/fees/my-status');
//         setFeeData(res.data);
//       } catch (err) { console.error(err); }
//     };
//     loadFees();
//   }, []);

//   // --- THE RECEIPT GENERATOR ---
// // --- THE RECEIPT GENERATOR (FULL STATEMENT) ---
//   const handleDownloadReceipt = () => {
//     if (!feeData || feeData.history.length === 0) return alert("No history to print.");

//     // Create table rows of ALL payments
//     const historyRows = feeData.history.map(p => `
//       <tr>
//         <td style="border: 1px solid #e5e7eb; padding: 8px;">${new Date(p.date).toLocaleDateString('en-US')}</td>
//         <td style="border: 1px solid #e5e7eb; padding: 8px;">${p.paymentMode} <span style="color:#6b7280; font-size:12px;">(By ${p.paidBy})</span></td>
//         <td style="border: 1px solid #e5e7eb; padding: 8px;">${p.receivedBy}</td>
//         <td style="border: 1px solid #e5e7eb; padding: 8px; font-weight: bold; color: #15803d;">₹${p.amountPaid.toLocaleString()}</td>
//       </tr>
//     `).join('');

//     const element = document.createElement('div');
//     element.innerHTML = `
//       <div style="font-family: Arial, sans-serif; padding: 40px; color: #111827; max-width: 800px; margin: 0 auto;">
//         <div style="text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
//           <h1 style="font-size: 32px; font-weight: 900; color: #1e3a8a; margin: 0; text-transform: uppercase;">Unique Coaching Class</h1>
//           <p style="font-size: 18px; color: #4b5563; margin-top: 5px; font-weight: bold;">OFFICIAL FEE STATEMENT</p>
//         </div>

//         <h3 style="color: #2563eb; text-transform: uppercase; margin-bottom: 10px; font-size: 14px;">Student Information</h3>
//         <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//           <tr>
//             <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; background: #f9fafb; width: 35%;">Student Name</th>
//             <td style="border: 1px solid #e5e7eb; padding: 10px;">${user.name}</td>
//           </tr>
//           <tr>
//             <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; background: #f9fafb;">Standard / Batch</th>
//             <td style="border: 1px solid #e5e7eb; padding: 10px;">${user.std || 'Verified Student'} - ${user.batch || 'Assigned Batch'}</td>
//           </tr>
//           <tr>
//             <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; background: #f9fafb;">Contact Info</th>
//             <td style="border: 1px solid #e5e7eb; padding: 10px;">${user.email} | ${user.phone || 'N/A'}</td>
//           </tr>
//         </table>

//         <h3 style="color: #2563eb; text-transform: uppercase; margin-bottom: 10px; font-size: 14px;">Payment History</h3>
//         <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
//           <tr style="background: #f9fafb;">
//             <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Date</th>
//             <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Details</th>
//             <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Processed By</th>
//             <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Amount</th>
//           </tr>
//           ${historyRows}
//         </table>

//         <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
//           <h3 style="color: #2563eb; text-transform: uppercase; margin-top: 0; margin-bottom: 15px; font-size: 14px;">Account Summary</h3>
//           <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;"><span>Total Yearly Fee:</span> <strong>₹${feeData.totalFee.toLocaleString()}</strong></div>
//           <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;"><span>Total Amount Paid (To Date):</span> <strong style="color: #15803d;">₹${feeData.totalPaid.toLocaleString()}</strong></div>
//           <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px dashed #cbd5e1; font-size: 18px; font-weight: bold; color: #b91c1c;"><span>Remaining Balance Due:</span> <span>₹${feeData.remainingDue.toLocaleString()}</span></div>
//         </div>

//         <div style="margin-top: 60px; display: flex; justify-content: space-between; font-size: 12px; color: #6b7280;">
//           <div>
//             <p>Thank you for your business.</p>
//             <p>*This is a computer-generated statement and does not require a physical signature.</p>
//           </div>
//         </div>
//       </div>
//     `;

//     const opt = {
//       margin:       0.5,
//       filename:     `${user.name.replace(/\s+/g, '_')}_Fee_Statement.pdf`,
//       image:        { type: 'jpeg', quality: 0.98 },
//       html2canvas:  { scale: 2 },
//       jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
//     };

//     html2pdf().set(opt).from(element).save();
//   };

//   if (!feeData) return <div className="p-8 text-center animate-pulse text-gray-500 font-bold">Loading fee details...</div>;

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
//       <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//         <IndianRupee className="text-green-600" /> Fee Status & History
//       </h2>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl text-center shadow-sm hover:shadow transition-shadow">
//           <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Yearly Fee</p>
//           <p className="text-2xl font-black text-gray-900 mt-2">₹{feeData.totalFee.toLocaleString()}</p>
//         </div>
//         <div className="bg-green-50 border border-green-200 p-5 rounded-xl text-center shadow-sm hover:shadow transition-shadow">
//           <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Total Paid</p>
//           <p className="text-2xl font-black text-green-700 mt-2">₹{feeData.totalPaid.toLocaleString()}</p>
//         </div>
//         <div className={`p-5 rounded-xl text-center shadow-sm hover:shadow transition-shadow border ${feeData.remainingDue > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
//           <p className={`text-xs font-bold uppercase tracking-wider ${feeData.remainingDue > 0 ? 'text-red-700' : 'text-gray-500'}`}>Remaining Balance</p>
//           <p className={`text-2xl font-black mt-2 ${feeData.remainingDue > 0 ? 'text-red-700' : 'text-gray-900'}`}>₹{feeData.remainingDue.toLocaleString()}</p>
//         </div>
//       </div>

//       {/* Receipt History Table */}
//       <h3 className="font-bold text-gray-900 mb-4 text-lg">Payment Receipts</h3>
//       <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
//         <table className="w-full text-left border-collapse `min-w-150`">
//           <thead>
//             <tr className="bg-gray-50 border-b border-gray-200">
//               <th className="p-4 text-sm text-gray-600">Date & Time</th>
//               <th className="p-4 text-sm text-gray-600">Amount Paid</th>
//               <th className="p-4 text-sm text-gray-600">Details</th>
//               <th className="p-4 text-sm text-gray-600 text-center">Receipt</th>
//             </tr>
//           </thead>
//           <tbody>
//             {feeData.history.length === 0 ? <tr><td colSpan="4" className="p-8 text-center text-gray-500 italic">No payments have been recorded yet.</td></tr> :
//               feeData.history.map(receipt => (
//                 <tr key={receipt._id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
//                   <td className="p-4">
//                     <p className="text-sm font-bold text-gray-900">{new Date(receipt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
//                     <p className="text-[10px] text-gray-500">{new Date(receipt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
//                   </td>
//                   <td className="p-4">
//                     <span className="text-lg font-black text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-100">
//                       ₹{receipt.amountPaid.toLocaleString()}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <p className="text-sm text-gray-800 font-medium">{receipt.paymentMode}</p>
//                     <p className="text-xs text-gray-500">Payer: <span className="font-bold">{receipt.paidBy}</span></p>
//                   </td>
//                   <td className="p-4 text-center">
//                     <button 
//                       onClick={() => handleDownloadReceipt(receipt)}
//                       className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-300 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
//                     >
//                       <Printer size={14} /> Print / PDF
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             }
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };
// /* ==========================================
//    5. STUDENT CLASS LOGS & MATERIAL TAB
//    ========================================== */
// import { Link as LinkIcon, BookOpen as BookIcon } from 'lucide-react'; // Ensure these are imported at the top of your file

// const StudentClassLogsTab = () => {
//   const [logs, setLogs] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchLogs = async () => {
//       try {
//         const res = await api.get('/student/class-logs');
//         setLogs(res.data);
//       } catch (err) { console.error(err); } finally { setIsLoading(false); }
//     };
//     fetchLogs();
//   }, []);

//   if (isLoading) return <div className="p-8 text-center animate-pulse text-gray-500 font-bold">Loading study materials...</div>;

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
//       <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//         <BookIcon className="text-blue-600" /> Daily Class Work & Materials
//       </h2>

//       <div className="space-y-4">
//         {logs.length === 0 ? (
//           <div className="p-8 text-center text-gray-500 bg-gray-50 border border-dashed rounded-xl">
//             <p className="font-bold">No class logs available yet.</p>
//             <p className="text-sm mt-1">When your teachers post daily updates or study materials, they will appear here.</p>
//           </div>
//         ) : (
//           logs.map(log => (
//             <div key={log._id} className="border border-gray-200 p-4 md:p-5 rounded-xl hover:shadow-md transition-shadow bg-white">
//               <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-100 pb-3 mb-3 gap-2">
//                 <span className="font-bold text-blue-800 text-base md:text-lg">
//                   {log.subject}
//                 </span>
//                 <span className="text-xs md:text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full w-fit">
//                   {new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
//                 </span>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
//                   <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Topic Taught</p>
//                   <p className="text-sm text-gray-800 whitespace-pre-wrap">{log.topicTaught}</p>
//                 </div>
                
//                 <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100">
//                   <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Homework Assigned</p>
//                   <p className="text-sm text-gray-800 whitespace-pre-wrap">{log.homework || <span className="text-gray-500 italic">No homework assigned today.</span>}</p>
//                 </div>
//               </div>
              
//               {log.attachmentLink && (
//                 <div className="mt-4 pt-4 border-t border-gray-100">
//                   <a 
//                     href={log.attachmentLink.startsWith('http') ? log.attachmentLink : `https://${log.attachmentLink}`} 
//                     target="_blank" 
//                     rel="noopener noreferrer" 
//                     className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm w-full md:w-auto"
//                   >
//                     <LinkIcon size={16}/> 
//                     Open Attached Study Material
//                   </a>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };
// export default StudentPortal;
import html2pdf from 'html2pdf.js';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { BookOpen, Bell, CheckCircle, Clock, FileText, Check, X, Filter, Menu, IndianRupee, Printer, Image } from 'lucide-react';
import GalleryTab from '../components/GalleryTab';
import { Link as LinkIcon, BookOpen as BookIcon } from 'lucide-react';

const StudentPortal = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('noticeboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [dashboardData, setDashboardData] = useState({
    messages: [],
    attendance: [],
    exams: [] 
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/student/dashboard');
        setDashboardData({
          messages: res.data.messages || [],
          attendance: res.data.attendance || [],
          exams: res.data.exams || []
        });
      } catch (error) {
        console.error("Failed to load student data", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user && user.role === 'student') fetchData();
  }, [user]);

  if (!user || user.role !== 'student') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-10 text-center text-red-600 font-bold bg-red-50 rounded-xl border border-red-200">
          Access Denied. Students Only.
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="p-10 text-center mt-20 animate-pulse font-bold text-blue-600">Loading your workspace...</div>;

  const totalClasses = dashboardData.attendance.length;
  const presentClasses = dashboardData.attendance.filter(a => a.status === 'Present').length;
  const attendancePercentage = totalClasses === 0 ? 100 : Math.round((presentClasses / totalClasses) * 100);

  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false); 
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      
      {/* Student Header */}
      <div className="bg-blue-600 rounded-2xl p-5 md:p-8 text-white shadow-lg mb-6 md:mb-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Student Dashboard</h1>
            <p className="text-blue-100 text-sm md:text-lg">Welcome back, {user.name}.</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-white/30 flex items-center gap-2">
            <BookOpen size={16} className="md:w-5 md:h-5" />
            <span className="font-bold uppercase tracking-wider text-xs md:text-sm">Std: {user.std || 'Student'}</span>
          </div>
        </div>
      </div>

      {/* MOBILE MENU TOGGLE BUTTON */}
      <div className="md:hidden flex justify-between items-center mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <span className="font-bold text-gray-700 flex items-center gap-2">
          {activeTab === 'noticeboard' && <><Bell size={18}/> Noticeboard</>}
          {activeTab === 'attendance' && <><CheckCircle size={18}/> My Attendance</>}
          {activeTab === 'exams' && <><FileText size={18}/> My Results</>}
          {activeTab === 'fees' && <><IndianRupee size={18}/> My Fees</>}
          {activeTab === 'classlogs' && <><BookOpen size={18}/> Class Work & Docs</>}
          {activeTab === 'gallery' && <><Image size={18}/> Gallery</>}
        </span>
        <button className="text-blue-600 focus:outline-none bg-blue-50 p-1 rounded">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className={`${isMobileMenuOpen ? 'flex flex-col' : 'hidden'} md:flex md:flex-row flex-wrap gap-2 mb-6 md:mb-8 md:border-b md:border-gray-200 pb-2 md:pb-4 transition-all duration-300`}>
        <TabButton active={activeTab === 'noticeboard'} onClick={() => handleTabSwitch('noticeboard')} icon={<Bell size={18} />} text="Noticeboard" />
        <TabButton active={activeTab === 'attendance'} onClick={() => handleTabSwitch('attendance')} icon={<CheckCircle size={18} />} text="My Attendance" />
        <TabButton active={activeTab === 'exams'} onClick={() => handleTabSwitch('exams')} icon={<FileText size={18} />} text="My Results" />
        <TabButton active={activeTab === 'fees'} onClick={() => handleTabSwitch('fees')} icon={<IndianRupee size={18} />} text="My Fees" />
        <TabButton active={activeTab === 'classlogs'} onClick={() => handleTabSwitch('classlogs')} icon={<BookOpen size={18} />} text="Class Work & Docs" />
        <TabButton active={activeTab === 'gallery'} onClick={() => handleTabSwitch('gallery')} icon={<Image size={18} />} text="Gallery" />
      </div>

      {/* Tab Contents */}
      {activeTab === 'noticeboard' && <NoticeboardTab messages={dashboardData.messages} />}
      {activeTab === 'attendance' && <AttendanceTab attendance={dashboardData.attendance} percentage={attendancePercentage} />}
      {activeTab === 'exams' && <ExamsTab exams={dashboardData.exams} />}
      {activeTab === 'fees' && <MyFeesTab />}
      {activeTab === 'classlogs' && <StudentClassLogsTab />}
      {activeTab === 'gallery' && <GalleryTab isAdmin={false} />}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, text }) => (
  <button onClick={onClick} className={`w-full md:w-auto flex justify-start md:justify-center items-center gap-2 px-4 py-3 md:py-2 rounded-lg font-medium transition-colors ${active ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
    {icon} {text}
  </button>
);

/* ==========================================
   1. NOTICEBOARD TAB 
   ========================================== */
const NoticeboardTab = ({ messages }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
      <Bell className="text-blue-600" /> Recent Announcements
    </h2>
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-gray-50 border border-dashed rounded-xl">No new announcements from the faculty.</div>
      ) : (
        messages.map((msg) => (
          <div key={msg._id} className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 md:p-5 hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-3 border-b border-blue-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm shrink-0">
                  {msg.sender?.name ? msg.sender.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <p className="font-bold text-sm md:text-base text-gray-900">{msg.sender?.name || 'Faculty'}</p>
                  <p className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-wider">Announcement</p>
                </div>
              </div>
              <span className="text-[10px] md:text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1 shrink-0">
                <Clock size={12}/> {new Date(msg.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm md:text-base text-gray-800 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
          </div>
        ))
      )}
    </div>
  </div>
);

/* ==========================================
   2. ATTENDANCE TAB
   ========================================== */
const AttendanceTab = ({ attendance, percentage }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 animate-fade-in">
    <div className="col-span-1 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 text-center">
        <h3 className="text-gray-500 font-bold mb-4 text-sm md:text-base">Overall Attendance</h3>
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-24 h-24 md:w-32 md:h-32 transform -rotate-90">
            <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
            {attendance.length > 0 && (
               <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="283" strokeDashoffset={283 - (283 * percentage) / 100} className={percentage >= 75 ? "text-green-500 transition-all duration-1000" : "text-red-500 transition-all duration-1000"} />
            )}
          </svg>
          <span className="absolute text-2xl md:text-3xl font-bold text-gray-900">{attendance.length === 0 ? 'N/A' : `${percentage}%`}</span>
        </div>
      </div>
    </div>

    <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2"><CheckCircle className="text-blue-600" /> My Attendance History</h2>
      
      {/* ✅ Responsive Table Wrapper */}
      <div className="w-full overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-left border-collapse min-w-[300px]">
          <thead><tr className="bg-gray-50 border-b border-gray-100"><th className="p-3 md:p-4 text-xs md:text-sm text-gray-500">Date</th><th className="p-3 md:p-4 text-xs md:text-sm text-gray-500">Status</th></tr></thead>
          <tbody>
            {attendance.length === 0 ? <tr><td colSpan="2" className="p-6 md:p-8 text-center text-sm text-gray-500">No records found.</td></tr> : 
              attendance.map((record, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                  <td className="p-3 md:p-4 text-sm font-bold text-gray-900">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className="p-3 md:p-4"><span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold ${record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{record.status}</span></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

/* ==========================================
   3. EXAMS & RESULTS TAB
   ========================================== */
const ExamsTab = ({ exams }) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterMonth, setFilterMonth] = useState('All');
  const [sortDate, setSortDate] = useState('desc'); 

  const availableMonths = [...new Set(exams.map(e => {
    const d = new Date(e.examDate);
    return `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
  }))];

  const processedExams = exams.filter(exam => {
    const examMonthYear = `${new Date(exam.examDate).toLocaleString('default', { month: 'long' })} ${new Date(exam.examDate).getFullYear()}`;
    const matchesStatus = filterStatus === 'All' || exam.status === filterStatus;
    const matchesMonth = filterMonth === 'All' || examMonthYear === filterMonth;
    return matchesStatus && matchesMonth;
  }).sort((a, b) => {
    return sortDate === 'desc' 
      ? new Date(b.examDate) - new Date(a.examDate) 
      : new Date(a.examDate) - new Date(b.examDate);
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
        <FileText className="text-blue-600" /> Academic Performance
      </h2>

      {/* ✅ Responsive Filters Row */}
      <div className="flex flex-col md:flex-row flex-wrap gap-3 mb-6 bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={18} className="text-gray-500 shrink-0" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="p-2 border rounded-lg outline-none bg-white font-medium shadow-sm w-full sm:w-40 text-sm">
            <option value="All">All Results</option>
            <option value="Pass">Passed</option>
            <option value="Fail">Failed</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="p-2 border rounded-lg outline-none bg-white font-medium shadow-sm w-full sm:w-48 text-sm">
            <option value="All">All Months</option>
            {availableMonths.map(month => <option key={month} value={month}>{month}</option>)}
          </select>
        </div>

        <button onClick={() => setSortDate(sortDate === 'desc' ? 'asc' : 'desc')} className="p-2 border rounded-lg bg-white font-bold shadow-sm w-full md:w-auto md:ml-auto hover:bg-gray-100 text-sm">
          {sortDate === 'desc' ? 'Sort: Newest First' : 'Sort: Oldest First'}
        </button>
      </div>

      <div className="space-y-4">
        {processedExams.length === 0 ? (
          <div className="p-6 md:p-8 text-center text-sm text-gray-500 bg-gray-50 border border-dashed rounded-xl">
            No exams match your filters, or no marks have been recorded yet.
          </div>
        ) : (
          processedExams.map((exam) => (
            <div key={exam._id} className="border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              <div className="w-full md:w-auto border-b md:border-none border-gray-100 pb-3 md:pb-0">
                {/* Truncate long exam names on mobile to avoid breaking containers */}
                <h3 className="font-bold text-base md:text-lg text-gray-900 truncate max-w-[250px] sm:max-w-full">{exam.name}</h3>
                <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                  <Clock size={12}/> {new Date(exam.examDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-6 bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-100 w-full md:w-auto justify-between shrink-0">
                <div className="text-center flex-1">
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Marks</p>
                  <p className="font-bold text-lg md:text-xl text-gray-900">
                    {exam.isAbsent ? 'AB' : exam.obtainedMarks} <span className="text-xs md:text-sm font-normal text-gray-500">/ {exam.maxMarks}</span>
                  </p>
                </div>
                
                <div className="text-center border-l border-gray-200 pl-2 sm:pl-6 flex-1">
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Score</p>
                  <p className="font-bold text-lg md:text-xl text-blue-600">{exam.percentage}%</p>
                </div>

                <div className="text-center border-l border-gray-200 pl-2 sm:pl-6 flex-1">
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Result</p>
                  {exam.status === 'Pass' ? <span className="text-green-600 font-bold flex items-center justify-center gap-1 text-sm md:text-base"><Check size={14} className="hidden sm:block"/> Pass</span> :
                   exam.status === 'Fail' ? <span className="text-red-500 font-bold flex items-center justify-center gap-1 text-sm md:text-base"><X size={14} className="hidden sm:block"/> Fail</span> :
                   <span className="text-orange-500 font-bold flex items-center justify-center gap-1 text-sm md:text-base"><X size={14} className="hidden sm:block"/> Absent</span>}
                </div>
              </div>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
};  

/* ==========================================
   4. MY FEES TAB
   ========================================== */
const MyFeesTab = () => {
  const { user } = useContext(AuthContext); 
  const [feeData, setFeeData] = useState(null);

  useEffect(() => {
    const loadFees = async () => {
      try {
        const res = await api.get('/fees/my-status');
        setFeeData(res.data);
      } catch (err) { console.error(err); }
    };
    loadFees();
  }, []);

  const handleDownloadReceipt = async () => {
    if (!feeData || feeData.history.length === 0) return alert("No history to print.");

    const historyRows = feeData.history.map(p => `
      <tr>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${new Date(p.date).toLocaleDateString('en-US')}</td>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${p.paymentMode} <span style="color:#6b7280; font-size:12px;">(By ${p.paidBy})</span></td>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${p.receivedBy}</td>
        <td style="border: 1px solid #e5e7eb; padding: 8px; font-weight: bold; color: #15803d;">₹${p.amountPaid.toLocaleString()}</td>
      </tr>
    `).join('');

    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px; color: #111827; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="font-size: 32px; font-weight: 900; color: #1e3a8a; margin: 0; text-transform: uppercase;">Unique Coaching Class</h1>
          <p style="font-size: 18px; color: #4b5563; margin-top: 5px; font-weight: bold;">OFFICIAL FEE STATEMENT</p>
        </div>

        <h3 style="color: #2563eb; text-transform: uppercase; margin-bottom: 10px; font-size: 14px;">Student Information</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; background: #f9fafb; width: 35%;">Student Name</th>
            <td style="border: 1px solid #e5e7eb; padding: 10px;">${user.name}</td>
          </tr>
          <tr>
            <th style="border: 1px solid #e5e7eb; padding: 10px; text-align: left; background: #f9fafb;">Standard / Batch</th>
            <td style="border: 1px solid #e5e7eb; padding: 10px;">${user.std || 'Verified Student'} - ${user.batch || 'Assigned Batch'}</td>
          </tr>
        </table>

        <h3 style="color: #2563eb; text-transform: uppercase; margin-bottom: 10px; font-size: 14px;">Payment History</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
          <tr style="background: #f9fafb;">
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Date</th>
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Details</th>
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Processed By</th>
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Amount</th>
          </tr>
          ${historyRows}
        </table>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h3 style="color: #2563eb; text-transform: uppercase; margin-top: 0; margin-bottom: 15px; font-size: 14px;">Account Summary</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;"><span>Total Yearly Fee:</span> <strong>₹${feeData.totalFee.toLocaleString()}</strong></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;"><span>Total Amount Paid (To Date):</span> <strong style="color: #15803d;">₹${feeData.totalPaid.toLocaleString()}</strong></div>
          <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px dashed #cbd5e1; font-size: 18px; font-weight: bold; color: #b91c1c;"><span>Remaining Balance Due:</span> <span>₹${feeData.remainingDue.toLocaleString()}</span></div>
        </div>
      </div>
    `;

    const opt = {
      margin:       0.5,
      filename:     `${user.name.replace(/\s+/g, '_')}_Fee_Statement.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    if (Capacitor.isNativePlatform()) {
      try {
        const pdfBase64 = await html2pdf().set(opt).from(element).outputPdf('datauristring');
        const base64Data = pdfBase64.split(',')[1];
        await Filesystem.writeFile({
          path: `${user.name.replace(/\s+/g, '_')}_Fee_Statement.pdf`,
          data: base64Data,
          directory: Directory.Documents
        });
        alert(`PDF saved to your phone's Documents folder!`);
      } catch (error) {
        alert("Failed to save PDF on mobile: " + error.message);
      }
    } else {
      html2pdf().set(opt).from(element).save();
    }
  };

  if (!feeData) return <div className="p-8 text-center animate-pulse text-gray-500 font-bold">Loading fee details...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <IndianRupee className="text-green-600" /> Fee Status & History
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl text-center shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Yearly Fee</p>
          <p className="text-2xl font-black text-gray-900 mt-2">₹{feeData.totalFee.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-5 rounded-xl text-center shadow-sm">
          <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Total Paid</p>
          <p className="text-2xl font-black text-green-700 mt-2">₹{feeData.totalPaid.toLocaleString()}</p>
        </div>
        <div className={`p-5 rounded-xl text-center shadow-sm border ${feeData.remainingDue > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
          <p className={`text-xs font-bold uppercase tracking-wider ${feeData.remainingDue > 0 ? 'text-red-700' : 'text-gray-500'}`}>Remaining Balance</p>
          <p className={`text-2xl font-black mt-2 ${feeData.remainingDue > 0 ? 'text-red-700' : 'text-gray-900'}`}>₹{feeData.remainingDue.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-lg">Payment Receipts</h3>
        <button 
          onClick={handleDownloadReceipt}
          className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 px-4 py-2 rounded-lg text-xs font-bold shadow-sm"
        >
          <Printer size={16} /> Print Full Statement
        </button>
      </div>
      
      {/* ✅ Responsive Table Wrapper */}
      <div className="w-full overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-sm text-gray-600">Date & Time</th>
              <th className="p-4 text-sm text-gray-600">Amount Paid</th>
              <th className="p-4 text-sm text-gray-600">Details</th>
            </tr>
          </thead>
          <tbody>
            {feeData.history.length === 0 ? <tr><td colSpan="3" className="p-8 text-center text-gray-500 italic">No payments have been recorded yet.</td></tr> :
              feeData.history.map(receipt => (
                <tr key={receipt._id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                  <td className="p-4">
                    <p className="text-sm font-bold text-gray-900">{new Date(receipt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    <p className="text-[10px] text-gray-500">{new Date(receipt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-lg font-black text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-100">
                      ₹{receipt.amountPaid.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-800 font-medium">{receipt.paymentMode}</p>
                    <p className="text-xs text-gray-500">Payer: <span className="font-bold">{receipt.paidBy}</span></p>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ==========================================
   5. STUDENT CLASS LOGS & MATERIAL TAB
   ========================================== */
const StudentClassLogsTab = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/student/class-logs');
        setLogs(res.data);
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchLogs();
  }, []);

  if (isLoading) return <div className="p-8 text-center animate-pulse text-gray-500 font-bold">Loading study materials...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <BookIcon className="text-blue-600" /> Daily Class Work & Materials
      </h2>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-gray-50 border border-dashed rounded-xl">
            <p className="font-bold">No class logs available yet.</p>
            <p className="text-sm mt-1">When your teachers post daily updates or study materials, they will appear here.</p>
          </div>
        ) : (
          logs.map(log => (
            <div key={log._id} className="border border-gray-200 p-4 md:p-5 rounded-xl hover:shadow-md transition-shadow bg-white">
              <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-100 pb-3 mb-3 gap-2">
                <span className="font-bold text-blue-800 text-base md:text-lg">
                  {log.subject}
                </span>
                <span className="text-xs md:text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full w-fit">
                  {new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Topic Taught</p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{log.topicTaught}</p>
                </div>
                
                <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Homework Assigned</p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{log.homework || <span className="text-gray-500 italic">No homework assigned today.</span>}</p>
                </div>
              </div>
              
              {log.attachmentLink && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a 
                    href={log.attachmentLink.startsWith('http') ? log.attachmentLink : `https://${log.attachmentLink}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 md:py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm w-full md:w-auto"
                  >
                    <LinkIcon size={16}/> 
                    Open Attached Study Material
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default StudentPortal;