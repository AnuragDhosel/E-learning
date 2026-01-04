const express = require('express');
const router = express.Router();
const {
    createLecture,
    getLecturesByCourse,
    getLectureById,
    updateLecture,
    deleteLecture,
} = require('../controllers/lectureController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireTeacher } = require('../middleware/roleMiddleware');

router.route('/')
    .post(requireAuth, requireTeacher, createLecture);

router.get('/course/:courseId', getLecturesByCourse);

router.route('/:id')
    .get(getLectureById)
    .put(requireAuth, requireTeacher, updateLecture)
    .delete(requireAuth, requireTeacher, deleteLecture);

module.exports = router;
