const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private/Teacher
const createAssignment = async (req, res) => {
    try {
        const { courseId, title, description, dueDate, maxMarks } = req.body;

        if (!courseId || !title || !description || !dueDate) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Verify course exists and user is the teacher
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to create assignments for this course' });
        }

        const assignment = await Assignment.create({
            course: courseId,
            title,
            description,
            dueDate,
            maxMarks,
        });

        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get assignments by course
// @route   GET /api/assignments/course/:courseId
// @access  Public
const getAssignmentsByCourse = async (req, res) => {
    try {
        const assignments = await Assignment.find({ course: req.params.courseId })
            .populate('course', 'title')
            .sort('-createdAt');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all assignments for student (from enrolled courses)
// @route   GET /api/assignments/my-assignments
// @access  Private/Student
const getStudentAssignments = async (req, res) => {
    try {
        // Get enrolled courses
        const enrollments = await Enrollment.find({ student: req.user._id });
        const courseIds = enrollments.map(enrollment => enrollment.course);

        // Get assignments from enrolled courses
        const assignments = await Assignment.find({ course: { $in: courseIds } })
            .populate('course', 'title')
            .sort('-dueDate');

        // Get submission status for each assignment
        const assignmentsWithStatus = await Promise.all(
            assignments.map(async (assignment) => {
                const submission = await Submission.findOne({
                    assignment: assignment._id,
                    student: req.user._id,
                });

                return {
                    ...assignment.toObject(),
                    submission: submission || null,
                };
            })
        );

        res.json(assignmentsWithStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all assignments for teacher (from their courses)
// @route   GET /api/assignments/my-assignments-teacher
// @access  Private/Teacher
const getTeacherAssignments = async (req, res) => {
    try {
        // Get teacher's courses
        const courses = await Course.find({ teacher: req.user._id });
        const courseIds = courses.map(course => course._id);

        // Get assignments from those courses
        const assignments = await Assignment.find({ course: { $in: courseIds } })
            .populate('course', 'title')
            .sort('-createdAt');

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get assignment by ID
// @route   GET /api/assignments/:id
// @access  Private
const getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate('course', 'title teacher');

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // If student, get their submission
        if (req.user.role === 'student') {
            const submission = await Submission.findOne({
                assignment: assignment._id,
                student: req.user._id,
            });

            return res.json({
                ...assignment.toObject(),
                submission: submission || null,
            });
        }

        res.json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private/Teacher
const updateAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id).populate('course');

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if user is the teacher of the course
        if (assignment.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this assignment' });
        }

        const { title, description, dueDate, maxMarks } = req.body;

        assignment.title = title || assignment.title;
        assignment.description = description || assignment.description;
        assignment.dueDate = dueDate || assignment.dueDate;
        assignment.maxMarks = maxMarks !== undefined ? maxMarks : assignment.maxMarks;

        const updatedAssignment = await assignment.save();
        res.json(updatedAssignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private/Teacher
const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id).populate('course');

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if user is the teacher of the course
        if (assignment.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this assignment' });
        }

        await assignment.deleteOne();
        res.json({ message: 'Assignment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit assignment
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
const submitAssignment = async (req, res) => {
    try {
        const { content, fileUrl } = req.body;

        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if already submitted
        let submission = await Submission.findOne({
            assignment: req.params.id,
            student: req.user._id,
        });

        if (submission) {
            // Update existing submission
            submission.content = content || submission.content;
            submission.fileUrl = fileUrl || submission.fileUrl;
            submission.submittedAt = Date.now();
            await submission.save();
        } else {
            // Create new submission
            submission = await Submission.create({
                assignment: req.params.id,
                student: req.user._id,
                content,
                fileUrl,
            });
        }

        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get submissions for an assignment
// @route   GET /api/assignments/:id/submissions
// @access  Private/Teacher
const getSubmissions = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id).populate('course');

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if user is the teacher of the course
        if (assignment.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view submissions' });
        }

        const submissions = await Submission.find({ assignment: req.params.id })
            .populate('student', 'name email')
            .sort('-submittedAt');

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Grade a submission
// @route   PUT /api/submissions/:id/grade
// @access  Private/Teacher
const gradeSubmission = async (req, res) => {
    try {
        const { marks, feedback } = req.body;

        const submission = await Submission.findById(req.params.id)
            .populate({
                path: 'assignment',
                populate: { path: 'course' }
            });

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Check if user is the teacher of the course
        if (submission.assignment.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to grade this submission' });
        }

        submission.marks = marks !== undefined ? marks : submission.marks;
        submission.feedback = feedback !== undefined ? feedback : submission.feedback;
        submission.gradedAt = Date.now();

        const updatedSubmission = await submission.save();
        res.json(updatedSubmission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
};
