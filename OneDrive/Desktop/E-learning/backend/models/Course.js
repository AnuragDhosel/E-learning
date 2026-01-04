const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        default: '',
    },
    semester: {
        type: String,
        default: '',
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    tags: [{
        type: String,
    }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Reverse populate with virtuals
courseSchema.virtual('notes', {
    ref: 'Note',
    localField: '_id',
    foreignField: 'course',
    justOne: false
});


module.exports = mongoose.model('Course', courseSchema);
