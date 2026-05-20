import React, { useState, useEffect,useContext } from 'react';
import api from '../services/api';
import { FileText, Plus, Download, Trash2, Edit3, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { STANDARD_OPTIONS } from './StudentsTab'; 
import { AuthContext } from '../context/AuthContext'; // <-- Add this line!
const ExamsTab = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [viewMode, setViewMode] = useState('list');
  const [selectedExam, setSelectedExam] = useState(null);
  
  // Added minPassMarks to the default form state
  const [formData, setFormData] = useState({ name: '', std: STANDARD_OPTIONS[9], batch: 'All', maxMarks: 100, minPassMarks: 35, examDate: '' });
  const [filterStd, setFilterStd] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc');

  const [marksInput, setMarksInput] = useState({});

  useEffect(() => {
    fetchExams();
    fetchStudents();
  }, []);

  const fetchExams = async () => {
    try { const res = await api.get('/exams'); setExams(res.data); } 
    catch (err) { console.error(err); }
  };

  const fetchStudents = async () => {
    try { const res = await api.get('/students'); setStudents(res.data); } 
    catch (err) { console.error(err); }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!formData.std) return alert("Please select a standard.");
    if (Number(formData.minPassMarks) > Number(formData.maxMarks)) return alert("Passing marks cannot be higher than Maximum marks!");

    try {
      const res = await api.post('/exams', formData);
      setExams([res.data, ...exams]);
      alert("Exam Created! You can now add marks.");
      setViewMode('list');
      // Reset form
      setFormData({ name: '', std: STANDARD_OPTIONS[9], batch: 'All', maxMarks: 100, minPassMarks: 35, examDate: '' });
    } catch (err) { alert("Failed to create exam"); }
  };

  const exportExamToCSV = (exam) => {
    let csv = `Exam Name,${exam.name}\nStandard,${exam.std}\nMax Marks,${exam.maxMarks}\nPassing Marks,${exam.minPassMarks}\n\nStudent Name,Obtained Marks,Status,Percentage\n`;
    
    exam.marks.forEach(m => {
      const name = m.studentId?.name || 'Unknown';
      const status = m.isAbsent ? 'Absent' : (m.obtainedMarks >= exam.minPassMarks ? 'Pass' : 'Fail');
      const percentage = m.isAbsent ? 0 : Math.round((m.obtainedMarks / exam.maxMarks) * 100);
      csv += `"${name}","${m.obtainedMarks || 0}","${status}","${percentage}%"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${exam.name}_Results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteExam = async (exam) => {
    const confirm = window.confirm(`CRITICAL: You are about to delete the exam "${exam.name}".\n\nClicking OK will automatically download a backup CSV of the marks and permanently delete the exam.`);
    if (confirm) {
      exportExamToCSV(exam);
      try {
        await api.delete(`/exams/${exam._id}`);
        setExams(exams.filter(e => e._id !== exam._id));
        alert("Exam deleted and backup downloaded.");
      } catch (err) { alert("Failed to delete."); }
    }
  };

  const openGradeMode = (exam) => {
    setSelectedExam(exam);
    const eligibleStudents = students.filter(s => 
      s.std === exam.std && (exam.batch === 'All' || s.batch === exam.batch)
    );
    
    const initialMarks = {};
    eligibleStudents.forEach(student => {
      const existingRecord = exam.marks.find(m => m.studentId?._id === student._id);
      initialMarks[student._id] = {
        obtainedMarks: existingRecord ? existingRecord.obtainedMarks : '',
        isAbsent: existingRecord ? existingRecord.isAbsent : false
      };
    });
    
    setMarksInput(initialMarks);
    setViewMode('grade');
  };

  // --- STRICT INPUT VALIDATION FUNCTION ---
  const handleMarksChange = (studentId, value, maxAllowed) => {
    let val = value;
    if (val !== '') {
      val = Number(val);
      if (val < 0) val = 0; // Prevent negative numbers
      if (val > maxAllowed) val = maxAllowed; // Prevent exceeding max marks
    }
    
    setMarksInput({
      ...marksInput, 
      [studentId]: { ...marksInput[studentId], obtainedMarks: val }
    });
  };

  const handleSaveMarks = async () => {
    const marksArray = Object.keys(marksInput).map(studentId => ({
      studentId,
      obtainedMarks: Number(marksInput[studentId].obtainedMarks) || 0,
      isAbsent: marksInput[studentId].isAbsent
    }));

    try {
      const res = await api.put(`/exams/${selectedExam._id}/marks`, { marks: marksArray });
      setExams(exams.map(e => e._id === res.data._id ? res.data : e));
      alert("Marks saved successfully!");
      setViewMode('list');
    } catch (err) { alert("Failed to save marks."); }
  };

  const filteredExams = exams.filter(e => filterStd === 'All' || e.std === filterStd);

  // --- ADD THIS TO ExamsTab.jsx ---
  const handleMasterExportExams = () => {
    if (exams.length === 0) return alert("No exams to export.");

    // Sort exams strictly by Standard Array order (1st to 12th)
    const sortedExams = [...exams].sort((a, b) => STANDARD_OPTIONS.indexOf(a.std) - STANDARD_OPTIONS.indexOf(b.std));

    let csvContent = "Standard,Batch,Exam Name,Max Marks,Passing Marks,Date,Total Students Appeared\n";
    sortedExams.forEach(exam => {
      const date = new Date(exam.examDate).toLocaleDateString();
      csvContent += `"${exam.std}","${exam.batch}","${exam.name}","${exam.maxMarks}","${exam.minPassMarks}","${date}","${exam.marks.length}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Master_Exams_Backup_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMasterDeleteAllExams = async () => {
    const confirmDelete = window.confirm("END OF YEAR WIPE: Are you sure you want to permanently delete ALL exams across the entire system? A backup will be downloaded automatically.");
    if (confirmDelete) {
      handleMasterExportExams(); // Auto Backup first!
      try {
        await api.delete('/exams/all');
        setExams([]);
        alert("All exams have been wiped from the database.");
      } catch (err) { alert("Failed to wipe exams."); }
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in max-w-6xl mx-auto">
      
      {/* <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="text-blue-600" /> 
          {viewMode === 'list' ? 'Examination Center' : 
           viewMode === 'create' ? 'Schedule New Exam' : 
           viewMode === 'grade' ? `Grading: ${selectedExam?.name}` : 
           `Results: ${selectedExam?.name}`}
        </h2>
        
        {viewMode === 'list' ? (
          <button onClick={() => setViewMode('create')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-blue-700">
            <Plus size={16} /> New Exam
          </button>
        ) : (
          <button onClick={() => setViewMode('list')} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-bold hover:bg-gray-300">
            Back to Exams
          </button>
        )}
      </div> */}
      {/* Dynamic Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="text-blue-600" /> 
          {viewMode === 'list' ? 'Examination Center' : 
           viewMode === 'create' ? 'Schedule New Exam' : 
           viewMode === 'grade' ? `Grading: ${selectedExam?.name}` : 
           `Results: ${selectedExam?.name}`}
        </h2>
        
        <div className="flex items-center gap-2">
          {/* NEW PLACEMENT: Master Buttons in Header (Only for Admin) */}
          {currentUser?.role === 'admin' && viewMode === 'list' && (
            <>
              <button onClick={handleMasterExportExams} className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-green-100 shadow-sm">
                <Download size={16} /> Export All (Excel)
              </button>
              <button onClick={handleMasterDeleteAllExams} className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-red-100 shadow-sm">
                <Trash2 size={16} /> Wipe All Exams
              </button>
            </>
          )}

          {viewMode === 'list' ? (
            <button onClick={() => setViewMode('create')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-blue-700 shadow-sm">
              <Plus size={16} /> New Exam
            </button>
          ) : (
            <button onClick={() => setViewMode('list')} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-bold hover:bg-gray-300 shadow-sm">
              Back to Exams
            </button>
          )}
        </div>
      </div>
      {viewMode === 'list' && (
        <>
          <div className="flex gap-4 mb-4">
            <select value={filterStd} onChange={e => setFilterStd(e.target.value)} className="p-2 border rounded-lg outline-none bg-gray-50 font-bold">
              <option value="All">Filter: All Standards</option>
              {STANDARD_OPTIONS.map(std => <option key={std} value={std}>{std}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExams.length === 0 ? <p className="text-gray-500">No exams found.</p> : filteredExams.map(exam => (
              <div key={exam._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow relative">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{exam.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">{exam.std}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Max Marks: {exam.maxMarks} • Pass: {exam.minPassMarks || 35}<br/>
                  <span className="text-xs">{new Date(exam.examDate).toLocaleDateString()}</span>
                </p>
                
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button onClick={() => openGradeMode(exam)} className="flex-1 bg-green-50 text-green-700 p-2 rounded text-sm font-bold flex justify-center items-center gap-1 hover:bg-green-100"><Edit3 size={14}/> Edit Marks</button>
                  <button onClick={() => { setSelectedExam(exam); setViewMode('viewResults'); }} className="flex-1 bg-blue-50 text-blue-700 p-2 rounded text-sm font-bold flex justify-center items-center gap-1 hover:bg-blue-100"><TrendingUp size={14}/> View Results</button>
                  <button onClick={() => exportExamToCSV(exam)} className="p-2 text-gray-500 hover:text-gray-900 bg-gray-50 rounded" title="Export CSV"><Download size={16}/></button>
                  <button onClick={() => handleDeleteExam(exam)} className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded" title="Delete Exam"><Trash2 size={16}/></button>
                  {currentUser?.role === 'admin' && (
                     <div className="flex gap-2 mb-4">
                      <button onClick={handleMasterExportExams} className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold">Export All Exams (Excel)</button>
                      <button onClick={handleMasterDeleteAllExams} className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-bold">Wipe All Exams</button>
                      </div>
          )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {viewMode === 'create' && (
        <form onSubmit={handleCreateExam} className="max-w-2xl bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="col-span-2"><label className="font-bold text-sm text-gray-700">Exam Name</label><input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded mt-1" placeholder="e.g., Mid-Term Mathematics" /></div>
            
            <div><label className="font-bold text-sm text-gray-700">Standard</label>
              <select required value={formData.std} onChange={e => setFormData({...formData, std: e.target.value})} className="w-full p-2 border rounded mt-1 bg-white">
                {STANDARD_OPTIONS.map(std => <option key={std} value={std}>{std}</option>)}
              </select>
            </div>
            
            <div><label className="font-bold text-sm text-gray-700">Batch</label>
              <select value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} className="w-full p-2 border rounded mt-1">
                <option value="All">All Batches</option><option value="Morning">Morning</option><option value="Evening">Evening</option>
              </select>
            </div>

            <div><label className="font-bold text-sm text-gray-700">Max Marks</label><input required type="number" min="1" value={formData.maxMarks} onChange={e => setFormData({...formData, maxMarks: e.target.value})} className="w-full p-2 border rounded mt-1" /></div>
            
            {/* NEW MIN PASS MARKS INPUT */}
            <div><label className="font-bold text-sm text-gray-700">Min Passing Marks</label><input required type="number" min="0" value={formData.minPassMarks} onChange={e => setFormData({...formData, minPassMarks: e.target.value})} className="w-full p-2 border rounded mt-1" /></div>
            
            <div className="col-span-2 md:col-span-1"><label className="font-bold text-sm text-gray-700">Exam Date</label><input required type="date" value={formData.examDate} onChange={e => setFormData({...formData, examDate: e.target.value})} className="w-full p-2 border rounded mt-1" /></div>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Save Exam & Continue</button>
        </form>
      )}

      {viewMode === 'grade' && (
        <div className="max-w-3xl">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-6 text-sm font-medium">
            Entering marks for <b>{selectedExam.std}</b>. Max marks allowed: <b>{selectedExam.maxMarks}</b>.
          </div>
          
          <table className="w-full text-left border-collapse mb-6">
            <thead>
              <tr className="bg-gray-100 border-b"><th className="p-3">Student Name</th><th className="p-3">Obtained Marks (out of {selectedExam.maxMarks})</th><th className="p-3">Absent?</th></tr>
            </thead>
            <tbody>
              {students.filter(s => s.std === selectedExam.std && (selectedExam.batch === 'All' || s.batch === selectedExam.batch)).map(student => (
                <tr key={student._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-bold text-gray-800">{student.name}</td>
                  <td className="p-3">
                    <input 
                      type="number" 
                      min="0"
                      max={selectedExam.maxMarks}
                      disabled={marksInput[student._id]?.isAbsent}
                      value={marksInput[student._id]?.obtainedMarks !== undefined ? marksInput[student._id]?.obtainedMarks : ''} 
                      onChange={(e) => handleMarksChange(student._id, e.target.value, selectedExam.maxMarks)}
                      className="p-2 border rounded w-32 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200" 
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="checkbox" 
                      checked={marksInput[student._id]?.isAbsent}
                      onChange={(e) => setMarksInput({...marksInput, [student._id]: {...marksInput[student._id], isAbsent: e.target.checked}})}
                      className="w-5 h-5 accent-red-500" 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSaveMarks} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-md">Publish Marks to Database</button>
        </div>
      )}

      {viewMode === 'viewResults' && (
        <div>
          <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg border">
            <div>
              <p className="text-gray-500 text-sm font-bold">Total Appeared: {selectedExam.marks.length}</p>
              <p className="text-gray-500 text-sm font-bold">Max Marks: {selectedExam.maxMarks} <span className="mx-2">|</span> Passing Marks: {selectedExam.minPassMarks || 35}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')} className="bg-white border p-2 rounded text-sm font-bold shadow-sm hover:bg-gray-50">
                Sort: {sortOrder === 'desc' ? 'Highest First' : 'Lowest First'}
              </button>
              <button onClick={() => exportExamToCSV(selectedExam)} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-green-700">
                <Download size={14}/> Export CSV
              </button>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b"><th className="p-3">Rank</th><th className="p-3">Student</th><th className="p-3">Marks</th><th className="p-3">Percentage</th><th className="p-3">Status</th></tr>
            </thead>
            <tbody>
              {selectedExam.marks.length === 0 ? <tr><td colSpan="5" className="p-6 text-center text-gray-500">No marks entered yet.</td></tr> : 
                [...selectedExam.marks].sort((a, b) => sortOrder === 'desc' ? b.obtainedMarks - a.obtainedMarks : a.obtainedMarks - b.obtainedMarks)
                .map((mark, index) => {
                  const percentage = Math.round((mark.obtainedMarks / selectedExam.maxMarks) * 100);
                  
                  // NEW CUSTOM PASSING LOGIC
                  const passThreshold = selectedExam.minPassMarks !== undefined ? selectedExam.minPassMarks : 35;
                  const isPass = mark.obtainedMarks >= passThreshold;
                  
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-400">#{index + 1}</td>
                      <td className="p-3 font-bold text-gray-900">{mark.studentId?.name || 'Unknown'}</td>
                      <td className="p-3 font-bold">{mark.isAbsent ? 'AB' : mark.obtainedMarks}</td>
                      <td className="p-3">{mark.isAbsent ? '0%' : `${percentage}%`}</td>
                      <td className="p-3">
                        {mark.isAbsent ? <span className="text-red-500 flex items-center gap-1 text-sm font-bold"><XCircle size={14}/> Absent</span> :
                         isPass ? <span className="text-green-600 flex items-center gap-1 text-sm font-bold"><CheckCircle size={14}/> Pass</span> : 
                         <span className="text-red-500 flex items-center gap-1 text-sm font-bold"><XCircle size={14}/> Fail</span>}
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExamsTab;