const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    profileImage: { type: String }, // URL or path to the profile image
    occupation: { type: String },
    location: { type: String }
});

module.exports = mongoose.model('User', UserSchema);
