const express = require('express');
const { registerUser, loginUser, updateUser, deleteUser, getUser, getCurrentUser, upload } = require('../controllers/auth');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', upload.single('profileImage'), registerUser);
router.post('/login', loginUser);
router.get('/me', auth, getCurrentUser);
router.put('/:id', auth, upload.single('profileImage'), updateUser);
router.delete('/:id', auth, deleteUser);
router.get('/:id', getUser);

module.exports = router;