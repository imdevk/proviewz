const express = require('express');
const { getPosts, createPost, getPostById, commentOnPost, likePost, updatePost, deletePost, upload } = require('../controllers/posts');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('multer')

router.get('/', getPosts);
router.post('/', auth, upload.single('image'), createPost);
router.get('/:id', getPostById); // Add this line
router.post('/:id/comment', auth, commentOnPost);
router.post('/:id/like', auth, likePost);
router.put('/:id', auth, upload.single('image'), updatePost);
router.delete('/:id', auth, deletePost);

module.exports = router;
