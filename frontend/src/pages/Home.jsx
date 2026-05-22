import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Users, TrendingUp, Shield, ArrowRight } from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCTA = () => {
    if (!user) {
      navigate('/login');
    } else {
      // Smart routing if they are already logged in!
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/teacher');
      else navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <main className=" `flex-grow` flex items-center justify-center pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 text-indigo-700 p-4 rounded-full">
              <BookOpen size={48} />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Welcome to <span className="text-indigo-600">Unique Coaching Class</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            The all-in-one tuition management platform. Seamlessly connect teachers, students, and administrators for a smarter learning experience.
          </p>
          
          <button 
            onClick={handleCTA}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            {user ? 'Go to My Dashboard' : 'Sign In to Portal'}
            <ArrowRight size={20} />
          </button>
        </div>
      </main>

      {/* Features Section */}
      <div className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="mx-auto bg-blue-100 w-16 h-16 flex items-center justify-center rounded-2xl mb-4 text-blue-600">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Attendance</h3>
              <p className="text-gray-500">Track daily student presence with real-time updates and historical ledgers.</p>
            </div>

            <div className="p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="mx-auto bg-green-100 w-16 h-16 flex items-center justify-center rounded-2xl mb-4 text-green-600">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Tracking</h3>
              <p className="text-gray-500">Instant exam results, grading analytics, and downloadable progress reports.</p>
            </div>

            <div className="p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="mx-auto bg-purple-100 w-16 h-16 flex items-center justify-center rounded-2xl mb-4 text-purple-600">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Fee Management</h3>
              <p className="text-gray-500">Generate PDF receipts, track pending dues, and manage the master financial ledger safely.</p>
            </div>

          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Unique Coaching Class. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;