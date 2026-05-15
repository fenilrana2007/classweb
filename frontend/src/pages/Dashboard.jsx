// src/pages/Dashboard.jsx
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  BookOpen, Calendar, Clock, Award, ChevronRight, PlayCircle, 
  Users, LayoutDashboard, ShieldCheck, UserPlus, Ban, Edit, 
  Trash2, MessageSquare, CheckSquare, XSquare, Send
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="animate-pulse">Loading dashboard...</p></div>;

  const getHeaderColor = () => {
    if (user.role === 'admin') return 'bg-gray-900';
    if (user.role === 'teacher') return 'bg-purple-700';
    return 'bg-indigo-600';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dynamic Welcome Banner */}
      <div className={`${getHeaderColor()} rounded-2xl p-8 text-white shadow-lg mb-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
            <p className="text-white/80 text-lg">
              {user.role === 'student' && "Ready to continue your learning journey today?"}
              {user.role === 'teacher' && "Manage your students, attendance, and batches efficiently."}
              {user.role === 'admin' && "Here is the overview of your institute today."}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30 flex items-center gap-2 shadow-sm">
            {user.role === 'admin' && <ShieldCheck size={18} />}
            {user.role === 'teacher' && <BookOpen size={18} />}
            {user.role === 'student' && <Award size={18} />}
            <span className="font-bold text-white uppercase tracking-wider text-sm">{user.role}</span>
          </div>
        </div>
      </div>

      {user.role === 'admin' && <AdminView />}
      {user.role === 'teacher' && <TeacherView />}
      {user.role === 'student' && <StudentView />}
    </div>
  );
};

/* =========================================
   TEACHER VIEW (With Tabs for CRUD, Attendance, Messages)
   ========================================= */
const TeacherView = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div>
      {/* Teacher Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={18} />} text="Overview" />
        <TabButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={<Users size={18} />} text="Manage Students" />
        <TabButton active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} icon={<CheckSquare size={18} />} text="Attendance" />
        <TabButton active={activeTab === 'messages'} onClick={() => setActiveTab('messages')} icon={<MessageSquare size={18} />} text="Messages" />
      </div>

      {activeTab === 'overview' && <TeacherOverview />}
      {activeTab === 'students' && <TeacherManageStudents />}
      {activeTab === 'attendance' && <TeacherAttendance />}
      {activeTab === 'messages' && <TeacherMessages />}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, text }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${active ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
  >
    {icon} {text}
  </button>
);

// --- 1. Teacher Overview Tab ---
const TeacherOverview = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard icon={<LayoutDashboard size={24} />} title="My Batches" value="4" color="bg-purple-50 text-purple-600" />
      <StatCard icon={<Users size={24} />} title="Total Students" value="180" color="bg-blue-50 text-blue-600" />
      <StatCard icon={<Calendar size={24} />} title="Classes Today" value="2" color="bg-green-50 text-green-600" />
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">My Upcoming Classes Today</h2>
      <div className="p-4 border border-gray-100 rounded-lg flex justify-between items-center bg-gray-50">
        <div><h3 className="font-bold">10th Std Math (Morning Batch)</h3><p className="text-sm text-gray-500">10:00 AM - 11:30 AM</p></div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold">Start Class</button>
      </div>
    </div>
  </>
);

// --- 2. Teacher Manage Students Tab (CRUD) ---
const TeacherManageStudents = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  // Add your form state here to capture the data
  const [formData, setFormData] = useState({ std: '' }); 

  // 1. ADD THIS ARRAY:
  const standardOptions = [
    "1st Std", "2nd Std", "3rd Std", "4th Std", "5th Std", 
    "6th Std", "7th Std", "8th Std", "9th Std", "10th Std", 
    "11th Commerce", "12th Commerce"
  ];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Student Directory</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold">
          <UserPlus size={16} /> {showAddForm ? 'Cancel' : 'Add Student'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8 p-6 bg-purple-50 rounded-xl border border-purple-100">
          <h3 className="font-bold mb-4">Add New Student</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input type="text" placeholder="Full Name" className="p-2 rounded border w-full" />
            <input type="text" placeholder="Phone Number" className="p-2 rounded border w-full" />
            <input type="password" placeholder="Temporary Password" className="p-2 rounded border w-full" />
              {/* 2. REPLACE THIS WITH THE NEW SELECT */}
              <select 
                  className="p-2 rounded border w-full bg-white text-gray-700"
                  onChange={(e) => setFormData({...formData, std: e.target.value})}
              >
              <option value="">Select Standard</option>
              {standardOptions.map((std, index) => (
              <option key={index} value={std}>
              {std}
              </option>
            ))}
              </select>
            <select className="p-2 rounded border w-full"><option>Select Batch</option><option>Morning</option><option>Evening</option></select>
            <input type="text" placeholder="Blood Group (e.g. O+)" className="p-2 rounded border w-full" />
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">Save Student</button>
        </div>
      )}

      {/* Student Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Std & Batch</th>
              <th className="p-3">Phone</th>
              <th className="p-3">B.Group</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Dummy Student Row */}
            <tr className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium">Rahul Sharma</td>
              <td className="p-3 text-sm">10th • Morning</td>
              <td className="p-3 text-sm">+91 9876543210</td>
              <td className="p-3 text-sm text-red-500 font-bold">B+</td>
              <td className="p-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Active</span></td>
              <td className="p-3 flex gap-2">
                <button title="Edit" className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                <button title="Block" className="p-1 text-orange-600 hover:bg-orange-50 rounded"><Ban size={16} /></button>
                <button title="Delete" className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 3. Teacher Attendance Tab (Two-Way System) ---
const TeacherAttendance = () => {
  const [attendanceMode, setAttendanceMode] = useState('markPresent'); // 'markPresent' or 'markAbsent'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Daily Attendance</h2>
      
      {/* Filters & Mode Toggle */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200 justify-between items-center">
        <div className="flex gap-4 w-full md:w-auto">
          <select className="p-2 border rounded-lg bg-white w-full"><option>Filter: 10th Std</option></select>
          <select className="p-2 border rounded-lg bg-white w-full"><option>Filter: Morning Batch</option></select>
        </div>
        
        {/* The clever Reverse Toggle you asked for */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border">
          <button 
            onClick={() => setAttendanceMode('markPresent')} 
            className={`px-3 py-1 rounded-md text-sm font-bold ${attendanceMode === 'markPresent' ? 'bg-green-500 text-white' : 'text-gray-500'}`}
          >
            Mark Presents
          </button>
          <button 
            onClick={() => setAttendanceMode('markAbsent')} 
            className={`px-3 py-1 rounded-md text-sm font-bold ${attendanceMode === 'markAbsent' ? 'bg-red-500 text-white' : 'text-gray-500'}`}
          >
            Mark Absentees
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {attendanceMode === 'markPresent' 
          ? "Check the boxes for students who are PRESENT. Unchecked will be marked Absent."
          : "Check the boxes for students who are ABSENT. Unchecked will be marked Present."}
      </p>

      {/* Attendance List */}
      <div className="space-y-2 mb-6">
        <label className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <input type="checkbox" className="w-5 h-5 accent-purple-600" />
          <div className="flex-1">
            <p className="font-bold">Rahul Sharma</p>
            <p className="text-xs text-gray-500">10th • Morning</p>
          </div>
        </label>
        <label className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
          <input type="checkbox" className="w-5 h-5 accent-purple-600" />
          <div className="flex-1">
            <p className="font-bold">Priya Patel</p>
            <p className="text-xs text-gray-500">10th • Morning</p>
          </div>
        </label>
      </div>

      <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700">
        Submit Attendance Records
      </button>
    </div>
  );
};

// --- 4. Teacher Messages Tab ---
const TeacherMessages = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <Send size={24} className="text-purple-600" /> Send Communication
    </h2>
    
    <div className="space-y-4 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
        <select className="w-full p-3 border border-gray-300 rounded-lg">
          <option>Admin / Management</option>
          <option>Entire Morning Batch (10th)</option>
          <option>Specific Student...</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea rows="5" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Write your announcement or issue here..."></textarea>
      </div>
      <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-purple-700">
        <Send size={18} /> Send Message
      </button>
    </div>
  </div>
);

/* =========================================
   STUDENT & ADMIN VIEWS (Kept standard)
   ========================================= */
const StudentView = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard icon={<BookOpen size={24} />} title="Enrolled Courses" value="3" color="bg-blue-50 text-blue-600" />
      <StatCard icon={<Clock size={24} />} title="Hours Learned" value="12.5" color="bg-green-50 text-green-600" />
      <StatCard icon={<Calendar size={24} />} title="Upcoming Classes" value="2" color="bg-purple-50 text-purple-600" />
      <StatCard icon={<Award size={24} />} title="Certificates" value="1" color="bg-yellow-50 text-yellow-600" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Continue Learning</h2>
        <div className="space-y-4">
          <CourseCard title="Advanced Math" module="Chapter 4: Trigonometry" progress="60%" color="indigo" />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Schedule</h2>
        <div className="space-y-6">
          <ScheduleItem time="10:00 AM" title="Live Math Session" type="Live Class" color="border-red-500" />
        </div>
      </div>
    </div>
  </>
);

const AdminView = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard icon={<Users size={24} />} title="Total Students" value="1,248" color="bg-blue-50 text-blue-600" />
      <StatCard icon={<LayoutDashboard size={24} />} title="Active Batches" value="12" color="bg-green-50 text-green-600" />
      <StatCard icon={<Calendar size={24} />} title="Today's Classes" value="8" color="bg-purple-50 text-purple-600" />
      <StatCard icon={<Users size={24} />} title="Total Teachers" value="15" color="bg-yellow-50 text-yellow-600" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/manage-schedule" className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-indigo-500 hover:shadow-md transition-all group">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Calendar size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Add Schedule</p>
              <p className="text-xs text-gray-500">Create new live class</p>
            </div>
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
        <div className="space-y-6">
          <ScheduleItem time="10:00 AM" title="React Batch A - Live" type="Live Class" color="border-red-500" />
        </div>
      </div>
    </div>
  </>
);

/* --- Reusable Mini Components --- */
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`p-4 rounded-xl ${color}`}>{icon}</div>
    <div><p className="text-sm text-gray-500 font-medium mb-1">{title}</p><p className="text-2xl font-bold text-gray-900">{value}</p></div>
  </div>
);

const ScheduleItem = ({ time, title, type, color }) => (
  <div className={`flex items-start gap-4 border-l-4 ${color} pl-4`}>
    <div className="flex-1">
      <p className="text-sm font-bold text-gray-900">{title}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{type}</span>
        <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> {time}</span>
      </div>
    </div>
  </div>
);

const CourseCard = ({ title, module, progress, color }) => (
  <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all group cursor-pointer">
    <div className="flex items-center gap-4 w-full">
      <div className={`h-16 w-16 bg-${color}-50 rounded-lg flex items-center justify-center text-${color}-600 shrink-0`}><PlayCircle size={32} /></div>
      <div className="flex-1">
        <h3 className={`font-bold text-gray-900 group-hover:text-${color}-600 transition-colors`}>{title}</h3>
        <p className="text-sm text-gray-500 mb-2">{module}</p>
        <div className="w-full bg-gray-100 rounded-full h-2"><div className={`bg-${color}-600 h-2 rounded-full`} style={{ width: progress }}></div></div>
      </div>
    </div>
    <div className={`ml-4 h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-${color}-100 transition-colors`}>
      <ChevronRight className={`text-gray-400 group-hover:text-${color}-600`} />
    </div>
  </div>
);

export default Dashboard;