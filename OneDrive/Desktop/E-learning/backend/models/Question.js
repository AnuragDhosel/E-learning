const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    options: [{
        type: String,
        required: true,
    }],
    correctIndex: {
        type: Number,
        required: true,
        min: 0,
        max: 3,
    },
    order: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Question', questionSchema);
