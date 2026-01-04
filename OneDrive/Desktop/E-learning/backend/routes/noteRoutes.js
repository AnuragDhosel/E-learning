const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params to access courseId
const { protect, teacher } = require('../middleware/authMiddleware');
const { getCourseNotes, addNote, deleteNote, getAllStudentNotes } = require('../controllers/noteController');

router.get('/my-notes', protect, getAllStudentNotes);

router.route('/')
    .get(protect, getCourseNotes)
    .post(protect, teacher, addNote);

router.route('/:id')
    .delete(protect, teacher, deleteNote);

module.exports = router;
