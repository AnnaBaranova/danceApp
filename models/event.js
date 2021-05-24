const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema(
    {
        text: String,
        userId: {
            type: Schema.Types.ObjectId, ref: 'User'
        },
        userName: String,
        userAvatar: String,
        likes:[{
            type: Schema.Types.ObjectId, ref: 'User'
        }]
    }, {
    timestamps: true,
}
);

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            match: /\w+.*/,
        },
        hostId: {
            type: Schema.Types.ObjectId, ref: 'User'
        },
        hostName: String,
        date: Date,
        place: String,
        guestLimit: {
            type: Number,
            min: 1,
            default: 6
        },
        details: String,
        attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        comments: [commentSchema],
    },
    {
        timestamps: true,
    }

)

module.exports = mongoose.model('Event', eventSchema);