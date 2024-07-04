const Post = require('../models/Post');
const { createNotification } = require('./notification');
const multer = require('multer')
const path = require('path');
const categories = require('../config/categories');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Create Post
const createPost = async (req, res, next) => {
    const { title, description, category } = req.body;
    const pros = JSON.parse(req.body.pros || '[]');
    const cons = JSON.parse(req.body.cons || '[]');
    const tags = JSON.parse(req.body.tags || '[]');
    const image = req.file ? req.file.path : null; // Get uploaded image path

    if (!categories.includes(category)) {
        return res.status(400).json({ message: 'Invalid category' });
    }

    try {
        const newPost = new Post({
            title,
            description,
            image,
            author: req.userId,
            pros,
            cons,
            tags,
            category
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
};

// Get All Posts
const getPosts = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const posts = await Post.find()
            .populate('author', 'name profileImage')
            .populate('comments.user', 'name')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Post.countDocuments();

        res.status(200).json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        next(error);
    }
};

const searchPosts = async (req, res, next) => {
    const { query } = req.query;

    try {
        const posts = await Post.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } }
            ]
        }).populate('author', 'name');

        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
}

// Like Post
const likePost = async (req, res, next) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const index = post.likes.findIndex((userId) => userId.toString() === req.userId);

        if (index === -1) {
            post.likes.push(req.userId);
        } else {
            post.likes = post.likes.filter((userId) => userId.toString() !== req.userId);
        }

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};

// Comment on Post
const commentOnPost = async (req, res, next) => {
    const { id } = req.params;
    const { comment } = req.body;

    // console.log('Received comment:', comment);

    if (!comment || !comment.trim()) {
        return res.status(400).json({ message: 'Comment is required' });
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({ user: req.userId, comment });
        const updatedPost = await post.save();

        // Notify post owner
        if (post.author.toString() !== req.userId) {
            await createNotification(post.author, req.userId, 'comment', 'commented on your post', post._id);
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};

const ratePost = async (req, res, next) => {
    const { id } = req.params;
    const { rating } = req.body;

    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
        return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userRatingIndex = post.ratings.findIndex(r => r.user.toString() === req.userId);

        if (userRatingIndex > -1) {
            post.ratings[userRatingIndex].rating = rating;
        } else {
            post.ratings.push({ user: req.userId, rating });
        }

        const totalRating = post.ratings.reduce((sum, r) => sum + r.rating, 0);
        post.averageRating = Number((totalRating / post.ratings.length).toFixed(1));
        post.ratingCount = post.ratings.length;

        const updatedPost = await post.save();

        if (post.author.toString() !== req.userId) {
            await createNotification(
                post.author,
                req.userId,
                'rating',
                `rated your post "${post.title}" with ${rating} stars`,
                post._id
            );
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};

const getPostById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id)
            .populate('author', 'name profileImage')
            .populate('comments.user', 'name profileImage');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

// Update Post
const updatePost = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, category } = req.body;
    const pros = JSON.parse(req.body.pros || '[]');
    const cons = JSON.parse(req.body.cons || '[]');
    const tags = JSON.parse(req.body.tags || '[]');
    const image = req.file ? req.file.path : null;

    if (category && !categories.includes(category)) {
        return res.status(400).json({ message: 'Invalid category' });
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        post.title = title || post.title;
        post.description = description || post.description;
        post.image = image || post.image;
        post.pros = pros;
        post.cons = cons;
        post.tags = tags;
        post.category = category || post.category;

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};


// Delete Post
const deletePost = async (req, res, next) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user is the author of the post
        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await post.deleteOne();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getPosts, createPost, getPostById, commentOnPost, likePost, updatePost, deletePost, upload, searchPosts, ratePost };
