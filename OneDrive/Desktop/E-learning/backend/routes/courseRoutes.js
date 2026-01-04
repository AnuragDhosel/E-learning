const express = require('express');
const router = express.Router();
const {
    createCourse,
    getCourses,
    getTeacherCourses,
    getEnrolledCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollCourse,
    unenrollCourse,
    getEnrollmentStatus,
} = require('../controllers/courseController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireTeacher, requireStudent } = require('../middleware/roleMiddleware');

router.route('/')
    .get(getCourses)
    .post(requireAuth, requireTeacher, createCourse);

router.get('/my-courses', requireAuth, requireTeacher, getTeacherCourses);
router.get('/enrolled', requireAuth, requireStudent, getEnrolledCourses);

router.route('/:id')
    .get(getCourseById)
    .put(requireAuth, requireTeacher, updateCourse)
    .delete(requireAuth, requireTeacher, deleteCourse);

router.route('/:id/enroll')
    .post(requireAuth, requireStudent, enrollCourse)
    .delete(requireAuth, requireStudent, unenrollCourse);

router.get('/:id/enrollment-status', requireAuth, getEnrollmentStatus);

module.exports = router;
