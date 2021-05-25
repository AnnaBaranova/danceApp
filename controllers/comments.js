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
            return event.save()
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
            return event.save()
        })
        .then((event) => res.redirect(`/events/${event._id}?${message("Remove Comment", "red")}`))
        .catch(err => {
            console.log(err);
            res.redirect('/events');
        });
};

function edit(req, res) {
    Event.findOne({ 'comments._id': req.params.id })
        .then(event => {
            const comment = event.comments.find(el => el._id.toString() === req.params.id.toString());
            console.log(comment)
            res.render('comments/edit', {
                title: 'Edit Comment',
                comment,
                message: req.query.message,
                color: req.query.color
            })
        })
        .catch(err => res.redirect('/events'));
};

// function update(req, res) {
//     Event.findOne({ 'comments._id': req.params.id })
//         .then(event => {
//             const commentUpdate = event.comments.id(req.params.id);
//             if (!commentUpdate.userId.equals(req.user._id)) return res.redirect(`/events/${event._id}`);
//             commentUpdate.text = req.body.text;
//             return event.save()
//         })
//         .then(event => res.redirect(`/events/${event._id}?${message("Update Comment", "green")}`))
//         .catch(err => {
//             console.log(err);
//             res.redirect('/events');
//         });
// };

function update(req, res) {
    Event.findOne({ 'comments._id': req.params.id })
        .then(event => {
            const commentUpdate = event.comments.id(req.params.id);
            if (!commentUpdate.userId.equals(req.user._id)) return res.redirect(`/events/${event._id}`);
            commentUpdate.text = req.body.text;
            return event.save()
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
                return res.redirect(`/events/${event._id}?${message("it's your comment", "red")}`);
            } else if (commentLike.likes.includes(req.user._id)) {
                const newLikes = commentLike.likes.filter(el => el.toString() !== req.user._id.toString());
                commentLike.likes = newLikes;
                event.save()
                    .then((event) => res.redirect(`/events/${event._id}?${message("-1 like", "red")}`))
                    .catch(() => res.redirect('/events'))
            } else {
                commentLike.likes.push(req.user._id);
                event.save()
                    .then((event) => res.redirect(`/events/${event._id}?${message("+1 like", "green")}`))
                    .catch(() => res.redirect('/events'))
            }
        })
        .catch(() => res.redirect('/events'))

};


module.exports = {
    create,
    delete: deleteComment,
    edit,
    update,
    addRemoveLike,
    // updatePatch,
}