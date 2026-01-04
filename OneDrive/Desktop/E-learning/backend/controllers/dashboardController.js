const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Submission = require('../models/Submission');
const QuizAttempt = require('../models/QuizAttempt');

// @desc    Get teacher dashboard stats
// @route   GET /api/dashboard/teacher/stats
// @access  Private/Teacher
const getTeacherStats = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'student' });
        const assignmentCount = await Assignment.countDocuments({}); // In real app, filter by teacher's courses
        const quizCount = await Quiz.countDocuments({}); // In real app, filter by teacher's courses

        res.json({
            studentCount,
            assignmentCount,
            quizCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student dashboard stats
// @route   GET /api/dashboard/student/stats
// @access  Private/Student
const getStudentStats = async (req, res) => {
    try {
        // Mock data for now, or calculate real stats
        // In a real app, we'd query Enrollment model
        const enrolledCoursesCount = 3; // Placeholder
        const pendingAssignmentsCount = 2; // Placeholder
        const completedQuizzesCount = 1; // Placeholder

        res.json({
            enrolledCoursesCount,
            pendingAssignmentsCount,
            completedQuizzesCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student performance analytics for teacher
// @route   GET /api/dashboard/teacher/analytics
// @access  Private/Teacher
const getStudentPerformance = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('name email');

        const performanceData = await Promise.all(students.map(async (student) => {
            const submissions = await Submission.find({ student: student._id });
            const quizAttempts = await QuizAttempt.find({ student: student._id });

            const assignmentScore = submissions.reduce((acc, sub) => acc + (sub.marks || 0), 0);
            const quizScore = quizAttempts.reduce((acc, quiz) => acc + (quiz.score || 0), 0);

            return {
                id: student._id,
                name: student.name,
                email: student.email,
                assignmentScore,
                quizScore,
                assignmentsSubmitted: submissions.length,
                quizzesAttempted: quizAttempts.length
            };
        }));

        res.json(performanceData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTeacherStats,
    getStudentStats,
    getStudentPerformance
};
