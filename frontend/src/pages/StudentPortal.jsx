
// export default StudentPortal;
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
// Added Menu and X icons for the mobile dropdown
import { BookOpen, Bell, CheckCircle, Clock, FileText, Check, X, Filter, Menu ,IndianRupee, Printer} from 'lucide-react';

const StudentPortal = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('noticeboard');
  
  // NEW: State to handle the mobile menu toggle
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

  // Helper function to handle tab switching and closing the menu on mobile
  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false); // Close menu after clicking
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      
      {/* Student Header - Made responsive (p-5 on mobile, p-8 on desktop) */}
      <div className="bg-blue-600 rounded-2xl p-5 md:p-8 text-white shadow-lg mb-6 md:mb-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="flex justify-between items-center">
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

      {/* --- MOBILE MENU TOGGLE BUTTON --- */}
      <div className="md:hidden flex justify-between items-center mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <span className="font-bold text-gray-700 flex items-center gap-2">
          {activeTab === 'noticeboard' && <><Bell size={18}/> Noticeboard</>}
          {activeTab === 'attendance' && <><CheckCircle size={18}/> My Attendance</>}
          {activeTab === 'exams' && <><FileText size={18}/> My Results</>}
        </span>
        <button className="text-blue-600 focus:outline-none bg-blue-50 p-1 rounded">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation Tabs - Hidden on mobile unless menu is open */}
      <div className={`${isMobileMenuOpen ? 'flex flex-col' : 'hidden'} md:flex md:flex-row flex-wrap gap-2 mb-6 md:mb-8 md:border-b md:border-gray-200 pb-2 md:pb-4 transition-all duration-300`}>
        <TabButton active={activeTab === 'noticeboard'} onClick={() => handleTabSwitch('noticeboard')} icon={<Bell size={18} />} text="Noticeboard" />
        <TabButton active={activeTab === 'attendance'} onClick={() => handleTabSwitch('attendance')} icon={<CheckCircle size={18} />} text="My Attendance" />
        <TabButton active={activeTab === 'exams'} onClick={() => handleTabSwitch('exams')} icon={<FileText size={18} />} text="My Results" />
        <TabButton active={activeTab === 'fees'} onClick={() => handleTabSwitch('fees')} icon={<IndianRupee size={18} />} text="My Fees" />
      </div>

      {/* Tab Contents */}
      {activeTab === 'noticeboard' && <NoticeboardTab messages={dashboardData.messages} />}
      {activeTab === 'attendance' && <AttendanceTab attendance={dashboardData.attendance} percentage={attendancePercentage} />}
      {activeTab === 'exams' && <ExamsTab exams={dashboardData.exams} />}
      {activeTab === 'fees' && <FeesTab fees={dashboardData.fees} />}
    </div>
  );
};

// Updated TabButton to be full-width on mobile (w-full md:w-auto)
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
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-fade-in">
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

    <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2"><CheckCircle className="text-blue-600" /> My Attendance History</h2>
      <div className="overflow-x-auto border border-gray-100 rounded-xl">
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

      {/* FILTERING CONTROLS - Now stacks on mobile */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-gray-500 shrink-0" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="p-2 border rounded outline-none bg-white font-medium shadow-sm w-full md:w-32 text-sm">
            <option value="All">All Results</option>
            <option value="Pass">Passed</option>
            <option value="Fail">Failed</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto md:ml-2">
          <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="p-2 border rounded outline-none bg-white font-medium shadow-sm w-full md:w-40 text-sm">
            <option value="All">All Months</option>
            {availableMonths.map(month => <option key={month} value={month}>{month}</option>)}
          </select>
        </div>

        <button onClick={() => setSortDate(sortDate === 'desc' ? 'asc' : 'desc')} className="p-2 border rounded bg-white font-medium shadow-sm w-full md:w-auto md:ml-auto hover:bg-gray-100 text-sm mt-2 md:mt-0">
          {sortDate === 'desc' ? 'Sort: Newest First' : 'Sort: Oldest First'}
        </button>
      </div>

      {/* EXAM LIST */}
      <div className="space-y-4">
        {processedExams.length === 0 ? (
          <div className="p-6 md:p-8 text-center text-sm text-gray-500 bg-gray-50 border border-dashed rounded-xl">
            No exams match your filters, or no marks have been recorded yet.
          </div>
        ) : (
          processedExams.map((exam) => (
            <div key={exam._id} className="border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              <div className="w-full md:w-auto border-b md:border-none border-gray-100 pb-3 md:pb-0">
                <h3 className="font-bold text-base md:text-lg text-gray-900 truncate">{exam.name}</h3>
                <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                  <Clock size={12}/> {new Date(exam.examDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-2 md:gap-6 bg-gray-50 p-2 md:p-3 rounded-lg border border-gray-100 w-full md:w-auto justify-between shrink-0">
                <div className="text-center flex-1 md:flex-none">
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Marks</p>
                  <p className="font-bold text-lg md:text-xl text-gray-900">
                    {exam.isAbsent ? 'AB' : exam.obtainedMarks} <span className="text-xs md:text-sm font-normal text-gray-500">/ {exam.maxMarks}</span>
                  </p>
                </div>
                
                <div className="text-center border-l border-gray-200 pl-2 md:pl-6 flex-1 md:flex-none">
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Score</p>
                  <p className="font-bold text-lg md:text-xl text-blue-600">{exam.percentage}%</p>
                </div>

                <div className="text-center border-l border-gray-200 pl-2 md:pl-6 flex-1 md:flex-none">
                  <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Result</p>
                  {exam.status === 'Pass' ? <span className="text-green-600 font-bold flex items-center justify-center gap-1 text-sm md:text-base"><Check size={14} className="hidden md:block"/> Pass</span> :
                   exam.status === 'Fail' ? <span className="text-red-500 font-bold flex items-center justify-center gap-1 text-sm md:text-base"><X size={14} className="hidden md:block"/> Fail</span> :
                   <span className="text-orange-500 font-bold flex items-center justify-center gap-1 text-sm md:text-base"><X size={14} className="hidden md:block"/> Absent</span>}
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
   4. MY FEES TAB (With Official Receipts)
   ========================================== */

const MyFeesTab = () => {
  const { user } = useContext(AuthContext); // Get student details for the receipt
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

  // --- THE RECEIPT GENERATOR ---
  const handleDownloadReceipt = (receipt) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    // Calculate the date beautifully
    const paymentDate = new Date(receipt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const paymentTime = new Date(receipt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Official Receipt HTML Layout
    const receiptHTML = `
      <html>
        <head>
          <title>Fee Receipt - ${user.name}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #111827; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .institute-name { font-size: 32px; font-weight: 900; color: #1e3a8a; margin: 0; text-transform: uppercase; letter-spacing: 1px; }
            .receipt-title { font-size: 18px; color: #4b5563; margin-top: 5px; font-weight: bold; letter-spacing: 2px; }
            .date-box { text-align: right; margin-bottom: 20px; font-size: 14px; color: #6b7280; }
            
            .section-title { font-size: 14px; text-transform: uppercase; font-weight: bold; color: #2563eb; margin-bottom: 10px; margin-top: 30px;}
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; font-size: 14px; }
            th { background-color: #f9fafb; font-weight: bold; width: 35%; color: #4b5563; }
            td { font-weight: 500; }
            
            .amount-row th, .amount-row td { font-size: 16px; color: #15803d; background-color: #f0fdf4; }
            
            .summary-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-top: 30px; }
            .summary-flex { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
            .summary-total { display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px dashed #cbd5e1; font-size: 18px; font-weight: bold; color: #b91c1c; }
            
            .footer { margin-top: 60px; display: flex; justify-content: space-between; font-size: 14px; color: #4b5563; }
            .signature { text-align: center; }
            .signature-line { width: 200px; border-bottom: 1px solid #111827; margin-bottom: 5px; }
          </style>
        </head>
        <body>
          
          <div class="header">
            <h1 class="institute-name">Unique Coaching Class</h1>
            <p class="receipt-title">OFFICIAL FEE RECEIPT</p>
          </div>

          <div class="date-box">
            <strong>Receipt ID:</strong> RCPT-${receipt._id.substring(18, 24).toUpperCase()}<br>
            <strong>Date:</strong> ${paymentDate}<br>
            <strong>Time:</strong> ${paymentTime}
          </div>

          <div class="section-title">Student Information</div>
          <table>
            <tr><th>Student Name</th><td>${user.name}</td></tr>
            <tr><th>Standard / Batch</th><td>${user.std || 'N/A'}</td></tr>
            <tr><th>Email Address</th><td>${user.email}</td></tr>
            <tr><th>Phone Number</th><td>${user.phone || 'N/A'}</td></tr>
          </table>

          <div class="section-title">Transaction Details</div>
          <table>
            <tr><th>Paid By (Payer Name)</th><td>${receipt.paidBy}</td></tr>
            <tr><th>Payment Mode</th><td>${receipt.paymentMode}</td></tr>
            <tr><th>Processed By (Staff)</th><td>${receipt.receivedBy}</td></tr>
            <tr class="amount-row"><th>Amount Paid Now</th><td>₹${receipt.amountPaid.toLocaleString()}</td></tr>
          </table>

          <div class="summary-box">
            <div class="section-title" style="margin-top: 0;">Account Summary</div>
            <div class="summary-flex"><span>Total Yearly Fee:</span> <strong>₹${feeData.totalFee.toLocaleString()}</strong></div>
            <div class="summary-flex"><span>Total Amount Paid (To Date):</span> <strong style="color: #15803d;">₹${feeData.totalPaid.toLocaleString()}</strong></div>
            <div class="summary-total"><span>Remaining Balance Due:</span> <span>₹${feeData.remainingDue.toLocaleString()}</span></div>
          </div>

          <div class="footer">
            <div>
              <p>Thank you for your payment.</p>
              <p style="font-size: 12px; color: #9ca3af;">*This is a computer-generated receipt.</p>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              Authorized Signatory<br>
              <strong>${receipt.receivedBy}</strong>
            </div>
          </div>

        </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    
    // Add a slight delay to ensure CSS renders before the print dialog opens
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  };

  if (!feeData) return <div className="p-8 text-center animate-pulse text-gray-500 font-bold">Loading fee details...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <IndianRupee className="text-green-600" /> Fee Status & History
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl text-center shadow-sm hover:shadow transition-shadow">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Yearly Fee</p>
          <p className="text-2xl font-black text-gray-900 mt-2">₹{feeData.totalFee.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-5 rounded-xl text-center shadow-sm hover:shadow transition-shadow">
          <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Total Paid</p>
          <p className="text-2xl font-black text-green-700 mt-2">₹{feeData.totalPaid.toLocaleString()}</p>
        </div>
        <div className={`p-5 rounded-xl text-center shadow-sm hover:shadow transition-shadow border ${feeData.remainingDue > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
          <p className={`text-xs font-bold uppercase tracking-wider ${feeData.remainingDue > 0 ? 'text-red-700' : 'text-gray-500'}`}>Remaining Balance</p>
          <p className={`text-2xl font-black mt-2 ${feeData.remainingDue > 0 ? 'text-red-700' : 'text-gray-900'}`}>₹{feeData.remainingDue.toLocaleString()}</p>
        </div>
      </div>

      {/* Receipt History Table */}
      <h3 className="font-bold text-gray-900 mb-4 text-lg">Payment Receipts</h3>
      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="p-4 text-sm text-gray-600">Date & Time</th>
              <th className="p-4 text-sm text-gray-600">Amount Paid</th>
              <th className="p-4 text-sm text-gray-600">Details</th>
              <th className="p-4 text-sm text-gray-600 text-center">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {feeData.history.length === 0 ? <tr><td colSpan="4" className="p-8 text-center text-gray-500 italic">No payments have been recorded yet.</td></tr> :
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
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDownloadReceipt(receipt)}
                      className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-300 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      <Printer size={14} /> Print / PDF
                    </button>
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
export default StudentPortal;