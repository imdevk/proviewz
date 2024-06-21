const Post = require('../models/Post');
const { createNotification } = require('./notification');
const multer = require('multer')
const path = require('path');

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
const createPost = async (req, res) => {
    const { title, description } = req.body;
    const pros = JSON.parse(req.body.pros || '[]');
    const cons = JSON.parse(req.body.cons || '[]');
    const image = req.file ? req.file.path : null; // Get uploaded image path

    try {
        const newPost = new Post({
            title,
            description,
            image,
            author: req.userId,
            pros,
            cons,
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error in createPost:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Get All Posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'name profileImage').populate('comments.user', 'name');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Like Post
const likePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const index = post.likes.findIndex((userId) => userId.toString() === req.userId);

        if (index === -1) {
            post.likes.push(req.userId);
        } else {
            post.likes = post.likes.filter((userId) => userId.toString() !== req.userId);
        }

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error in likePost:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Comment on Post
const commentOnPost = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    console.log('Received comment:', comment);

    if (!comment || !comment.trim()) {
        return res.status(400).json({ message: 'Comment is required' });
    }

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.comments.push({ user: req.userId, comment });
        const updatedPost = await post.save();

        // Notify post owner
        if (post.author.toString() !== req.userId) {
            await createNotification(post.author, req.userId, 'comment', 'commented on your post', post._id);
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error in commentOnPost:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};


const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id).populate('author', 'name profileImage').populate('comments.user', 'name profileImage');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Update Post
const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, description, } = req.body;
    const pros = JSON.parse(req.body.pros || '[]');
    const cons = JSON.parse(req.body.cons || '[]');

    const image = req.file ? req.file.path : null; // Get uploaded image path

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Check if the user is the author of the post
        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        post.title = title || post.title;
        post.description = description || post.description;
        post.image = image || post.image;
        post.pros = pros;
        post.cons = cons;

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error('Error in updatePost:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Delete Post
const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Check if the user is the author of the post
        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await post.deleteOne();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error in deletePost:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { getPosts, createPost, getPostById, commentOnPost, likePost, updatePost, deletePost, upload };
