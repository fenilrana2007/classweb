import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Award, Plus, Trash2, Edit, UploadCloud, Loader, X, ExternalLink, Star, User } from 'lucide-react';
import { STANDARD_OPTIONS } from './StudentsTab';

const GalleryTab = ({ isAdmin }) => {
  const [achievements, setAchievements] = useState([]);
  const [viewMode, setViewMode] = useState('gallery'); 
  const [editingId, setEditingId] = useState(null);
  
  const [filterYear, setFilterYear] = useState('All');
  const [filterStd, setFilterStd] = useState('All');
  
  const [isUploading, setIsUploading] = useState(false);

  // Separated Image States for the Form
  const [profileImg, setProfileImg] = useState('');
  const [proofImg, setProofImg] = useState('');

  const currentYear = new Date().getFullYear();
  const defaultYear = `${currentYear - 1}-${currentYear}`;

  const initialForm = {
    academicYear: defaultYear,
    studentName: '',
    std: STANDARD_OPTIONS[9],
    batch: 'Morning',
    subjectMarks: '',
    result: '',
    customFields: []
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => { fetchAchievements(); }, []);

  const fetchAchievements = async () => {
    try {
      const res = await api.get('/achievements');
      setAchievements(res.data);
    } catch (err) { console.error("Error fetching achievements"); }
  };

  const handleSingleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    data.append("cloud_name", cloudName);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, { method: "POST", body: data });
      if (res.ok) {
        const uploadedFile = await res.json();
        if (type === 'profile') setProfileImg(uploadedFile.secure_url);
        if (type === 'proof') setProofImg(uploadedFile.secure_url);
      } else {
        alert("Upload failed. Check Cloudinary credentials.");
      }
    } catch (err) { console.error("Failed to upload image:", err); }
    setIsUploading(false);
  };

  const addCustomField = () => setFormData({ ...formData, customFields: [...formData.customFields, { title: '', value: '' }] });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      photos: [profileImg, proofImg].filter(Boolean)
    };

    try {
      if (editingId) {
        await api.put(`/achievements/${editingId}`, submissionData);
        alert("Updated successfully!");
      } else {
        await api.post('/achievements', submissionData);
        alert("Added to Hall of Fame!");
      }
      fetchAchievements();
      resetForm();
    } catch (err) { alert("Failed to save achievement."); }
  };

  const handleEdit = (ach) => {
    setEditingId(ach._id);
    setFormData({
      academicYear: ach.academicYear,
      studentName: ach.studentName,
      std: ach.std,
      batch: ach.batch,
      subjectMarks: ach.subjectMarks,
      result: ach.result,
      customFields: ach.customFields || []
    });
    setProfileImg(ach.photos?.[0] || '');
    setProofImg(ach.photos?.[1] || '');
    setViewMode('add');
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this student from the gallery?")) {
      await api.delete(`/achievements/${id}`);
      fetchAchievements();
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setProfileImg('');
    setProofImg('');
    setEditingId(null);
    setViewMode('gallery');
  };

  const uniqueYears = [...new Set(achievements.map(a => a.academicYear))].sort().reverse();
  const filteredGallery = achievements.filter(a => 
    (filterYear === 'All' || a.academicYear === filterYear) &&
    (filterStd === 'All' || a.std === filterStd)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 animate-fade-in">
      
      {/* THE HEADER - Only show ONE copy, regardless of mobile/desktop */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Award className="text-yellow-500" size={28} /> Hall of Fame
          </h2>
          <p className="text-sm text-gray-500 mt-1">Celebrating our brightest stars and top achievers.</p>
        </div>
        
        {isAdmin && (
          <div className="flex gap-2 w-full md:w-auto bg-gray-50 p-1 rounded-lg border border-gray-200">
            <button onClick={resetForm} className={`flex-1 md:flex-none px-6 py-2 text-sm font-bold rounded-md transition-all ${viewMode === 'gallery' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}>Gallery</button>
            <button onClick={() => setViewMode('add')} className={`flex-1 md:flex-none px-6 py-2 text-sm font-bold rounded-md transition-all ${viewMode === 'add' ? 'bg-yellow-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>+ Add Achiever</button>
          </div>
        )}
      </div>

      {/* CONDITIONAL RENDERING: Ensure ONLY ONE view renders at a time */}
      {viewMode === 'add' && isAdmin ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-xl max-w-4xl mx-auto">
          {/* ... (Keep all your existing form code here, nothing needs to change in the form itself) ... */}
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Star className="text-yellow-500" size={20}/> Achiever Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div><label className="text-xs font-bold text-gray-500 uppercase">Academic Year</label><input type="text" required value={formData.academicYear} onChange={e => setFormData({...formData, academicYear: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg mt-1 bg-gray-50 focus:bg-white" /></div>
            <div><label className="text-xs font-bold text-gray-500 uppercase">Student Name</label><input type="text" required value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg mt-1 bg-gray-50 focus:bg-white" /></div>
            <div><label className="text-xs font-bold text-gray-500 uppercase">Standard</label><select required value={formData.std} onChange={e => setFormData({...formData, std: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg mt-1 bg-gray-50 focus:bg-white">{STANDARD_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label className="text-xs font-bold text-gray-500 uppercase">Batch</label><select required value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg mt-1 bg-gray-50 focus:bg-white"><option>Morning</option><option>Evening</option></select></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            <div><label className="text-xs font-bold text-gray-500 uppercase">Main Achievement / Rank</label><input type="text" required value={formData.result} onChange={e => setFormData({...formData, result: e.target.value})} placeholder="e.g. 1st Rank in Board" className="w-full p-3 border border-yellow-300 rounded-lg mt-1 font-bold text-yellow-800 bg-yellow-50 focus:bg-white" /></div>
            <div><label className="text-xs font-bold text-gray-500 uppercase">Key Subject Marks</label><input type="text" value={formData.subjectMarks} onChange={e => setFormData({...formData, subjectMarks: e.target.value})} placeholder="e.g. Math: 99/100" className="w-full p-3 border border-gray-200 rounded-lg mt-1 bg-gray-50 focus:bg-white" /></div>
          </div>

          <div className="mb-8 bg-gray-50 p-5 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <label className="text-xs font-bold text-gray-600 uppercase">Extra Distinctions</label>
              <button type="button" onClick={addCustomField} className="text-xs bg-white border border-gray-300 text-gray-700 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-gray-100"><Plus size={14}/> Add Field</button>
            </div>
            {formData.customFields.map((field, idx) => (
              <div key={idx} className="flex gap-2 mb-3">
                <input type="text" placeholder="Title (e.g. Trophy)" value={field.title} onChange={e => updateCustomField(idx, 'title', e.target.value)} className="w-1/3 p-2 border rounded-lg text-sm" />
                <input type="text" placeholder="Detail (e.g. State Level Winner)" value={field.value} onChange={e => updateCustomField(idx, 'value', e.target.value)} className="flex-1 p-2 border rounded-lg text-sm" />
                <button type="button" onClick={() => removeCustomField(idx)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center bg-gray-50 relative">
              <label className="text-sm font-bold text-gray-700 uppercase block mb-2">Student Photograph</label>
              {!profileImg ? (
                <>
                  <UploadCloud className="mx-auto text-gray-400 mb-2" size={32} />
                  <input type="file" accept="image/*" onChange={(e) => handleSingleUpload(e, 'profile')} disabled={isUploading} className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                </>
              ) : (
                <div className="relative inline-block mt-2">
                  <img src={profileImg} alt="Profile" className="h-24 w-24 object-cover rounded-full border-4 border-white shadow-md mx-auto" />
                  <button type="button" onClick={() => setProfileImg('')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"><X size={14}/></button>
                </div>
              )}
            </div>

            <div className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center bg-gray-50 relative">
              <label className="text-sm font-bold text-gray-700 uppercase block mb-2">Result / Marksheet (Proof)</label>
              {!proofImg ? (
                <>
                  <UploadCloud className="mx-auto text-gray-400 mb-2" size={32} />
                  <input type="file" accept="image/*,.pdf" onChange={(e) => handleSingleUpload(e, 'proof')} disabled={isUploading} className="text-sm w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer" />
                </>
              ) : (
                <div className="relative inline-block mt-2">
                  <img src={proofImg} alt="Proof" className="h-24 w-20 object-cover rounded border-2 border-white shadow-md mx-auto" />
                  <button type="button" onClick={() => setProofImg('')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"><X size={14}/></button>
                </div>
              )}
            </div>
          </div>
          
          {isUploading && <p className="text-center text-sm text-yellow-600 font-bold mb-4 flex justify-center items-center gap-2"><Loader size={16} className="animate-spin" /> Uploading to secure server...</p>}

          <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-100">
            <button type="submit" disabled={isUploading} className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50">
              {editingId ? 'Update Achiever Record' : 'Publish to Hall of Fame'}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="px-8 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>}
          </div>
        </form>
      ) : null}

      {/* --- GALLERY VIEW --- ONLY RENDER THIS IF viewMode IS 'gallery' */}
      {viewMode === 'gallery' ? (
        <div>
          <div className="flex flex-col md:flex-row gap-4 mb-10 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Filter Year:</label>
              <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-lg bg-white font-bold text-gray-700 outline-none focus:border-yellow-400 transition-colors">
                <option value="All">All Academic Years</option>
                {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Filter Std:</label>
              <select value={filterStd} onChange={e => setFilterStd(e.target.value)} className="w-full p-2.5 border border-gray-200 rounded-lg bg-white font-bold text-gray-700 outline-none focus:border-yellow-400 transition-colors">
                <option value="All">All Standards</option>
                {STANDARD_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 mt-12">
            {filteredGallery.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <Award size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No achievers found for these filters.</p>
              </div>
            ) : (
              filteredGallery.map(ach => (
                <div key={ach._id} className="relative bg-white rounded-2xl shadow-lg border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col mt-8">
                  <div className="h-20 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-t-2xl relative">
                     <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/30">
                      {ach.academicYear}
                    </div>
                  </div>

                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    {ach.photos?.[0] ? (
                      <img src={ach.photos[0]} alt={ach.studentName} className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white" />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-gray-100 flex items-center justify-center text-gray-400">
                        <User size={40} />
                      </div>
                    )}
                  </div>

                  <div className="pt-16 pb-6 px-6 flex-grow flex flex-col text-center">
                    <h3 className="text-xl font-extrabold text-gray-900 leading-tight">{ach.studentName}</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">{ach.std} <span className="mx-1">•</span> {ach.batch}</p>
                    
                    <div className="mt-4 mb-5 inline-block mx-auto bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg">
                      <p className="font-bold text-yellow-700 flex items-center gap-2"><Award size={16}/> {ach.result}</p>
                    </div>

                    <div className="space-y-2 mb-6">
                      {ach.subjectMarks && <p className="text-sm text-gray-700"><span className="text-gray-400 mr-1">Marks:</span> <strong className="text-gray-900">{ach.subjectMarks}</strong></p>}
                      {ach.customFields && ach.customFields.map((field, i) => (
                        <p key={i} className="text-sm text-gray-700"><span className="text-gray-400 mr-1">{field.title}:</span> <strong className="text-gray-900">{field.value}</strong></p>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
                      {ach.photos?.[1] && (
                        <a href={ach.photos[1]} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2 bg-blue-50 text-blue-600 font-bold rounded-lg text-sm hover:bg-blue-100 transition-colors">
                          <ExternalLink size={16} /> View Official Result
                        </a>
                      )}

                      {isAdmin && (
                        <div className="flex justify-center gap-2 w-full">
                          <button onClick={() => handleEdit(ach)} className="flex-1 py-1.5 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg text-sm font-bold flex justify-center items-center gap-1"><Edit size={14}/> Edit</button>
                          <button onClick={() => handleDelete(ach._id)} className="flex-1 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-bold flex justify-center items-center gap-1"><Trash2 size={14}/> Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}

    </div>
  );
};

export default GalleryTab;