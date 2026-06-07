// import React, { useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { BookOpen, Users, TrendingUp, Shield, ArrowRight } from 'lucide-react';

// const Home = () => {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleCTA = () => {
//     if (!user) {
//       navigate('/login');
//     } else {
//       // Smart routing if they are already logged in!
//       if (user.role === 'admin') navigate('/admin');
//       else if (user.role === 'teacher') navigate('/teacher');
//       else navigate('/dashboard');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Hero Section */}
//       <main className=" `flex-grow` flex items-center justify-center pt-16 pb-20 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-5xl mx-auto text-center animate-fade-in">
//           <div className="flex justify-center mb-6">
//             <div className="bg-indigo-100 text-indigo-700 p-4 rounded-full">
//               <BookOpen size={48} />
//             </div>
//           </div>
//           <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
//             Welcome to <span className="text-indigo-600">Unique Coaching Class</span>
//           </h1>
//           <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10">
//             The all-in-one tuition management platform. Seamlessly connect teachers, students, and administrators for a smarter learning experience.
//           </p>
          
//           <button 
//             onClick={handleCTA}
//             className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
//           >
//             {user ? 'Go to My Dashboard' : 'Sign In to Portal'}
//             <ArrowRight size={20} />
//           </button>
//         </div>
//       </main>

//       {/* Features Section */}
//       <div className="bg-white py-16 border-t border-gray-100">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
//             <div className="p-6 rounded-2xl hover:bg-gray-50 transition-colors">
//               <div className="mx-auto bg-blue-100 w-16 h-16 flex items-center justify-center rounded-2xl mb-4 text-blue-600">
//                 <Users size={32} />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Attendance</h3>
//               <p className="text-gray-500">Track daily student presence with real-time updates and historical ledgers.</p>
//             </div>

//             <div className="p-6 rounded-2xl hover:bg-gray-50 transition-colors">
//               <div className="mx-auto bg-green-100 w-16 h-16 flex items-center justify-center rounded-2xl mb-4 text-green-600">
//                 <TrendingUp size={32} />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Tracking</h3>
//               <p className="text-gray-500">Instant exam results, grading analytics, and downloadable progress reports.</p>
//             </div>

//             <div className="p-6 rounded-2xl hover:bg-gray-50 transition-colors">
//               <div className="mx-auto bg-purple-100 w-16 h-16 flex items-center justify-center rounded-2xl mb-4 text-purple-600">
//                 <Shield size={32} />
//               </div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Fee Management</h3>
//               <p className="text-gray-500">Generate PDF receipts, track pending dues, and manage the master financial ledger safely.</p>
//             </div>

//           </div>
//         </div>
//       </div>
      
//       {/* Footer */}
//       <footer className="bg-gray-900 py-8 text-center text-gray-400 text-sm">
//         <p>&copy; {new Date().getFullYear()} Unique Coaching Class. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Home;
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { BookOpen, Users, TrendingUp, Shield, ArrowRight, Award, Star, QrCode } from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        // Assuming your backend has this endpoint for the gallery
        const res = await api.get('/achievements'); 
        setAchievements(res.data || []);
      } catch (err) {
        console.error("Failed to load gallery data for homepage");
      }
    };
    fetchGallery();
  }, []);

  const handleCTA = () => {
    if (!user) {
      navigate('/login');
    } else {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/teacher');
      else navigate('/dashboard');
    }
  };

  // We duplicate the array a few times to create a seamless infinite scroll effect
  const scrollingGallery = [...achievements, ...achievements, ...achievements, ...achievements];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      
      {/* --- INLINE CSS FOR 3D AUTO-SCROLLING --- */}
      <style>{`
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } /* Scrolls exactly half the duplicated width */
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scrollLeft 5s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        .card-3d-wrapper {
          perspective: 1000px;
        }
        .card-3d {
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease;
          transform-style: preserve-3d;
        }
        .card-3d:hover {
          transform: rotateY(-5deg) rotateX(5deg) scale(1.05) translateZ(20px);
          box-shadow: -15px 25px 50px -12px rgba(0, 0, 0, 0.25);
          z-index: 50;
        }
        .card-content-3d {
          transform: translateZ(30px); /* Makes text pop out in 3D */
        }
      `}</style>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 text-indigo-700 p-4 rounded-full shadow-sm">
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

      {/* App Download QR Section */}
      <section className="py-12 bg-gradient-to-r from-indigo-50 to-blue-50 border-y border-indigo-100 relative z-20">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-left">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Mobile App Available
            </span>
            <h2 className="text-3xl font-black text-gray-900 mt-3 mb-4">
              Get the <span className="text-indigo-600">ClassWeb Mobile App</span>
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Scan the QR code with your phone camera or click the download button below to install our official app directly on your Android device. Track attendance, view grades, and manage fees instantly!
            </p>
            <a 
              href="/unique-coaching-class.apk" 
              download 
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all transform active:scale-95"
            >
              <QrCode size={18} />
              Download APK Directly
            </a>
          </div>
          
          <div className="shrink-0 bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center">
            <div className="p-2 border-2 border-indigo-100 rounded-xl bg-gray-50 mb-3">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(window.location.origin + '/unique-coaching-class.apk')}`} 
                alt="Scan to Download App"
                className="w-40 h-40"
              />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Scan to Download APK
            </span>
          </div>
        </div>
      </section>

      {/* --- NEW: 3D AUTO-SCROLLING HALL OF FAME --- */}
      {achievements.length > 0 && (
        <section className="py-16 bg-gray-900 relative overflow-hidden border-t-4 border-indigo-600">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500 blur-3xl"></div>
            <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-blue-500 blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 flex items-center justify-center gap-3">
              <Award className="text-yellow-400" size={36} /> 
              Hall of Fame 
              <Award className="text-yellow-400" size={36} />
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Celebrating the exceptional academic milestones and achievements of our brilliant students.
            </p>
          </div>

          {/* 3D Scrolling Track */}
          <div className="w-full overflow-hidden py-8 px-4 relative z-10">
            {/* Gradient Fades for the edges */}
            <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-gray-900 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-gray-900 to-transparent z-20 pointer-events-none"></div>
            
            <div className="animate-scroll gap-6 md:gap-8 px-4">
              {scrollingGallery.map((ach, idx) => (
                <div key={`${ach._id}-${idx}`} className="card-3d-wrapper shrink-0 w-72 md:w-80">
                  <div className="card-3d bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-xl h-full flex flex-col group relative">
                    
                    {/* Glowing border effect on hover */}
                    <div className="absolute inset-0 border-2 border-indigo-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    {/* Image Section */}
                    <div className="h-48 w-full bg-gray-800 relative overflow-hidden">
                      {ach.photos && ach.photos[0] ? (
                        <img 
                          src={ach.photos[0]} 
                          alt={ach.studentName} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <Award className="text-gray-600" size={48} />
                        </div>
                      )}
                      
                      {/* Top Badge */}
                      <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-extrabold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Star size={12} fill="currentColor" /> {ach.academicYear}
                      </div>
                    </div>

                    {/* Content Section (Pops out in 3D) */}
                    <div className="p-5 flex flex-col flex-grow relative card-content-3d">
                      <h3 className="text-xl font-black text-white mb-1 truncate">{ach.studentName}</h3>
                      <p className="text-indigo-300 font-bold text-sm mb-3">{ach.std} • {ach.batch}</p>
                      
                      <div className="mt-auto bg-white/5 p-3 rounded-xl border border-white/10">
                        <p className="text-yellow-400 font-black text-lg mb-1">{ach.result}</p>
                        {ach.subjectMarks && (
                          <p className="text-gray-300 text-xs line-clamp-2">{ach.subjectMarks}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <div className="bg-white py-16 border-t border-gray-100 relative z-20">
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
      <footer className="bg-gray-900 py-8 text-center text-gray-400 text-sm border-t border-gray-800">
        <p>&copy; {new Date().getFullYear()} Unique Coaching Class. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;