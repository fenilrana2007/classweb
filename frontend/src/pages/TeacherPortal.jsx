

// export default TeacherPortal;
// src/pages/TeacherPortal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  BookOpen, LayoutDashboard, CheckSquare, MessageSquare, 
  Send, Bell, Clock, GraduationCap, FileText, Menu, X,IndianRupee,Printer 
} from 'lucide-react';
import StudentsTab from '../components/StudentsTab'; 
import ExamsTab from '../components/ExamsTab';
import FeesTab from '../components/FeesTab';
const standardOptions = [
  "1st Std", "2nd Std", "3rd Std", "4th Std", "5th Std", "6th Std", 
  "7th Std", "8th Std", "9th Std", "10th Std", "11th Commerce", "12th Commerce"
];

const TeacherPortal = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  
  // NEW: State to handle the mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Master State
  const [stats, setStats] = useState({ batches: 0, totalStudents: 0, classesToday: 0 });
  const [students, setStudents] = useState([]); 
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, studentsRes, msgsRes] = await Promise.all([
          api.get('/teacher/stats'),
          api.get('/teacher/students'),
          api.get('/teacher/messages')
        ]);
        setStats(statsRes.data);
        setStudents(studentsRes.data);
        setMessages(msgsRes.data);
      } catch (error) {
        console.error("Failed to load teacher data");
      } finally {
        setIsLoading(false);
      }
    };
    if (user && user.role === 'teacher') fetchData();
  }, [user]);

  if (!user || user.role !== 'teacher') return <div className="p-10 text-center text-red-600 font-bold mt-20">Access Denied. Faculty Only.</div>;
  if (isLoading) return <div className="p-10 text-center mt-20 animate-pulse font-bold text-purple-600">Loading Portal Data...</div>;

  // Helper function to handle tab switching and closing the menu on mobile
  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      
      {/* Header - Made responsive */}
      <div className="bg-purple-700 rounded-2xl p-5 md:p-8 text-white shadow-lg mb-6 md:mb-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Faculty Portal</h1>
            <p className="text-purple-100 text-sm md:text-lg">Welcome back, {user.name}.</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-white/30 flex items-center gap-2">
            <BookOpen size={16} className="md:w-5 md:h-5" />
            <span className="font-bold uppercase tracking-wider text-xs md:text-sm">Teacher</span>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU TOGGLE BUTTON --- */}
      <div className="md:hidden flex justify-between items-center mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <span className="font-bold text-gray-700 flex items-center gap-2">
          {activeTab === 'overview' && <><LayoutDashboard size={18}/> Noticeboard</>}
          {activeTab === 'students' && <><GraduationCap size={18}/> Manage Students</>}
          {activeTab === 'attendance' && <><CheckSquare size={18}/> Attendance</>}
          {activeTab === 'messages' && <><MessageSquare size={18}/> Broadcast</>}
          {activeTab === 'exams' && <><FileText size={18}/> Examinations</>}
          {activeTab === 'fees' && <><IndianRupee size={18} /> Fee Management</>}
        </span>
        <button className="text-purple-600 focus:outline-none bg-purple-50 p-1 rounded">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Tabs - Hidden on mobile unless menu is open */}
      <div className={`${isMobileMenuOpen ? 'flex flex-col' : 'hidden'} md:flex md:flex-row flex-wrap gap-2 mb-6 md:mb-8 md:border-b md:border-gray-200 pb-2 md:pb-4 transition-all duration-300`}>
        <TabButton active={activeTab === 'overview'} onClick={() => handleTabSwitch('overview')} icon={<LayoutDashboard size={18} />} text="Noticeboard" />
        <TabButton active={activeTab === 'students'} onClick={() => handleTabSwitch('students')} icon={<GraduationCap size={18} />} text="Manage Students" />
        <TabButton active={activeTab === 'attendance'} onClick={() => handleTabSwitch('attendance')} icon={<CheckSquare size={18} />} text="Attendance" />
        <TabButton active={activeTab === 'messages'} onClick={() => handleTabSwitch('messages')} icon={<MessageSquare size={18} />} text="Broadcast" />
        <TabButton active={activeTab === 'exams'} onClick={() => handleTabSwitch('exams')} icon={<FileText size={18} />} text="Examinations" />
        <TabButton active={activeTab === 'fees'} onClick={() => handleTabSwitch('fees')} icon={<IndianRupee size={18} />} text="Fee Management" />
      </div>

      {/* Content Rendering */}
      {activeTab === 'overview' && <OverviewTab messages={messages} />}
      {activeTab === 'students' && <StudentsTab />} 
      {activeTab === 'attendance' && <AttendanceTab students={students} />}
      {activeTab === 'messages' && <MessagesTab messages={messages} setMessages={setMessages} user={user} />}
      {activeTab === 'exams' && <ExamsTab />}
      {activeTab === 'fees' && <FeesTab />}
    </div>
  );
};

// Updated TabButton to be full-width on mobile
const TabButton = ({ active, onClick, icon, text }) => (
  <button onClick={onClick} className={`w-full md:w-auto flex justify-start md:justify-center items-center gap-2 px-4 py-3 md:py-2 rounded-lg font-medium transition-colors ${active ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
    {icon} {text}
  </button>
);

/* =========================================================================
   1. OVERVIEW TAB (Noticeboard Feed)
   ========================================================================= */
const OverviewTab = ({ messages }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
      <Bell className="text-purple-600" /> Recent Announcements
    </h2>
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="p-6 md:p-8 text-center text-gray-500 bg-gray-50 border border-dashed rounded-xl">No new messages or announcements.</div>
      ) : (
        messages.map((msg) => (
          <div key={msg._id} className="bg-purple-50/50 rounded-xl border border-purple-100 p-4 md:p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3 border-b border-purple-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                  {msg.sender?.name ? msg.sender.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="font-bold text-sm md:text-base text-gray-900">{msg.sender?.name || 'Unknown User'}</p>
                  <p className="text-[10px] md:text-xs font-medium text-purple-600 uppercase tracking-wider">To: {msg.recipientGroup}</p>
                </div>
              </div>
              <span className="text-[10px] md:text-xs text-gray-500 bg-white px-2 py-1 rounded-md border flex items-center gap-1 shrink-0">
                <Clock size={12}/> {new Date(msg.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm md:text-base text-gray-800 whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))
      )}
    </div>
  </div>
);

/* =========================================================================
   2. ATTENDANCE TAB (Dual Mode: Record & View)
   ========================================================================= */
const AttendanceTab = ({ students }) => {
  const [tabMode, setTabMode] = useState('record');
  
  const [addDate, setAddDate] = useState(new Date().toISOString().split('T')[0]);
  const [addStd, setAddStd] = useState('All');
  const [addBatch, setAddBatch] = useState('All');
  const [markMode, setMarkMode] = useState('markPresent');
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [fetchDate, setFetchDate] = useState(new Date().toISOString().split('T')[0]);
  const [fetchStd, setFetchStd] = useState('All');
  const [fetchBatch, setFetchBatch] = useState('All');
  const [viewStatusFilter, setViewStatusFilter] = useState('All');
  const [viewData, setViewData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const filteredStudents = students.filter(s => (addStd === 'All' || s.std === addStd) && (addBatch === 'All' || s.batch === addBatch));

  const toggleStudent = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
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
      alert(`Attendance for ${addDate} Saved!`);
      setSelectedIds(new Set()); 
    } catch (err) { alert("Failed to save attendance."); }
  };

  const handleFetchAttendance = async () => {
    setIsFetching(true);
    try {
      const res = await api.get(`/teacher/attendance?date=${fetchDate}&std=${fetchStd}&batch=${fetchBatch}`);
      const expectedStudents = students.filter(s => (fetchStd === 'All' || s.std === fetchStd) && (fetchBatch === 'All' || s.batch === fetchBatch));
      
      const presentIds = new Set();
      res.data.forEach(recordDoc => recordDoc.records.forEach(r => {
        if (r.status === 'Present' && r.studentId) {
          const studentIdStr = typeof r.studentId === 'object' ? r.studentId._id : r.studentId;
          presentIds.add(studentIdStr.toString());
        }
      }));

      const calculatedRecords = expectedStudents.map(student => ({
        name: student.name, std: student.std || 'N/A', batch: student.batch || 'N/A',
        status: presentIds.has(student._id.toString()) ? 'Present' : 'Absent'
      }));

      calculatedRecords.sort((a, b) => {
        if (a.std !== b.std) return a.std.localeCompare(b.std);
        if (a.batch !== b.batch) return a.batch.localeCompare(b.batch);
        return a.name.localeCompare(b.name);
      });

      setViewData(calculatedRecords);
    } catch (err) { alert("Failed to fetch records."); } finally { setIsFetching(false); }
  };

  const displayedRecords = viewData.filter(r => viewStatusFilter === 'All' || r.status === viewStatusFilter);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
      <div className="flex gap-2 md:gap-4 mb-6 md:mb-8 border-b pb-4">
        <button onClick={() => setTabMode('record')} className={`pb-2 px-1 md:px-2 font-bold text-sm md:text-lg ${tabMode === 'record' ? 'border-b-4 border-purple-600 text-purple-700' : 'text-gray-400'}`}>Record Attendance</button>
        <button onClick={() => setTabMode('view')} className={`pb-2 px-1 md:px-2 font-bold text-sm md:text-lg ${tabMode === 'view' ? 'border-b-4 border-purple-600 text-purple-700' : 'text-gray-400'}`}>View Past Records</button>
      </div>

      {tabMode === 'record' && (
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 bg-purple-50 p-3 md:p-4 rounded-xl border border-purple-100">
            <div><label className="block text-xs md:text-sm font-bold text-purple-900 mb-1">Select Date</label><input type="date" value={addDate} onChange={(e) => setAddDate(e.target.value)} className="w-full p-2 border rounded text-sm" /></div>
            <div><label className="block text-xs md:text-sm font-bold text-purple-900 mb-1">Standard</label><select value={addStd} onChange={e => setAddStd(e.target.value)} className="w-full p-2 border rounded text-sm bg-white"><option value="All">All Standards</option>{standardOptions.map(std => <option key={std} value={std}>{std}</option>)}</select></div>
            <div><label className="block text-xs md:text-sm font-bold text-purple-900 mb-1">Batch</label><select value={addBatch} onChange={e => setAddBatch(e.target.value)} className="w-full p-2 border rounded text-sm bg-white"><option value="All">All Batches</option><option value="Morning">Morning</option><option value="Evening">Evening</option></select></div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 mb-6">
            <button onClick={() => setMarkMode('markPresent')} className={`px-4 py-2 rounded-md text-sm font-bold ${markMode === 'markPresent' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>Check Presents</button>
            <button onClick={() => setMarkMode('markAbsent')} className={`px-4 py-2 rounded-md text-sm font-bold ${markMode === 'markAbsent' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>Check Absentees</button>
          </div>
          <div className="space-y-2 mb-6 max-h-96 overflow-y-auto pr-2">
            {filteredStudents.length === 0 && <p className="text-gray-500 italic p-4 text-center border rounded-lg bg-gray-50 text-sm">No students found for this filter.</p>}
            {filteredStudents.map(student => (
              <label key={student._id} className="flex items-center gap-3 md:gap-4 p-3 border rounded-lg cursor-pointer hover:bg-purple-50 transition-colors">
                <input type="checkbox" checked={selectedIds.has(student._id)} onChange={() => toggleStudent(student._id)} className="w-5 h-5 accent-purple-600 shrink-0" />
                <div><p className="font-bold text-sm md:text-base text-gray-900">{student.name}</p><p className="text-[10px] md:text-xs text-gray-500">{student.std} • {student.batch}</p></div>
              </label>
            ))}
          </div>
          <button onClick={handleSubmitAttendance} className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-md">Save Attendance for {addDate}</button>
        </div>
      )}

      {tabMode === 'view' && (
        <div className="animate-fade-in">
           <div className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 mb-6 bg-gray-50 p-3 md:p-4 rounded-xl border border-gray-200 items-end">
            <div><label className="block text-xs md:text-sm font-bold text-gray-700 mb-1">Date</label><input type="date" value={fetchDate} onChange={(e) => setFetchDate(e.target.value)} className="w-full p-2 border rounded text-sm" /></div>
            <div><label className="block text-xs md:text-sm font-bold text-gray-700 mb-1">Standard</label><select value={fetchStd} onChange={e => setFetchStd(e.target.value)} className="w-full p-2 border rounded text-sm bg-white"><option value="All">All Standards</option>{standardOptions.map(std => <option key={std} value={std}>{std}</option>)}</select></div>
            <div><label className="block text-xs md:text-sm font-bold text-gray-700 mb-1">Batch</label><select value={fetchBatch} onChange={e => setFetchBatch(e.target.value)} className="w-full p-2 border rounded text-sm bg-white"><option value="All">All Batches</option><option value="Morning">Morning</option><option value="Evening">Evening</option></select></div>
            <div><label className="block text-xs md:text-sm font-bold text-gray-700 mb-1">Status Filter</label><select value={viewStatusFilter} onChange={e => setViewStatusFilter(e.target.value)} className="w-full p-2 border rounded text-sm border-purple-300 font-bold text-purple-700 bg-white"><option value="All">Show All</option><option value="Present">Present Only</option><option value="Absent">Absent Only</option></select></div>
            <button onClick={handleFetchAttendance} disabled={isFetching} className="bg-gray-900 text-white p-2 rounded-lg font-bold hover:bg-gray-800 h-[38px] md:h-[38px] w-full md:w-auto mt-2 md:mt-0 text-sm shadow-md">{isFetching ? 'Loading...' : 'Fetch'}</button>
          </div>
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left border-collapse min-w-[400px]">
              <thead><tr className="bg-gray-100 border-b"><th className="p-3 text-xs md:text-sm">Student Name</th><th className="p-3 text-xs md:text-sm">Standard</th><th className="p-3 text-xs md:text-sm">Batch</th><th className="p-3 text-xs md:text-sm">Status</th></tr></thead>
              <tbody>
                {displayedRecords.length === 0 ? (<tr><td colSpan="4" className="p-6 md:p-8 text-center text-sm text-gray-500">No records to display.</td></tr>) : (
                  displayedRecords.map((record, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50"><td className="p-3 text-sm font-bold text-gray-900">{record.name}</td><td className="p-3 text-xs md:text-sm text-gray-600">{record.std}</td><td className="p-3 text-xs md:text-sm text-gray-600">{record.batch}</td><td className="p-3"><span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold ${record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{record.status}</span></td></tr>
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

/* =========================================================================
   3. MESSAGES TAB (Compose Broadcasts)
   ========================================================================= */
const MessagesTab = ({ messages, setMessages, user }) => {
  const [newContent, setNewContent] = useState('');
  const [recipient, setRecipient] = useState('All Students');
  
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    try {
      const res = await api.post('/teacher/messages', { recipientGroup: recipient, content: newContent });
      const newMessage = { ...res.data, sender: { name: user.name, role: user.role } };
      setMessages([newMessage, ...messages]); 
      alert("Message Broadcasted Successfully!");
      setNewContent('');
    } catch (err) { alert("Failed to send message."); }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2"><Send className="text-purple-600" /> Post an Update</h2>
      <form onSubmit={handleSend}>
        <select value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full md:w-1/2 p-2 md:p-3 border border-gray-200 rounded-lg mb-4 text-sm md:text-base bg-white">
          <option value="All Students">To: All Students</option>
          <option value="All Staff & Admin">To: All Staff & Admin</option>
        </select>
        <textarea value={newContent} onChange={e => setNewContent(e.target.value)} rows="4" className="w-full p-2 md:p-3 border rounded-lg mb-4 text-sm md:text-base resize-y" placeholder="Type your announcement here..." required></textarea>
        <button type="submit" className="w-full md:w-auto bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 shadow-md">Broadcast Message</button>
      </form>
    </div>
  );
};

export default TeacherPortal;