const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: { type: String, default: "profile.png" },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
