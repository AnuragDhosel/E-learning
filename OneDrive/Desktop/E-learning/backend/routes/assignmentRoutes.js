const express = require('express');
const router = express.Router();
const {
    createAssignment,
    getAssignmentsByCourse,
    getStudentAssignments,
    getTeacherAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    getSubmissions,
    gradeSubmission,
} = require('../controllers/assignmentController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireTeacher, requireStudent } = require('../middleware/roleMiddleware');

router.route('/')
    .post(requireAuth, requireTeacher, createAssignment);

router.get('/course/:courseId', getAssignmentsByCourse);
router.get('/my-assignments', requireAuth, requireStudent, getStudentAssignments);
router.get('/my-assignments-teacher', requireAuth, requireTeacher, getTeacherAssignments);

router.route('/:id')
    .get(requireAuth, getAssignmentById)
    .put(requireAuth, requireTeacher, updateAssignment)
    .delete(requireAuth, requireTeacher, deleteAssignment);

router.post('/:id/submit', requireAuth, requireStudent, submitAssignment);
router.get('/:id/submissions', requireAuth, requireTeacher, getSubmissions);

// Grade submission
router.put('/submissions/:id/grade', requireAuth, requireTeacher, gradeSubmission);

module.exports = router;
