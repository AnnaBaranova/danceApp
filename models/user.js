const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        phone: String,
        avatar: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);