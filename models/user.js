const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        phone: {
            type: String,
            match: /\+\d\(\d{3}\)\d{3}-\d{4}/
        },
        avatar: String,
        googleId: String
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('User', userSchema);