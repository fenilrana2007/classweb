// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Import Components & Pages
import Navbar from './components/Navbar';
import Login from './pages/Login';
import StudentPortal from './pages/StudentPortal';
import TeacherPortal from './pages/TeacherPortal';
import AdminPortal from './pages/AdminPortal';
// Add this route inside your <Routes> block:
// Temporary Home Page (We will build this later)
const Home = () => <div className="p-10 text-2xl font-bold text-center mt-20">Marketing Home Page</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900">
          
          <Navbar />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Now it loads your actual Dashboard.jsx file! */}
            <Route path="/dashboard" element={<StudentPortal />} />
            <Route path="/teacher" element={<TeacherPortal />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/admin" element={<AdminPortal />} />     {/* Admins */}
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;