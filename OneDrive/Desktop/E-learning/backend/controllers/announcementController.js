const Announcement = require('../models/Announcement');

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Teacher
const createAnnouncement = async (req, res) => {
    try {
        const { title, message, audience, courseId } = req.body;

        if (!title || !message) {
            return res.status(400).json({ message: 'Please provide title and message' });
        }

        const announcement = await Announcement.create({
            title,
            message,
            audience,
            course: courseId || null,
            createdBy: req.user._id,
        });

        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get announcements
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = async (req, res) => {
    try {
        const { courseId } = req.query;

        let filter = {};

        // Filter by audience based on role
        if (req.user.role === 'student') {
            filter.$or = [
                { audience: 'all' },
                { audience: 'students' },
            ];
        } else if (req.user.role === 'teacher') {
            filter.$or = [
                { audience: 'all' },
                { audience: 'teachers' },
            ];
        }

        // If courseId is provided, include course-specific announcements
        if (courseId) {
            filter.$or.push({ audience: 'course', course: courseId });
        }

        const announcements = await Announcement.find(filter)
            .populate('createdBy', 'name')
            .populate('course', 'title')
            .sort('-createdAt')
            .limit(50);

        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get announcement by ID
// @route   GET /api/announcements/:id
// @access  Private
const getAnnouncementById = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('course', 'title');

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.json(announcement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/Teacher
const updateAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        // Check if user created this announcement
        if (announcement.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this announcement' });
        }

        const { title, message, audience, courseId } = req.body;

        announcement.title = title || announcement.title;
        announcement.message = message || announcement.message;
        announcement.audience = audience || announcement.audience;
        announcement.course = courseId !== undefined ? courseId : announcement.course;

        const updatedAnnouncement = await announcement.save();
        res.json(updatedAnnouncement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Teacher
const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        // Check if user created this announcement
        if (announcement.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this announcement' });
        }

        await announcement.deleteOne();
        res.json({ message: 'Announcement removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
};
