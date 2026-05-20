import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BookOpen, Edit, Trash2, Link as LinkIcon } from 'lucide-react';
import { STANDARD_OPTIONS } from './StudentsTab';

const ClassLogTab = () => {
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({ date: new Date().toISOString().split('T')[0], std: STANDARD_OPTIONS[9], batch: 'Morning', subject: '', topicTaught: '', homework: '', attachmentLink: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/teacher/class-logs'); // Ensure this route is set up!
      setLogs(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.put(`/teacher/class-logs/${editingId}`, formData);
        setLogs(logs.map(log => log._id === editingId ? res.data : log));
      } else {
        const res = await api.post('/teacher/class-logs', formData);
        setLogs([res.data, ...logs]);
      }
      setFormData({ date: new Date().toISOString().split('T')[0], std: STANDARD_OPTIONS[9], batch: 'Morning', subject: '', topicTaught: '', homework: '', attachmentLink: '' });
      setEditingId(null);
    } catch (err) { alert("Failed to save log."); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this log?")) {
      await api.delete(`/teacher/class-logs/${id}`);
      setLogs(logs.filter(l => l._id !== id));
    }
  };

  const handleEdit = (log) => {
    setEditingId(log._id);
    setFormData({ date: new Date(log.date).toISOString().split('T')[0], std: log.std, batch: log.batch, subject: log.subject, topicTaught: log.topicTaught, homework: log.homework, attachmentLink: log.attachmentLink });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><BookOpen className="text-purple-600" /> Daily Class Logs & Homework</h2>
      
      <form onSubmit={handleSubmit} className="bg-purple-50 p-6 rounded-xl border border-purple-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div><label className="text-xs font-bold text-gray-600 uppercase">Date</label><input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2 border rounded mt-1" /></div>
          <div><label className="text-xs font-bold text-gray-600 uppercase">Standard</label><select required value={formData.std} onChange={e => setFormData({...formData, std: e.target.value})} className="w-full p-2 border rounded mt-1">{STANDARD_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          <div><label className="text-xs font-bold text-gray-600 uppercase">Batch</label><select required value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="w-full p-2 border rounded mt-1"><option>Morning</option><option>Evening</option></select></div>
        </div>
        <div className="mb-4"><label className="text-xs font-bold text-gray-600 uppercase">Subject</label><input type="text" required placeholder="e.g. Mathematics" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full p-2 border rounded mt-1" /></div>
        <div className="mb-4"><label className="text-xs font-bold text-gray-600 uppercase">Topic Taught Today</label><textarea required rows="2" value={formData.topicTaught} onChange={e => setFormData({...formData, topicTaught: e.target.value})} className="w-full p-2 border rounded mt-1" /></div>
        <div className="mb-4"><label className="text-xs font-bold text-gray-600 uppercase">Homework Assigned</label><textarea rows="2" value={formData.homework} onChange={e => setFormData({...formData, homework: e.target.value})} className="w-full p-2 border rounded mt-1" /></div>
        <div className="mb-6"><label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1"><LinkIcon size={14}/> Material Link (G-Drive / Cloudinary URL)</label><input type="url" placeholder="https://..." value={formData.attachmentLink} onChange={e => setFormData({...formData, attachmentLink: e.target.value})} className="w-full p-2 border rounded mt-1" /></div>
        <div className="flex gap-2">
          <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded font-bold hover:bg-purple-700">{editingId ? 'Update Log' : 'Save Log'}</button>
          {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({ date: new Date().toISOString().split('T')[0], std: STANDARD_OPTIONS[9], batch: 'Morning', subject: '', topicTaught: '', homework: '', attachmentLink: '' })}} className="bg-gray-300 px-4 py-2 rounded font-bold">Cancel</button>}
        </div>
      </form>

      <div className="space-y-4">
        {logs.map(log => (
          <div key={log._id} className="border p-4 rounded-lg hover:shadow-sm">
            <div className="flex justify-between border-b pb-2 mb-2">
              <span className="font-bold text-purple-800">{new Date(log.date).toLocaleDateString()} - {log.subject} ({log.std} ${log.batch})</span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(log)} className="text-orange-500 hover:text-orange-700"><Edit size={16}/></button>
                <button onClick={() => handleDelete(log._id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
              </div>
            </div>
            <p className="text-sm"><strong>Taught:</strong> {log.topicTaught}</p>
            <p className="text-sm mt-1"><strong>Homework:</strong> {log.homework || 'None'}</p>
            {log.attachmentLink && <a href={log.attachmentLink} target="_blank" rel="noreferrer" className="text-blue-600 text-sm font-bold mt-2 inline-flex items-center gap-1 hover:underline"><LinkIcon size={14}/> View Attached Material</a>}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ClassLogTab;