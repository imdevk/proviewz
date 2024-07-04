const express = require('express');
const { getNotifications, markNotificationAsRead } = require('../controllers/notification');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getNotifications);
router.get('/:id/read', auth, markNotificationAsRead);

module.exports = router;
