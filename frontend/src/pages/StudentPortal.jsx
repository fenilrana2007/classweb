// src/pages/StudentPortal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { BookOpen, Bell, CheckCircle, Clock } from 'lucide-react';

const StudentPortal = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('noticeboard');
  
  // Strictly tied to database data only
  const [dashboardData, setDashboardData] = useState({
    messages: [],
    attendance: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/student/dashboard');
        // We ensure we only set what the database returns
        setDashboardData({
          messages: res.data.messages || [],
          attendance: res.data.attendance || []
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

  if (isLoading) {
    return <div className="p-10 text-center mt-20 animate-pulse font-bold text-blue-600">Loading your workspace...</div>;
  }

  // Consistent Database-driven Attendance Calculation
  const totalClasses = dashboardData.attendance.length;
  const presentClasses = dashboardData.attendance.filter(a => a.status === 'Present').length;
  
  // If no classes exist yet, default to 100%, otherwise calculate the real percentage
  const attendancePercentage = totalClasses === 0 ? 100 : Math.round((presentClasses / totalClasses) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Student Header (Blue Theme) */}
      <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-lg mb-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
            <p className="text-blue-100 text-lg">Welcome back, {user.name}. Here are your latest updates.</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30 flex items-center gap-2">
            <BookOpen size={18} />
            <span className="font-bold uppercase tracking-wider text-sm">Student</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Removed Schedule) */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
        <TabButton 
          active={activeTab === 'noticeboard'} 
          onClick={() => setActiveTab('noticeboard')} 
          icon={<Bell size={18} />} 
          text="Noticeboard" 
        />
        <TabButton 
          active={activeTab === 'attendance'} 
          onClick={() => setActiveTab('attendance')} 
          icon={<CheckCircle size={18} />} 
          text="My Attendance" 
        />
      </div>

      {/* Tab Contents */}
      {activeTab === 'noticeboard' && <NoticeboardTab messages={dashboardData.messages} />}
      {activeTab === 'attendance' && <AttendanceTab attendance={dashboardData.attendance} percentage={attendancePercentage} />}

    </div>
  );
};

const TabButton = ({ active, onClick, icon, text }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${active ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
    {icon} {text}
  </button>
);

/* ==========================================
   1. NOTICEBOARD TAB (Strictly Database Messages)
   ========================================== */
const NoticeboardTab = ({ messages }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <Bell className="text-blue-600" /> Recent Announcements
    </h2>
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-gray-50 border border-dashed rounded-xl">
          No new announcements from the faculty.
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg._id} className="bg-blue-50/50 rounded-xl border border-blue-100 p-5 hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-3 border-b border-blue-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm">
                  {msg.sender?.name ? msg.sender.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{msg.sender?.name || 'Faculty'}</p>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Announcement</p>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100 flex items-center gap-1">
                <Clock size={12}/> {new Date(msg.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
          </div>
        ))
      )}
    </div>
  </div>
);

/* ==========================================
   2. ATTENDANCE TAB (Strictly Database Records)
   ========================================== */
const AttendanceTab = ({ attendance, percentage }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
    
    {/* Stats Card */}
    <div className="col-span-1 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
        <h3 className="text-gray-500 font-bold mb-4">Overall Attendance</h3>
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
            {attendance.length > 0 && (
               <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="377" strokeDashoffset={377 - (377 * percentage) / 100} className={percentage >= 75 ? "text-green-500 transition-all duration-1000" : "text-red-500 transition-all duration-1000"} />
            )}
          </svg>
          <span className="absolute text-3xl font-bold text-gray-900">{attendance.length === 0 ? 'N/A' : `${percentage}%`}</span>
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">
          {attendance.length === 0 
            ? "No attendance records taken yet." 
            : percentage >= 75 
              ? "You are doing great! Keep it up." 
              : "Your attendance is low. Try not to miss classes!"}
        </p>
      </div>
    </div>

    {/* History List */}
    <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <CheckCircle className="text-blue-600" /> My Attendance History
      </h2>
      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100"><th className="p-4 text-sm text-gray-500">Date</th><th className="p-4 text-sm text-gray-500">Status</th></tr>
          </thead>
          <tbody>
            {attendance.length === 0 ? (
              <tr><td colSpan="2" className="p-8 text-center text-gray-500 bg-gray-50/50">No database records found yet.</td></tr>
            ) : (
              attendance.map((record, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                  <td className="p-4 font-bold text-gray-900">
                    {/* Reliable date formatting to prevent timezone inconsistencies */}
                    {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="p-4">
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

  </div>
);

export default StudentPortal;