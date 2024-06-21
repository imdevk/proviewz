const Notification = require('../models/Notification');

const createNotification = async (recipient, sender, type, message, postId = null, commentId = null) => {
    const notification = new Notification({ recipient, sender, type, message, postId, commentId });
    await notification.save();
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { createNotification, getNotifications };
