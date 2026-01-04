const express = require('express');
const router = express.Router();
const { protect, teacher } = require('../middleware/authMiddleware');
const { getTeacherStats, getStudentStats, getStudentPerformance } = require('../controllers/dashboardController');

router.get('/teacher/stats', protect, teacher, getTeacherStats);
router.get('/student/stats', protect, getStudentStats);
router.get('/teacher/analytics', protect, teacher, getStudentPerformance);

module.exports = router;
