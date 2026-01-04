const express = require('express');
const router = express.Router();
const {
    createQuiz,
    getQuizzesByCourse,
    getTeacherQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    submitQuizAttempt,
    getQuizAttempts,
    getStudentQuizzes,
} = require('../controllers/quizController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireTeacher, requireStudent } = require('../middleware/roleMiddleware');

router.route('/')
    .post(requireAuth, requireTeacher, createQuiz);

router.get('/course/:courseId', getQuizzesByCourse);
router.get('/my-quizzes', requireAuth, requireTeacher, getTeacherQuizzes);
router.get('/my-attempts', requireAuth, getStudentQuizzes);

router.route('/:id')
    .get(requireAuth, getQuizById)
    .put(requireAuth, requireTeacher, updateQuiz)
    .delete(requireAuth, requireTeacher, deleteQuiz);

router.post('/:id/questions', requireAuth, requireTeacher, addQuestion);
router.post('/:id/attempt', requireAuth, requireStudent, submitQuizAttempt);
router.get('/:id/attempts', requireAuth, getQuizAttempts);

// Question routes
router.route('/questions/:id')
    .put(requireAuth, requireTeacher, updateQuestion)
    .delete(requireAuth, requireTeacher, deleteQuestion);

module.exports = router;
