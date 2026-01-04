const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
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
    content: {
        type: String, // Can be text content or description
        default: '',
    },
    fileUrl: {
        type: String, // URL to PDF or external link
        default: '',
    },
    type: {
        type: String,
        enum: ['text', 'pdf', 'link'],
        default: 'text',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Note', noteSchema);
