require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const lectureRoutes = require('./routes/lectureRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const quizRoutes = require('./routes/quizRoutes');
const codingRoutes = require('./routes/codingRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/coding-problems', codingRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/courses/:courseId/notes', require('./routes/noteRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to E-learning API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
