const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    videoUrl: {
        type: String,
        default: '',
    },
    resources: [{
        name: String,
        url: String,
    }],
    notes: {
        type: String,
        default: '',
    },
    order: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Lecture', lectureSchema);
