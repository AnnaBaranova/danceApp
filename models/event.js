const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            match: /\w+.*/,
        },
        userId: {
            type: Schema.Types.ObjectId, ref: 'User'
        },
        userName: String,
        userAvatar: String,
        likes: [{
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
            trim: true,
        },
        hostId: {
            type: Schema.Types.ObjectId, ref: 'User'
        },
        hostName: String,
        date: {
            type: Date,
            min() {
                let day = new Date();
                day.setDate(day.getDate() + 1)
                return day
            },
            max() {
                let day = new Date();
                day.setMonth(day.getMonth() + 3)
                return day
            },
            required: true,
        },
        place: String,
        guestLimit: {
            type: Number,
            min:1,
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