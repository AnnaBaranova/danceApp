const Event = require('../models/event');


function message(message, color) {
    return `message=${encodeURIComponent(message)}&color=${color}`;
}

function create(req, res) {
    Event.findById(req.params.id)
        .then(event => {
            req.body.userId = req.user._id;
            req.body.userName = req.user.name;
            req.body.userAvatar = req.user.avatar;
            event.comments.push(req.body);
            return event.save({ validateBeforeSave: false })
        })
        .then(event => res.redirect(`/events/${event._id}?${message("Add Comment", "green")}`))
        .catch(err => {
            console.log(err);
            res.redirect('/events');
        });
};

function deleteComment(req, res) {
    Event.findOne({ 'comments._id': req.params.id })
        .then(event => {
            const commentDel = event.comments.id(req.params.id);
            if (!commentDel.userId.equals(req.user._id)) return res.redirect(`/events/${event._id}`);
            commentDel.remove();
            return event.save({ validateBeforeSave: false })
        })
        .then((event) => res.redirect(`/events/${event._id}?${message("Remove Comment", "red")}`))
        .catch(err => {
            console.log(err);
            res.redirect('/events');
        });
};

function update(req, res) {
    Event.findOne({ 'comments._id': req.params.id })
        .then(event => {
            const commentUpdate = event.comments.id(req.params.id);
            if (!commentUpdate.userId.equals(req.user._id)) return res.redirect(`/events/${event._id}`);
            commentUpdate.text = req.body.text;
            return event.save({validateBeforeSave: false })
        })
        .then(event => res.status(200).send(event))
        .catch(err => {
            console.log(err);
            res.status(500).send({ error: "err" });
        });
};

function addRemoveLike(req, res) {
    Event.findOne({ 'comments._id': req.params.id })
        .then((event) => {
            const commentLike = event.comments.find(el => el._id.toString() === req.params.id.toString());
            if (commentLike.userId.equals(req.user._id)) {
                return res.status(200).send({
                    toast: "it's your comment",
                    color: "red"
                })
            } else if (commentLike.likes.includes(req.user._id)) {
                const newLikes = commentLike.likes.filter(el => el.toString() !== req.user._id.toString());
                commentLike.likes = newLikes;
                event.save({ validateBeforeSave: false })
                    .then(event => res.status(200).send({
                        text: "star_border",
                        toast: "-1 like",
                        color: "red",
                        count: newLikes.length
                    }))
                    .catch(err => {
                        console.log(err);
                        res.status(500).send({ error: "err" });
                    })
            } else {
                commentLike.likes.push(req.user._id);
                event.save({ validateBeforeSave: false })
                    .then(event => res.status(200).send({
                        text: "star",
                        toast: "+1 like",
                        color: "green",
                        count: commentLike.likes.length
                    }))
                    .catch(err => {
                        console.log(err);
                        res.status(500).send({ error: "err" });
                    })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ error: "err" });
        })
};

module.exports = {
    create,
    delete: deleteComment,
    update,
    addRemoveLike,
}