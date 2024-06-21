const mongoose = require('mongoose');
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
});

module.exports = mongoose.model('Post', PostSchema);
