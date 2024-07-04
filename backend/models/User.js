const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    profileImage: { type: String }, // URL or path to the profile image
    occupation: { type: String },
    location: { type: String },
    bio: { type: String },
    favoriteGadgets: [{ type: String }],
    reviews: [{
        post: { type: Schema.Types.ObjectId, ref: 'Post' },
        rating: { type: Number, min: 1, max: 5 },
        review: { type: String }
    }]
});

module.exports = mongoose.model('User', UserSchema);
