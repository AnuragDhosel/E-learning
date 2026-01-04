const express = require('express');
const router = express.Router();
const {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement,
} = require('../controllers/announcementController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireTeacher } = require('../middleware/roleMiddleware');

router.route('/')
    .get(requireAuth, getAnnouncements)
    .post(requireAuth, requireTeacher, createAnnouncement);

router.route('/:id')
    .get(requireAuth, getAnnouncementById)
    .put(requireAuth, requireTeacher, updateAnnouncement)
    .delete(requireAuth, requireTeacher, deleteAnnouncement);

module.exports = router;
