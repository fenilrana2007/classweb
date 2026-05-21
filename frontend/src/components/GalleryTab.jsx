import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Award, Plus, Trash2, Edit, UploadCloud, Loader, X } from 'lucide-react';
import { STANDARD_OPTIONS } from './StudentsTab';

const GalleryTab = ({ isAdmin }) => {
  const [achievements, setAchievements] = useState([]);
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' or 'add'
  const [editingId, setEditingId] = useState(null);
  
  // Filters
  const [filterYear, setFilterYear] = useState('All');
  const [filterStd, setFilterStd] = useState('All');
  
  const [isUploading, setIsUploading] = useState(false);

  // Default Academic Year calculation (e.g., if it's May 2026, it's the 2025-2026 year)
  const currentYear = new Date().getFullYear();
  const defaultYear = `${currentYear - 1}-${currentYear}`;

  const initialForm = {
    academicYear: defaultYear,
    studentName: '',
    std: STANDARD_OPTIONS[9],
    batch: 'Morning',
    subjectMarks: '',
    result: '',
    photos: [],
    customFields: []
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => { fetchAchievements(); }, []);

  const fetchAchievements = async () => {
    try {
      const res = await api.get('/achievements'); // Adjust API path if needed
      setAchievements(res.data);
    } catch (err) { console.error("Error fetching achievements"); }
  };

  // --- MULTIPLE CLOUDINARY UPLOADS ---
  const handleMultipleUploads = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsUploading(true);
    const uploadedUrls = [...formData.photos];
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    for (let file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset);
      data.append("cloud_name", cloudName);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, { method: "POST", body: data });
        if (res.ok) {
          const uploadedFile = await res.json();
          uploadedUrls.push(uploadedFile.secure_url);
        }
      } catch (err) { console.error("Failed to upload image:", err); }
    }
    
    setFormData({ ...formData, photos: uploadedUrls });
    setIsUploading(false);
  };

  const removePhoto = (index) => {
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    setFormData({ ...formData, photos: newPhotos });
  };

  // --- DYNAMIC CUSTOM FIELDS ---
  const addCustomField = () => {
    setFormData({ ...formData, customFields: [...formData.customFields, { title: '', value: '' }] });
  };

  const updateCustomField = (index, key, newValue) => {
    const updated = [...formData.customFields];
    updated[index][key] = newValue;
    setFormData({ ...formData, customFields: updated });
  };

  const removeCustomField = (index) => {
    const updated = [...formData.customFields];
    updated.splice(index, 1);
    setFormData({ ...formData, customFields: updated });
  };

  // --- CRUD SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/achievements/${editingId}`, formData);
        alert("Updated successfully!");
      } else {
        await api.post('/achievements', formData);
        alert("Added to Hall of Fame!");
      }
      fetchAchievements();
      setFormData(initialForm);
      setEditingId(null);
      setViewMode('gallery');
    } catch (err) { alert("Failed to save achievement."); }
  };

  const handleEdit = (ach) => {
    setEditingId(ach._id);
    setFormData(ach);
    setViewMode('add');
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this student from the gallery?")) {
      await api.delete(`/achievements/${id}`);
      fetchAchievements();
    }
  };

  // Extract unique academic years for the filter dropdown
  const uniqueYears = [...new Set(achievements.map(a => a.academicYear))].sort().reverse();
  
  const filteredGallery = achievements.filter(a => 
    (filterYear === 'All' || a.academicYear === filterYear) &&
    (filterStd === 'All' || a.std === filterStd)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Award className="text-yellow-500" /> Hall of Fame
        </h2>
        
        {isAdmin && (
          <div className="flex gap-2">
            <button onClick={() => {setViewMode('gallery'); setEditingId(null);}} className={`px-4 py-2 text-sm font-bold rounded-md ${viewMode === 'gallery' ? 'bg-gray-200 text-gray-900' : 'bg-gray-50 text-gray-500'}`}>Gallery</button>
            <button onClick={() => setViewMode('add')} className={`px-4 py-2 text-sm font-bold rounded-md ${viewMode === 'add' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-50 text-gray-500'}`}>+ Add Achiever</button>
          </div>
        )}
      </div>

      {viewMode === 'add' && isAdmin ? (
        <form onSubmit={handleSubmit} className="bg-yellow-50/30 p-6 rounded-xl border border-yellow-100 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="text-xs font-bold text-gray-600 uppercase">Academic Year</label><input type="text" required value={formData.academicYear} onChange={e => setFormData({...formData, academicYear: e.target.value})} placeholder="e.g. 2025-2026" className="w-full p-2 border rounded mt-1" /></div>
            <div><label className="text-xs font-bold text-gray-600 uppercase">Student Name</label><input type="text" required value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} className="w-full p-2 border rounded mt-1" /></div>
            <div><label className="text-xs font-bold text-gray-600 uppercase">Standard</label><select required value={formData.std} onChange={e => setFormData({...formData, std: e.target.value})} className="w-full p-2 border rounded mt-1 bg-white">{STANDARD_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className="text-xs font-bold text-gray-600 uppercase">Batch</label><select required value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="w-full p-2 border rounded mt-1 bg-white"><option>Morning</option><option>Evening</option></select></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label className="text-xs font-bold text-gray-600 uppercase">Main Result / Rank</label><input type="text" required value={formData.result} onChange={e => setFormData({...formData, result: e.target.value})} placeholder="e.g. 1st Rank School / 98%" className="w-full p-2 border rounded mt-1 font-bold text-yellow-700" /></div>
            <div><label className="text-xs font-bold text-gray-600 uppercase">Subject Marks Details</label><input type="text" value={formData.subjectMarks} onChange={e => setFormData({...formData, subjectMarks: e.target.value})} placeholder="e.g. Math: 99, Science: 95" className="w-full p-2 border rounded mt-1" /></div>
          </div>

          {/* DYNAMIC FIELDS SECTION */}
          <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold text-gray-600 uppercase">Extra Details (Optional)</label>
              <button type="button" onClick={addCustomField} className="text-xs bg-gray-100 font-bold px-2 py-1 rounded flex items-center gap-1 hover:bg-gray-200"><Plus size={12}/> Add Field</button>
            </div>
            {formData.customFields.map((field, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input type="text" placeholder="Title (e.g. Trophy)" value={field.title} onChange={e => updateCustomField(idx, 'title', e.target.value)} className="w-1/3 p-2 border rounded text-sm" />
                <input type="text" placeholder="Value (e.g. National Math Olympiad)" value={field.value} onChange={e => updateCustomField(idx, 'value', e.target.value)} className="flex-1 p-2 border rounded text-sm" />
                <button type="button" onClick={() => removeCustomField(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>

          {/* CLOUDINARY MULTIPLE PHOTOS */}
          <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
             <label className="text-xs font-bold text-gray-600 uppercase block mb-2">Upload Photos (Select multiple)</label>
             <input type="file" multiple accept="image/*" onChange={handleMultipleUploads} disabled={isUploading} className="mb-4 text-sm" />
             {isUploading && <p className="text-sm text-yellow-600 font-bold flex items-center gap-2"><Loader size={14} className="animate-spin" /> Uploading images...</p>}
             
             <div className="flex flex-wrap gap-2">
               {formData.photos.map((url, idx) => (
                 <div key={idx} className="relative group">
                   <img src={url} alt="Uploaded" className="h-20 w-20 object-cover rounded border" />
                   <button type="button" onClick={() => removePhoto(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                 </div>
               ))}
             </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={isUploading} className="flex-1 bg-yellow-500 text-white font-bold py-3 rounded-lg shadow hover:bg-yellow-600 disabled:opacity-50">
              {editingId ? 'Update Record' : 'Save to Gallery'}
            </button>
            {editingId && <button type="button" onClick={() => {setEditingId(null); setViewMode('gallery');}} className="px-6 bg-gray-300 font-bold rounded-lg">Cancel</button>}
          </div>
        </form>
      ) : (
        /* GALLERY VIEW (Shared between Admin, Teacher, Student) */
        <div>
          <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mr-2">Filter Year:</label>
              <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="p-1 border rounded bg-white font-bold text-sm">
                <option value="All">All Years</option>
                {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mr-2">Filter Std:</label>
              <select value={filterStd} onChange={e => setFilterStd(e.target.value)} className="p-1 border rounded bg-white font-bold text-sm">
                <option value="All">All Standards</option>
                {STANDARD_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.length === 0 ? <p className="text-gray-500 italic col-span-full">No achievements found for these filters.</p> : 
              filteredGallery.map(ach => (
                <div key={ach._id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white relative">
                  
                  {/* Image Carousel (Simplified) */}
                  <div className="h-48 bg-gray-100 relative overflow-hidden flex overflow-x-auto snap-x">
                    {ach.photos && ach.photos.length > 0 ? (
                      ach.photos.map((photo, i) => (
                        <img key={i} src={photo} alt={ach.studentName} className="min-w-full h-full object-cover snap-center" />
                      ))
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><Award size={48} opacity={0.5}/></div>
                    )}
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                      {ach.academicYear}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900">{ach.studentName}</h3>
                    <p className="text-sm text-gray-500 mb-2">{ach.std} • {ach.batch}</p>
                    
                    <div className="bg-yellow-50 border border-yellow-100 p-2 rounded mb-3">
                      <p className="font-bold text-yellow-800 text-center">{ach.result}</p>
                    </div>

                    {ach.subjectMarks && <p className="text-sm text-gray-700 mb-2"><strong>Marks:</strong> {ach.subjectMarks}</p>}
                    
                    {ach.customFields && ach.customFields.map((field, i) => (
                      <p key={i} className="text-sm text-gray-700"><strong>{field.title}:</strong> {field.value}</p>
                    ))}

                    {/* Admin Controls */}
                    {isAdmin && (
                      <div className="mt-4 pt-3 border-t flex justify-end gap-2">
                        <button onClick={() => handleEdit(ach)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded"><Edit size={16}/></button>
                        <button onClick={() => handleDelete(ach._id)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded"><Trash2 size={16}/></button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryTab;