const Event = require('../models/event');


function message(message, color) {
    return `message=${encodeURIComponent(message)}&color=${color}`;
}

function create(req, res) {
    console.log(req.params)
    Event.findById(req.params.id)
        .then(event => {
            req.body.userId = req.user._id;
            req.body.userName = req.user.name;
            event.comments.push(req.body);
            return event.save()
        })
        .then((event) => res.redirect(`/events/${event._id}?${message("Add Comment", "green")}`))
        .catch(err => {
            console.log(err);
            res.redirect('/events');
        });
};


module.exports = {
    create,
}