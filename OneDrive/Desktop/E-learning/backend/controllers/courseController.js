const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Teacher
const createCourse = async (req, res) => {
    try {
        const { title, description, department, semester, tags } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Please provide title and description' });
        }

        const course = await Course.create({
            title,
            description,
            department,
            semester,
            tags,
            teacher: req.user._id,
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .populate('teacher', 'name email')
            .sort('-createdAt');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get teacher's courses
// @route   GET /api/courses/my-courses
// @access  Private/Teacher
const getTeacherCourses = async (req, res) => {
    try {
        const courses = await Course.find({ teacher: req.user._id })
            .populate('teacher', 'name email')
            .sort('-createdAt');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student's enrolled courses
// @route   GET /api/courses/enrolled
// @access  Private/Student
const getEnrolledCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user._id })
            .populate({
                path: 'course',
                populate: { path: 'teacher', select: 'name email' }
            })
            .sort('-enrolledAt');

        const courses = enrollments.map(enrollment => enrollment.course);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('teacher', 'name email bio department');

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Teacher
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the teacher of this course
        if (course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this course' });
        }

        const { title, description, department, semester, tags, isPublished } = req.body;

        course.title = title || course.title;
        course.description = description || course.description;
        course.department = department !== undefined ? department : course.department;
        course.semester = semester !== undefined ? semester : course.semester;
        course.tags = tags !== undefined ? tags : course.tags;
        course.isPublished = isPublished !== undefined ? isPublished : course.isPublished;

        const updatedCourse = await course.save();
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Teacher
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user is the teacher of this course
        if (course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this course' });
        }

        await course.deleteOne();
        res.json({ message: 'Course removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
const enrollCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (!course.isPublished) {
            return res.status(400).json({ message: 'Cannot enroll in unpublished course' });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            student: req.user._id,
            course: req.params.id,
        });

        if (existingEnrollment) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        const enrollment = await Enrollment.create({
            student: req.user._id,
            course: req.params.id,
        });

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Unenroll from a course
// @route   DELETE /api/courses/:id/enroll
// @access  Private/Student
const unenrollCourse = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({
            student: req.user._id,
            course: req.params.id,
        });

        if (!enrollment) {
            return res.status(404).json({ message: 'Not enrolled in this course' });
        }

        await enrollment.deleteOne();
        res.json({ message: 'Unenrolled from course' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check enrollment status
// @route   GET /api/courses/:id/enrollment-status
// @access  Private
const getEnrollmentStatus = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({
            student: req.user._id,
            course: req.params.id,
        });

        res.json({ isEnrolled: !!enrollment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
};
