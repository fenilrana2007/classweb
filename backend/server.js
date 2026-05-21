// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');

// // Load env variables
// dotenv.config();

// // Connect to Database
// connectDB();

// const app = express();

// // Middlewares
// app.use(cors({
//     origin: '*', // Using '*' allows requests from anywhere while you test. 
//     credentials: true
// }));
// app.use(express.json()); // Parses incoming JSON requests
// app.use('/api/students', require('./routes/studentRoutes'));
// // Routes
// app.use('/api/auth', require('./routes/authRoutes')); // <-- ADDED THIS LINE

// // Basic Route for testing
// app.get('/api/health', (req, res) => {
//     res.status(200).json({ message: 'LMS API is running smoothly.' });
// });
// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));

// app.use('/api/teacher', require('./routes/teacherRoutes')); // <--- ADD THIS LINE
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/student', require('./routes/studentRoutes')); // <-- ADD THIS
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { createAchievement, getAchievements, updateAchievement, deleteAchievement } = require('../controllers/achievementController');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- MIDDLEWARES ---
app.use(cors({
    origin: '*', // Allows requests from anywhere during testing
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'] // Explicitly allowing all methods
}));

app.use(express.json()); // Parses incoming JSON requests

// --- ROUTES ---

// 1. Authentication (Login/Register)
app.use('/api/auth', require('./routes/authRoutes'));

// 2. Admin Specific Routes (Staff management, Stats)
app.use('/api/admin', require('./routes/adminRoutes'));

// 3. Teacher Specific Routes (Attendance, Teacher Stats)
app.use('/api/teacher', require('./routes/teacherRoutes'));

// 4. Student Management (Add, Get, Export, Delete All - Shared by Admin/Teacher)
// This is used by the StudentsTab.jsx component
app.use('/api/students', require('./routes/studentRoutes'));

// 5. Student Portal Dashboard (Personal Attendance, Notices)
// This is used by the StudentPortal.jsx page
app.use('/api/student', require('./routes/studentRoutes'));

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'LMS API is running smoothly.' });
});
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));

// Add these to an appropriate route file (e.g., backend/routes/adminRoutes.js or a dedicated achievementRoutes.js)

// Add these to your router:
router.get('/achievements', protect, getAchievements); // Everyone can view
router.post('/achievements', protect, createAchievement); // Admin only (assuming your router is protected)
router.put('/achievements/:id', protect, updateAchievement); 
router.delete('/achievements/:id', protect, deleteAchievement);


// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});