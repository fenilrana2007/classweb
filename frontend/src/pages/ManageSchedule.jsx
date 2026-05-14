// src/pages/ManageSchedule.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';

const ManageSchedule = () => {
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    date: '',
    type: 'Live Class'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/schedules', formData);
      alert('Schedule added successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add schedule. Are you an Admin?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CalendarIcon className="text-indigo-600" /> Add New Schedule
        </h1>

        {error && <div className="mb-4 text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Class Title</label>
            <input type="text" required className="w-full mt-1 p-3 border rounded-lg" placeholder="e.g., React Context API Live Class"
              onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" required className="w-full mt-1 p-3 border rounded-lg"
                onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <input type="time" required className="w-full mt-1 p-3 border rounded-lg"
                onChange={(e) => setFormData({...formData, time: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Event Type</label>
            <select className="w-full mt-1 p-3 border rounded-lg"
              onChange={(e) => setFormData({...formData, type: e.target.value})}>
              <option value="Live Class">Live Class</option>
              <option value="Exam">Exam</option>
              <option value="Assignment">Assignment</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white p-3 rounded-lg mt-4 hover:bg-indigo-700">
            {isLoading ? 'Adding...' : 'Publish Schedule'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageSchedule;