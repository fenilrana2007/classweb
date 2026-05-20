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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      <h2 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2"><BookOpen className="text-purple-600" /> Daily Class Logs & Homework</h2>
      
      <form onSubmit={handleSubmit} className="bg-purple-50 p-4 md:p-6 rounded-xl border border-purple-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div><label className="text-xs font-bold text-gray-600 uppercase">Date</label><input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-2 border rounded mt-1 text-sm bg-white" /></div>
          <div><label className="text-xs font-bold text-gray-600 uppercase">Standard</label><select required value={formData.std} onChange={e => setFormData({...formData, std: e.target.value})} className="w-full p-2 border rounded mt-1 text-sm bg-white">{STANDARD_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          <div><label className="text-xs font-bold text-gray-600 uppercase">Batch</label><select required value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="w-full p-2 border rounded mt-1 text-sm bg-white"><option>Morning</option><option>Evening</option></select></div>
        </div>
        <div className="mb-4"><label className="text-xs font-bold text-gray-600 uppercase">Subject</label><input type="text" required placeholder="e.g. Mathematics" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full p-2 border rounded mt-1 text-sm" /></div>
        <div className="mb-4"><label className="text-xs font-bold text-gray-600 uppercase">Topic Taught Today</label><textarea required rows="2" value={formData.topicTaught} onChange={e => setFormData({...formData, topicTaught: e.target.value})} className="w-full p-2 border rounded mt-1 text-sm resize-y" /></div>
        <div className="mb-4"><label className="text-xs font-bold text-gray-600 uppercase">Homework Assigned</label><textarea rows="2" value={formData.homework} onChange={e => setFormData({...formData, homework: e.target.value})} className="w-full p-2 border rounded mt-1 text-sm resize-y" /></div>
        <div className="mb-6"><label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1"><LinkIcon size={14}/> Material Link (G-Drive / Cloudinary URL)</label><input type="url" placeholder="https://..." value={formData.attachmentLink} onChange={e => setFormData({...formData, attachmentLink: e.target.value})} className="w-full p-2 border rounded mt-1 text-sm" /></div>
        <div className="flex flex-col md:flex-row gap-2">
          <button type="submit" className="w-full md:w-auto bg-purple-600 text-white px-6 py-2 rounded font-bold hover:bg-purple-700 shadow-sm">{editingId ? 'Update Log' : 'Save Log'}</button>
          {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({ date: new Date().toISOString().split('T')[0], std: STANDARD_OPTIONS[9], batch: 'Morning', subject: '', topicTaught: '', homework: '', attachmentLink: '' })}} className="w-full md:w-auto bg-gray-300 px-4 py-2 rounded font-bold text-gray-800">Cancel</button>}
        </div>
      </form>

      <div className="space-y-4">
        {logs.map(log => (
          <div key={log._id} className="border border-gray-200 p-4 rounded-xl hover:shadow-md transition-shadow bg-white">
            <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-100 pb-3 mb-3 gap-2">
              <span className="font-bold text-purple-800 text-sm md:text-base">
                {new Date(log.date).toLocaleDateString()} - {log.subject} <span className="text-xs text-gray-500 font-normal">({log.std} - {log.batch})</span>
              </span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(log)} className="p-1.5 text-orange-500 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 rounded" title="Edit"><Edit size={16}/></button>
                <button onClick={() => handleDelete(log._id)} className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded" title="Delete"><Trash2 size={16}/></button>
              </div>
            </div>
            
            <p className="text-sm text-gray-800"><strong className="text-gray-900">Taught:</strong> {log.topicTaught}</p>
            <p className="text-sm text-gray-800 mt-2"><strong className="text-gray-900">Homework:</strong> {log.homework || <span className="text-gray-500 italic">None assigned</span>}</p>
            
            {/* UPDATED ATTACHMENT LINK BUTTON */}
            {log.attachmentLink && (
              <div className="mt-4 pt-4 border-t border-purple-50">
                <a 
                  href={log.attachmentLink.startsWith('http') ? log.attachmentLink : `https://${log.attachmentLink}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-2 bg-purple-50 text-purple-700 border border-purple-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-100 transition-colors shadow-sm w-full md:w-auto"
                >
                  <LinkIcon size={16}/> 
                  Open Attached Material
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassLogTab;