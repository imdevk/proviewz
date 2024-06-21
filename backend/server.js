const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const notificationRoutes = require('./routes/notification');
const multer = require("multer");
const path = require('path');

app.use(cors({ origin: 'http://localhost:3000' }));

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the 'uploads' directory
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/notifications', notificationRoutes);

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

