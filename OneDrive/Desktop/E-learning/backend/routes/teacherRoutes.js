const express = require('express');
const router = express.Router();
const { getTeacherStudents } = require('../controllers/teacherController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireTeacher } = require('../middleware/roleMiddleware');

router.get('/students', requireAuth, requireTeacher, getTeacherStudents);

module.exports = router;
