const mongoose = require('mongoose');

const codingProblemSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: null,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
    },
    statement: {
        type: String,
        required: true,
    },
    inputDescription: {
        type: String,
        default: '',
    },
    outputDescription: {
        type: String,
        default: '',
    },
    samples: [{
        input: String,
        output: String,
        explanation: String,
    }],
    constraints: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('CodingProblem', codingProblemSchema);
