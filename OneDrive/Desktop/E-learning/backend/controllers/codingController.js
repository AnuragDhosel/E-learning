const CodingProblem = require('../models/CodingProblem');
const Course = require('../models/Course');

// @desc    Create a new coding problem
// @route   POST /api/coding-problems
// @access  Private/Teacher
const createCodingProblem = async (req, res) => {
    try {
        const { courseId, title, difficulty, statement, inputDescription, outputDescription, samples, constraints } = req.body;

        if (!title || !statement) {
            return res.status(400).json({ message: 'Please provide title and statement' });
        }

        // If courseId is provided, verify user is the teacher
        if (courseId) {
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            if (course.teacher.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to create problems for this course' });
            }
        }

        const problem = await CodingProblem.create({
            course: courseId || null,
            title,
            difficulty,
            statement,
            inputDescription,
            outputDescription,
            samples,
            constraints,
        });

        res.status(201).json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all coding problems
// @route   GET /api/coding-problems
// @access  Public
const getCodingProblems = async (req, res) => {
    try {
        const { courseId, difficulty } = req.query;

        let filter = {};
        if (courseId) filter.course = courseId;
        if (difficulty) filter.difficulty = difficulty;

        const problems = await CodingProblem.find(filter)
            .populate('course', 'title')
            .sort('-createdAt');

        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get coding problem by ID
// @route   GET /api/coding-problems/:id
// @access  Public
const getCodingProblemById = async (req, res) => {
    try {
        const problem = await CodingProblem.findById(req.params.id)
            .populate('course', 'title teacher');

        if (!problem) {
            return res.status(404).json({ message: 'Coding problem not found' });
        }

        res.json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update coding problem
// @route   PUT /api/coding-problems/:id
// @access  Private/Teacher
const updateCodingProblem = async (req, res) => {
    try {
        const problem = await CodingProblem.findById(req.params.id).populate('course');

        if (!problem) {
            return res.status(404).json({ message: 'Coding problem not found' });
        }

        // Check if user is the teacher (if problem is linked to a course)
        if (problem.course && problem.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this problem' });
        }

        const { title, difficulty, statement, inputDescription, outputDescription, samples, constraints } = req.body;

        problem.title = title || problem.title;
        problem.difficulty = difficulty || problem.difficulty;
        problem.statement = statement || problem.statement;
        problem.inputDescription = inputDescription !== undefined ? inputDescription : problem.inputDescription;
        problem.outputDescription = outputDescription !== undefined ? outputDescription : problem.outputDescription;
        problem.samples = samples !== undefined ? samples : problem.samples;
        problem.constraints = constraints !== undefined ? constraints : problem.constraints;

        const updatedProblem = await problem.save();
        res.json(updatedProblem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete coding problem
// @route   DELETE /api/coding-problems/:id
// @access  Private/Teacher
const deleteCodingProblem = async (req, res) => {
    try {
        const problem = await CodingProblem.findById(req.params.id).populate('course');

        if (!problem) {
            return res.status(404).json({ message: 'Coding problem not found' });
        }

        // Check if user is the teacher (if problem is linked to a course)
        if (problem.course && problem.course.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this problem' });
        }

        await problem.deleteOne();
        res.json({ message: 'Coding problem removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit code (mock evaluation)
// @route   POST /api/coding-problems/:id/submit
// @access  Private
const submitCode = async (req, res) => {
    try {
        const { code, language } = req.body;

        if (!code) {
            return res.status(400).json({ message: 'Please provide code' });
        }

        const problem = await CodingProblem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ message: 'Coding problem not found' });
        }

        // Mock evaluation - just check if code is not empty
        const isPassed = code.trim().length > 10; // Simple mock logic

        res.json({
            status: isPassed ? 'Passed' : 'Failed',
            message: isPassed
                ? 'All test cases passed! Great job!'
                : 'Some test cases failed. Please review your code and try again.',
            testCasesPassed: isPassed ? problem.samples.length : 0,
            totalTestCases: problem.samples.length,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCodingProblem,
    getCodingProblems,
    getCodingProblemById,
    updateCodingProblem,
    deleteCodingProblem,
    submitCode,
};
