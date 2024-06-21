const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');
const path = require("path");
const mongoose = require('mongoose');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const registerUser = async (req, res) => {
    const { name, email, password, occupation, location } = req.body;
    const profileImage = req.file ? req.file.path : null;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User with this email already exists.' });

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, password: hashedPassword, occupation, location, profileImage });

        await newUser.save();

        const token = jwt.sign({ email: newUser.email, id: newUser._id }, 'secret', { expiresIn: '1h' });

        res.status(201).json({ result: newUser, token });
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, occupation, location } = req.body;
    const profileImage = req.file ? req.file.path : null;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.userId !== user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (password) {
            user.password = await bcrypt.hash(password, 12);
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.occupation = occupation || user.occupation;
        user.location = location || user.location;
        if (profileImage) {
            user.profileImage = profileImage;
        }

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error in updateUser:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ email: user.email, id: user._id }, 'secret', { expiresIn: '1h' });

        res.status(200).json({ result: user, token });
    } catch (error) {
        console.error('Error in loginUser', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        let userId = id;
        if (id === 'me') {
            if (!req.userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            userId = req.userId;
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        console.error('Error in getUser:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};


const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.userId !== user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await user.deleteOne();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};


module.exports = { registerUser, loginUser, updateUser, deleteUser, getUser, getCurrentUser, upload };