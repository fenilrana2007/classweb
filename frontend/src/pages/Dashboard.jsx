// src/pages/Dashboard.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Calendar, Clock, Award, ChevronRight, PlayCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  // Safety check: if user isn't loaded yet, show a loading screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       
      {/* Welcome Banner */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg mb-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
        <p className="text-indigo-100 text-lg">Ready to continue your learning journey today?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<BookOpen size={24} />} title="Enrolled Courses" value="3" color="bg-blue-50 text-blue-600" />
        <StatCard icon={<Clock size={24} />} title="Hours Learned" value="12.5" color="bg-green-50 text-green-600" />
        <StatCard icon={<Calendar size={24} />} title="Upcoming Classes" value="2" color="bg-purple-50 text-purple-600" />
        <StatCard icon={<Award size={24} />} title="Certificates" value="1" color="bg-yellow-50 text-yellow-600" />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Active Courses (Takes up 2/3 of the screen on desktop) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
          </div>
          
          <div className="space-y-4">
            {/* Dummy Course Card 1 */}
            <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all group cursor-pointer">
              <div className="flex items-center gap-4 w-full">
                <div className="h-16 w-16 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                  <PlayCircle size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Advanced MERN Stack Development</h3>
                  <p className="text-sm text-gray-500 mb-2">Module 4: React Context API & State</p>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
              <div className="ml-4 h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <ChevronRight className="text-gray-400 group-hover:text-indigo-600" />
              </div>
            </div>

            {/* Dummy Course Card 2 */}
            <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all group cursor-pointer">
              <div className="flex items-center gap-4 w-full">
                <div className="h-16 w-16 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                  <PlayCircle size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Mastering Node.js APIs</h3>
                  <p className="text-sm text-gray-500 mb-2">Module 2: Express Middleware</p>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
              <div className="ml-4 h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <ChevronRight className="text-gray-400 group-hover:text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Schedule / Notice Board */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Today's Schedule</h2>
          <div className="space-y-6">
            <ScheduleItem time="10:00 AM" title="Live React Q&A Session" type="Live Class" color="border-red-500" />
            <ScheduleItem time="02:30 PM" title="Database Schema Review" type="Assignment" color="border-yellow-500" />
            <ScheduleItem time="06:00 PM" title="Weekly Coding Quiz" type="Exam" color="border-purple-500" />
          </div>
        </div>
      </div>

    </div>
  );
};

// Mini-component for the top stats cards
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`p-4 rounded-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// Mini-component for the schedule list
const ScheduleItem = ({ time, title, type, color }) => (
  <div className={`flex items-start gap-4 border-l-4 ${color} pl-4`}>
    <div className="flex-1">
      <p className="text-sm font-bold text-gray-900">{title}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{type}</span>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock size={12} /> {time}
        </span>
      </div>
    </div>
  </div>
);

export default Dashboard;