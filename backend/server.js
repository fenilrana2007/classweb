
// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');
// // Load environment variables
// dotenv.config();

// // Connect to Database
// connectDB();

// const app = express();

// // --- MIDDLEWARES ---
// app.use(cors({
//     origin: '*', // Allows requests from anywhere during testing
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'] // Explicitly allowing all methods
// }));

// app.use(express.json()); // Parses incoming JSON requests

// // --- ROUTES ---

// // 1. Authentication (Login/Register)
// app.use('/api/auth', require('./routes/authRoutes'));

// // 2. Admin Specific Routes (Staff management, Stats)
// app.use('/api/admin', require('./routes/adminRoutes'));

// // 3. Teacher Specific Routes (Attendance, Teacher Stats)
// app.use('/api/teacher', require('./routes/teacherRoutes'));

// // 4. Student Management (Add, Get, Export, Delete All - Shared by Admin/Teacher)
// // This is used by the StudentsTab.jsx component
// app.use('/api/students', require('./routes/studentRoutes'));

// // 5. Student Portal Dashboard (Personal Attendance, Notices)
// // This is used by the StudentPortal.jsx page
// app.use('/api/student', require('./routes/studentRoutes'));

// // --- HEALTH CHECK ---
// app.get('/api/health', (req, res) => {
//     res.status(200).json({ message: 'LMS API is running smoothly.' });
// });
// app.use('/api/exams', require('./routes/examRoutes'));
// app.use('/api/fees', require('./routes/feeRoutes'));

// // Add these to an appropriate route file (e.g., backend/routes/adminRoutes.js or a dedicated achievementRoutes.js)

// // Add these to your router:
// app.use('/api/achievements', require('./routes/achievementRoutes'));

// // --- SERVER START ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/student', require('./routes/studentRoutes')); // Student portal: /api/student/dashboard, /api/student/class-logs
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes')); // Registered here

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'LMS API is running.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});