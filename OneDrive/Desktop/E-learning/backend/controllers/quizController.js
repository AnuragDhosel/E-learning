const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const Course = require('../models/Course');

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private/Teacher
const createQuiz = async (req, res) => {
    try {
        const { courseId, title, description, timeLimit } = req.body;

        if (!courseId || !title) {
            return res.status(400).json({ message: 'Please provide course ID and title' });
        }

        // Verify course exists and user is the teacher
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to create quizzes for this course' });
        }

        const quiz = await Quiz.create({
            course: courseId,
            title,
            description,
            timeLimit,
        });

        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get quizzes by course
// @route   GET /api/quizzes/course/:courseId
// @access  Public
const getQuizzesByCourse = async (req, res) => {
    try {
        const quizzes = await Quiz.find({
            course: req.params.courseId,
            isPublished: true
        }).populate('course', 'title');
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get teacher's quizzes
// @route   GET /api/quizzes/my-quizzes
// @access  Private/Teacher
const getTeacherQuizzes = async (req, res) => {
    try {
        // Get teacher's courses
        const courses = await Course.find({ teacher: req.user._id });
        const courseIds = courses.map(course => course._id);

        // Get quizzes from those courses
        const quizzes = await Quiz.find({ course: { $in: courseIds } })
            .populate('course', 'title')
            .sort('-createdAt');

        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('course', 'title teacher');

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Get questions
        const questions = await Question.find({ quiz: quiz._id }).sort('order');

        // If student, hide correct answers
        if (req.user.role === 'student') {
            const questionsWithoutAnswers = questions.map(q => ({
                _id: q._id,
                text: q.text,
                options: q.options,
                order: q.order,
            }));
            return res.json({ ...quiz.toObject(), questions: questionsWithoutAnswers });
        }

        res.json({ ...quiz.toObject(), questions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private/Teacher
const updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('course');

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check if user is the teacher of the course
        if (quiz.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this quiz' });
        }

        const { title, description, timeLimit, isPublished } = req.body;

        quiz.title = title || quiz.title;
        quiz.description = description !== undefined ? description : quiz.description;
        quiz.timeLimit = timeLimit !== undefined ? timeLimit : quiz.timeLimit;
        quiz.isPublished = isPublished !== undefined ? isPublished : quiz.isPublished;

        const updatedQuiz = await quiz.save();
        res.json(updatedQuiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private/Teacher
const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('course');

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check if user is the teacher of the course
        if (quiz.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this quiz' });
        }

        await quiz.deleteOne();
        res.json({ message: 'Quiz removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add question to quiz
// @route   POST /api/quizzes/:id/questions
// @access  Private/Teacher
const addQuestion = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('course');

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Check if user is the teacher of the course
        if (quiz.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to add questions to this quiz' });
        }

        const { text, options, correctIndex, order } = req.body;

        if (!text || !options || options.length !== 4 || correctIndex === undefined) {
            return res.status(400).json({ message: 'Please provide text, 4 options, and correct index' });
        }

        const question = await Question.create({
            quiz: req.params.id,
            text,
            options,
            correctIndex,
            order,
        });

        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/Teacher
const updateQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id).populate({
            path: 'quiz',
            populate: { path: 'course' }
        });

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check if user is the teacher of the course
        if (question.quiz.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this question' });
        }

        const { text, options, correctIndex, order } = req.body;

        question.text = text || question.text;
        question.options = options || question.options;
        question.correctIndex = correctIndex !== undefined ? correctIndex : question.correctIndex;
        question.order = order !== undefined ? order : question.order;

        const updatedQuestion = await question.save();
        res.json(updatedQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private/Teacher
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id).populate({
            path: 'quiz',
            populate: { path: 'course' }
        });

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check if user is the teacher of the course
        if (question.quiz.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this question' });
        }

        await question.deleteOne();
        res.json({ message: 'Question removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:id/attempt
// @access  Private/Student
const submitQuizAttempt = async (req, res) => {
    try {
        const { answers } = req.body; // Array of { questionId, selectedIndex }

        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        if (!quiz.isPublished) {
            return res.status(400).json({ message: 'Quiz is not published' });
        }

        // Get all questions
        const questions = await Question.find({ quiz: req.params.id });

        // Calculate score
        let score = 0;
        const results = [];

        answers.forEach(answer => {
            const question = questions.find(q => q._id.toString() === answer.questionId);
            if (question && question.correctIndex === answer.selectedIndex) {
                score++;
            }
            results.push({
                questionId: answer.questionId,
                selectedIndex: answer.selectedIndex,
                correctIndex: question ? question.correctIndex : null,
                isCorrect: question ? question.correctIndex === answer.selectedIndex : false,
            });
        });

        // Create quiz attempt
        const attempt = await QuizAttempt.create({
            quiz: req.params.id,
            student: req.user._id,
            answers,
            score,
        });

        res.status(201).json({
            attempt,
            score,
            totalQuestions: questions.length,
            results,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get quiz attempts/results
// @route   GET /api/quizzes/:id/attempts
// @access  Private
const getQuizAttempts = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('course');

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // If student, get only their attempts
        if (req.user.role === 'student') {
            const attempts = await QuizAttempt.find({
                quiz: req.params.id,
                student: req.user._id,
            }).sort('-attemptedAt');
            return res.json(attempts);
        }

        // If teacher, verify they own the course
        if (quiz.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view attempts' });
        }

        // Get all attempts for this quiz
        const attempts = await QuizAttempt.find({ quiz: req.params.id })
            .populate('student', 'name email')
            .sort('-attemptedAt');

        res.json(attempts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all quizzes for courses the student is enrolled in
// @route   GET /api/quizzes/my-attempts
// @access  Private/Student
const getStudentQuizzes = async (req, res) => {
    try {
        // Find all enrollments for the student
        const Enrollment = require('../models/Enrollment');
        const enrollments = await Enrollment.find({ student: req.user._id });

        if (!enrollments.length) {
            return res.json([]);
        }

        const courseIds = enrollments.map(enrollment => enrollment.course);

        // Find quizzes for these courses
        const quizzes = await Quiz.find({
            course: { $in: courseIds },
            isPublished: true
        }).populate('course', 'title');

        // Find attempts for these quizzes by this student
        const attempts = await QuizAttempt.find({
            student: req.user._id,
            quiz: { $in: quizzes.map(q => q._id) }
        });

        // Map quizzes to include attempt info
        const quizzesWithStatus = quizzes.map(quiz => {
            const attempt = attempts.find(a => a.quiz.toString() === quiz._id.toString());
            return {
                ...quiz.toObject(),
                attempted: !!attempt,
                score: attempt ? attempt.score : null,
                attemptId: attempt ? attempt._id : null
            };
        });

        res.json(quizzesWithStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
};
