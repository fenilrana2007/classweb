// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';

// Import Components & Pages
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // <-- WE ADDED THIS IMPORT!
import CreateCourse from './pages/CreateCourse';
// Import it at the top
import ManageSchedule from './pages/ManageSchedule';

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
            <Route path="/register" element={<Register />} />
            
            {/* Now it loads your actual Dashboard.jsx file! */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-course" element={<CreateCourse />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/manage-schedule" element={<ManageSchedule />} />

          </Routes>
          
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;