const express = require('express');
const router = express.Router();
const {
    createCodingProblem,
    getCodingProblems,
    getCodingProblemById,
    updateCodingProblem,
    deleteCodingProblem,
    submitCode,
} = require('../controllers/codingController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireTeacher } = require('../middleware/roleMiddleware');

router.route('/')
    .get(getCodingProblems)
    .post(requireAuth, requireTeacher, createCodingProblem);

router.route('/:id')
    .get(getCodingProblemById)
    .put(requireAuth, requireTeacher, updateCodingProblem)
    .delete(requireAuth, requireTeacher, deleteCodingProblem);

router.post('/:id/submit', requireAuth, submitCode);

module.exports = router;
