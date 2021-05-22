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
        .then((event) => res.redirect(`/events/${event._id}?${message("Add Comment", "green")}`))
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

function edit (req, res){
    Event.findOne({ 'comments._id': req.params.id })
    .then(event => {
        console.log(event)
        const comment = event.comments.find(el => el._id.toString() === req.params.id.toString());
        console.log(comment)
        res.render('comments/edit', { title: 'Edit Comment', comment})
    })
    .catch(err => res.redirect('/events'));
};

function update (req, res){

};


module.exports = {
    create,
    delete: deleteComment,
    edit,
    update,
}