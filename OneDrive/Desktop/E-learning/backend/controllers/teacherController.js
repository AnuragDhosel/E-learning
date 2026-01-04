const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Submission = require('../models/Submission');
const QuizAttempt = require('../models/QuizAttempt');

// @desc    Get all students enrolled in teacher's courses
// @route   GET /api/teachers/students
// @access  Private/Teacher
const getTeacherStudents = async (req, res) => {
    try {
        // Get teacher's courses
        const courses = await Course.find({ teacher: req.user._id });
        const courseIds = courses.map(course => course._id);

        // Get all enrollments for these courses
        const enrollments = await Enrollment.find({ course: { $in: courseIds } })
            .populate('student', 'name email')
            .populate('course', 'title');

        // Get unique students
        const studentIds = [...new Set(enrollments.map(e => e.student._id.toString()))];

        // Get student details with stats
        const studentsWithStats = await Promise.all(
            studentIds.map(async (studentId) => {
                const student = await User.findById(studentId).select('name email');

                // Count courses enrolled
                const coursesEnrolled = enrollments.filter(
                    e => e.student._id.toString() === studentId
                ).length;

                // Count assignments submitted
                const assignmentsSubmitted = await Submission.countDocuments({
                    student: studentId
                });

                // Count quizzes attempted
                const quizzesAttempted = await QuizAttempt.countDocuments({
                    student: studentId
                });

                return {
                    ...student.toObject(),
                    coursesEnrolled,
                    assignmentsSubmitted,
                    quizzesAttempted
                };
            })
        );

        res.json(studentsWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTeacherStudents
};
