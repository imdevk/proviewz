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

const registerUser = async (req, res, next) => {
    const { name, email, password, occupation, location, bio } = req.body;
    const profileImage = req.file ? req.file.path : 'uploads/defaultProfile.jpg';

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            occupation,
            location,
            profileImage,
            bio
        });

        await newUser.save();

        const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ result: newUser, token });
    } catch (error) {
        next(error);
    }
}

const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { name, email, password, occupation, location, bio, favoriteGadgets } = req.body;
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
        user.bio = bio || user.bio;
        user.favoriteGadgets = favoriteGadgets || user.favoriteGadgets;
        if (profileImage) {
            user.profileImage = profileImage;
        }

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ result: user, token });
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        let userId = id;
        if (id === 'me') {
            if (!req.userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            userId = req.userId;
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};


const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.userId !== user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await user.deleteOne();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};


module.exports = { registerUser, loginUser, updateUser, deleteUser, getUser, getCurrentUser, upload };