const mongoose = require('mongoose');
const categories = require('../config/categories');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String, required: true }
});

const PostSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    pros: [{ type: String }],
    cons: [{ type: String }],
    tags: [{ type: String }],
    category: { type: String, required: true, enum: categories },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, defaul: 0 },
    ratings: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, required: true, min: 1, max: 5 }
    }]
});

module.exports = mongoose.model('Post', PostSchema);
