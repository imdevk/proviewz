const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      console.error('No token provided');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decodedData = jwt.verify(token, 'secret');
    req.userId = decodedData.id;

    const user = await User.findById(req.userId);
    if (!user) {
      console.error('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = auth;