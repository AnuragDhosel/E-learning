const Lecture = require('../models/Lecture');
const Course = require('../models/Course');

// @desc    Create a new lecture
// @route   POST /api/lectures
// @access  Private/Teacher
const createLecture = async (req, res) => {
    try {
        const { courseId, title, description, videoUrl, resources, notes, order } = req.body;

        if (!courseId || !title) {
            return res.status(400).json({ message: 'Please provide course ID and title' });
        }

        // Verify course exists and user is the teacher
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to add lectures to this course' });
        }

        const lecture = await Lecture.create({
            course: courseId,
            title,
            description,
            videoUrl,
            resources,
            notes,
            order,
        });

        res.status(201).json(lecture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get lectures by course
// @route   GET /api/lectures/course/:courseId
// @access  Public
const getLecturesByCourse = async (req, res) => {
    try {
        const lectures = await Lecture.find({ course: req.params.courseId }).sort('order');
        res.json(lectures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get lecture by ID
// @route   GET /api/lectures/:id
// @access  Public
const getLectureById = async (req, res) => {
    try {
        const lecture = await Lecture.findById(req.params.id).populate('course', 'title teacher');

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        res.json(lecture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update lecture
// @route   PUT /api/lectures/:id
// @access  Private/Teacher
const updateLecture = async (req, res) => {
    try {
        const lecture = await Lecture.findById(req.params.id).populate('course');

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        // Check if user is the teacher of the course
        if (lecture.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this lecture' });
        }

        const { title, description, videoUrl, resources, notes, order } = req.body;

        lecture.title = title || lecture.title;
        lecture.description = description !== undefined ? description : lecture.description;
        lecture.videoUrl = videoUrl !== undefined ? videoUrl : lecture.videoUrl;
        lecture.resources = resources !== undefined ? resources : lecture.resources;
        lecture.notes = notes !== undefined ? notes : lecture.notes;
        lecture.order = order !== undefined ? order : lecture.order;

        const updatedLecture = await lecture.save();
        res.json(updatedLecture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete lecture
// @route   DELETE /api/lectures/:id
// @access  Private/Teacher
const deleteLecture = async (req, res) => {
    try {
        const lecture = await Lecture.findById(req.params.id).populate('course');

        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }

        // Check if user is the teacher of the course
        if (lecture.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this lecture' });
        }

        await lecture.deleteOne();
        res.json({ message: 'Lecture removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createLecture,
    getLecturesByCourse,
    getLectureById,
    updateLecture,
    deleteLecture,
};
