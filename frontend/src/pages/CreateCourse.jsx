// src/pages/CreateCourse.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, BookOpen, DollarSign, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';

const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    batchTime: '',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // We must use FormData to send files to the backend
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('batchTime', formData.batchTime);
    if (thumbnail) {
      data.append('thumbnail', thumbnail);
    }

    try {
      // Send to our backend API
      await api.post('/courses', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Course Created Successfully!');
      navigate('/dashboard'); // Go back to dashboard after creating
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course. Are you an admin?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="text-indigo-600" size={32} />
            Create New Course
          </h1>
          <p className="text-gray-500 mt-2">Add a new subject or batch to the learning platform.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              placeholder="e.g., Advanced MERN Stack Development"
              onChange={handleInputChange}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Description</label>
            <textarea
              name="description"
              required
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              placeholder="What will the students learn?"
              onChange={handleInputChange}
            ></textarea>
          </div>

          {/* Price & Batch Time Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="number"
                  name="price"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="0 for free"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Timing</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="batchTime"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="e.g., Mon-Wed 6:00 PM"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Thumbnail (Image)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors bg-gray-50">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none px-2 py-1">
                    <span>Upload a file</span>
                    <input type="file" name="thumbnail" accept="image/*" className="sr-only" onChange={handleFileChange} />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                {thumbnail && <p className="text-sm text-green-600 font-medium mt-2">Selected: {thumbnail.name}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
          >
            {isLoading ? 'Uploading to Cloudinary & Saving...' : 'Create Course'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;