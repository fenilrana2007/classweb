const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.use('/api/auth', require('./routes/authRoutes')); // <-- ADDED THIS LINE

// Basic Route for testing
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'LMS API is running smoothly.' });
});
// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/teacher', require('./routes/teacherRoutes')); // <--- ADD THIS LINE
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/student', require('./routes/studentRoutes')); // <-- ADD THIS
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
