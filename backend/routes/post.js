const express = require('express');
const {
    getPosts,
    createPost,
    getPostById,
    commentOnPost,
    likePost,
    updatePost,
    deletePost,
    upload,
    searchPosts,
    ratePost
} = require('../controllers/posts');
const auth = require('../middleware/auth');
const router = express.Router();
const categories = require('../config/categories')
const multer = require('multer')

router.get('/', getPosts);
router.post('/', auth, upload.single('image'), createPost);
router.get('/search', searchPosts);
router.get('/:id', getPostById); // Add this line
router.post('/:id/comment', auth, commentOnPost);
router.post('/:id/like', auth, likePost);
router.post('/:id/rate', auth, ratePost);
router.put('/:id', auth, upload.single('image'), updatePost);
router.delete('/:id', auth, deletePost);
router.get('/categories', (req, res) => {
    res.json(categories);
})

module.exports = router;
