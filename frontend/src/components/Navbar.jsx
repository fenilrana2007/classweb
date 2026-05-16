// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              Class<span className="text-indigo-600">Web</span>
            </span>
          </Link>

          {/* Right Side Navigation */}
          <div className="flex items-center gap-4">
            {user ? (
              // Show these if user IS logged in
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 border-l border-gray-200 pl-4 ml-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <UserIcon size={18} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.name}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="ml-4 flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              // Show these if user is NOT logged in
              <>
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 transition-colors">
                  Sign in
                </Link>
                
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;