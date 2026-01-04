const Note = require('../models/Note');
const Course = require('../models/Course');

// @desc    Get all notes for a course
// @route   GET /api/courses/:courseId/notes
// @access  Private
const getCourseNotes = async (req, res) => {
    try {
        const notes = await Note.find({ course: req.params.courseId });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a note to a course
// @route   POST /api/courses/:courseId/notes
// @access  Private/Teacher
const addNote = async (req, res) => {
    try {
        const { title, content, fileUrl, type } = req.body;
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the course teacher
        if (course.teacher.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to add notes to this course' });
        }

        const note = await Note.create({
            course: req.params.courseId,
            title,
            content,
            fileUrl,
            type
        });

        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private/Teacher
const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const course = await Course.findById(note.course);

        // Check if user is the course teacher
        if (course.teacher.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this note' });
        }

        await note.deleteOne();
        res.json({ message: 'Note removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all notes for courses the student is enrolled in
// @route   GET /api/notes/my-notes
// @access  Private/Student
const getAllStudentNotes = async (req, res) => {
    try {
        // Find all enrollments for the student
        const Enrollment = require('../models/Enrollment');
        const enrollments = await Enrollment.find({ student: req.user._id });

        if (!enrollments.length) {
            return res.json([]);
        }

        const courseIds = enrollments.map(enrollment => enrollment.course);

        // Find notes for these courses
        const notes = await Note.find({ course: { $in: courseIds } })
            .populate('course', 'title')
            .sort('-createdAt');

        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCourseNotes,
    addNote,
    deleteNote,
    getAllStudentNotes
};
