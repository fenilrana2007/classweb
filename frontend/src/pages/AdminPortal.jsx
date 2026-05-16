// src/pages/AdminPortal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  ShieldCheck, Users, LayoutDashboard, UserPlus, 
  Ban, Edit, Trash2, Send, Bell, Clock 
} from 'lucide-react';

const AdminPortal = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Master States
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

  if (!user || user.role !== 'admin') return <div className="p-10 text-center text-red-600 font-bold mt-20">Access Denied. Master Admins Only.</div>;
  if (isLoading) return <div className="p-10 text-center mt-20 animate-pulse font-bold text-gray-800">Loading Master Control...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Admin Header (Dark Theme) */}
      <div className="bg-gray-900 rounded-2xl p-8 text-white shadow-lg mb-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Control Center</h1>
            <p className="text-gray-300 text-lg">Welcome back, {user.name}. System operations look good.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 flex items-center gap-2">
            <ShieldCheck size={18} className="text-green-400" />
            <span className="font-bold uppercase tracking-wider text-sm text-green-400">Master Admin</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={18} />} text="System Overview" />
        <TabButton active={activeTab === 'staff'} onClick={() => setActiveTab('staff')} icon={<Users size={18} />} text="Manage Faculty" />
        <TabButton active={activeTab === 'noticeboard'} onClick={() => setActiveTab('noticeboard')} icon={<Bell size={18} />} text="Noticeboard" />
        <TabButton active={activeTab === 'broadcast'} onClick={() => setActiveTab('broadcast')} icon={<Send size={18} />} text="Broadcast" />
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && <OverviewTab stats={stats} />}
      {activeTab === 'staff' && <StaffTab teachers={teachers} setTeachers={setTeachers} />}
      {activeTab === 'noticeboard' && <NoticeboardTab messages={messages} />}
      {activeTab === 'broadcast' && <BroadcastTab messages={messages} setMessages={setMessages} user={user} />}

    </div>
  );
};

const TabButton = ({ active, onClick, icon, text }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${active ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
    {icon} {text}
  </button>
);

/* ==========================================
   1. OVERVIEW TAB
   ========================================== */
const OverviewTab = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
      <div className="p-4 rounded-xl bg-blue-50 text-blue-600"><Users size={24} /></div>
      <div><p className="text-sm text-gray-500 font-medium">Total Registered Students</p><p className="text-3xl font-bold">{stats.totalStudents}</p></div>
    </div>
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
      <div className="p-4 rounded-xl bg-purple-50 text-purple-600"><ShieldCheck size={24} /></div>
      <div><p className="text-sm text-gray-500 font-medium">Total Active Faculty</p><p className="text-3xl font-bold">{stats.totalTeachers}</p></div>
    </div>
  </div>
);

/* ==========================================
   2. MANAGE STAFF TAB (CRUD FOR TEACHERS)
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Faculty Directory</h2>
        <button onClick={handleAddNewClick} className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-gray-800">
          <UserPlus size={16} /> {showForm && !editingId ? 'Cancel' : 'Add New Faculty'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="font-bold text-lg mb-4 text-gray-900">{editingId ? 'Edit Faculty Account' : 'Create Faculty Account'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input required type="text" placeholder="Full Name" value={formData.name} className="p-2 border rounded outline-none focus:ring-2 focus:ring-gray-900" onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required type="email" placeholder="Email Address" disabled={editingId} value={formData.email} className={`p-2 border rounded outline-none focus:ring-2 focus:ring-gray-900 ${editingId ? 'bg-gray-200' : ''}`} onChange={e => setFormData({...formData, email: e.target.value})} />
            {!editingId && <input required type="password" placeholder="Secure Password" value={formData.password} className="p-2 border rounded outline-none focus:ring-2 focus:ring-gray-900" onChange={e => setFormData({...formData, password: e.target.value})} />}
            <input type="text" placeholder="Phone Number" value={formData.phone} className="p-2 border rounded outline-none focus:ring-2 focus:ring-gray-900" onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800">{editingId ? 'Save Changes' : 'Authorize Account'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-bold hover:bg-gray-400">Cancel</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200"><th className="p-4 text-sm text-gray-500">Name</th><th className="p-4 text-sm text-gray-500">Contact</th><th className="p-4 text-sm text-gray-500">System Status</th><th className="p-4 text-sm text-gray-500">Actions</th></tr>
          </thead>
          <tbody>
            {teachers.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-gray-500">No faculty members found.</td></tr>
            ) : (
              teachers.map(teacher => (
                <tr key={teacher._id} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${teacher.isBlocked ? 'opacity-50' : ''}`}>
                  <td className="p-4 font-bold text-gray-900">{teacher.name}</td>
                  <td className="p-4 text-sm text-gray-600">{teacher.email}<br/>{teacher.phone}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${teacher.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {teacher.isBlocked ? 'Revoked' : 'Active'}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => handleEditClick(teacher)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg" title="Edit Details"><Edit size={16} /></button>
                    <button onClick={() => handleToggleBlock(teacher._id)} className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg" title={teacher.isBlocked ? "Restore Access" : "Revoke Access"}><Ban size={16} /></button>
                    <button onClick={() => handleDelete(teacher._id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg" title="Delete Account"><Trash2 size={16} /></button>
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
   3. NOTICEBOARD TAB (View All System Messages)
   ========================================== */
const NoticeboardTab = ({ messages }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in max-w-4xl">
    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <Bell className="text-gray-900" /> Platform Communication Log
    </h2>
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-gray-50 border border-dashed rounded-xl">No messages found on the platform.</div>
      ) : (
        messages.map((msg) => (
          <div key={msg._id} className="bg-gray-50/50 rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3 border-b border-gray-200 pb-3">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 text-white rounded-full flex items-center justify-center font-bold ${msg.sender?.role === 'admin' ? 'bg-gray-900' : 'bg-purple-600'}`}>
                  {msg.sender?.name ? msg.sender.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{msg.sender?.name || 'Unknown User'} <span className="text-xs font-normal text-gray-500">({msg.sender?.role})</span></p>
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Sent To: {msg.recipientGroup}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border flex items-center gap-1">
                <Clock size={12}/> {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-gray-800 whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))
      )}
    </div>
  </div>
);

/* ==========================================
   4. BROADCAST TAB (Send Master Messages)
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
      setMessages([newMessage, ...messages]); // Update feed instantly
      alert("Master Broadcast Sent Successfully!");
      setNewContent('');
    } catch (err) { alert("Failed to send message."); }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in max-w-4xl">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Send className="text-gray-900" /> System Broadcast</h2>
      <form onSubmit={handleSend}>
        <label className="block text-sm font-bold text-gray-700 mb-2">Select Target Audience</label>
        <select value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-gray-900">
          <option value="All Staff & Admin">To: All Faculty & Administrators</option>
          <option value="All Students">To: All Students</option>
        </select>
        
        <label className="block text-sm font-bold text-gray-700 mb-2">Message Content</label>
        <textarea value={newContent} onChange={e => setNewContent(e.target.value)} rows="5" className="w-full p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-gray-900" placeholder="Type your official announcement here..." required></textarea>
        
        <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 shadow-md">Broadcast Message</button>
      </form>
    </div>
  );
};

export default AdminPortal;