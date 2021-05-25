const Event = require('../models/event');

function message(message, color) {
    return `message=${encodeURIComponent(message)}&color=${color}`;
}


function index(req, res) {
    Event.find({})
        .then(events => {
            const sortEvents = events.slice().sort((a, b) => b.date - a.date);
            const myEvents = [];
            const guestEvents = [];
            const otherEvents = [];
            sortEvents.forEach(event => {
                // console.log(req.user._id.toString() === event.hostId.toString())
                if (req.user._id.toString() === event.hostId.toString()) {
                    myEvents.push(event);
                } else if (event.attendees.includes(req.user._id)) {
                    guestEvents.push(event);
                } else {
                    otherEvents.push(event)
                }
            })

            res.render('events', {
                title: 'All Events',
                // user: req.user, 
                myEvents,
                guestEvents,
                otherEvents,
                message: req.query.message,
                color: req.query.color
            })
        })

        .catch(err => console.log(err))
};


function newEvent(req, res) {
    res.render('events/new', { title: 'Add Event' });
};

function create(req, res) {
    const event = new Event(req.body);
    event.hostId = req.user._id;
    event.hostName = req.user.name;
    event.save()
        .then(() => res.redirect(`/events?${message("Created", "green")}`))
        .catch(err => res.redirect('/events/new'));
};

function show(req, res) {
    Event.findById(req.params.id)
        .populate('attendees')
        .exec()
        .then(event => {
            res.render('events/show', {
                title: 'Show Event',
                event,
                message: req.query.message,
                color: req.query.color
            })
        })
        .catch(err => res.redirect('/events'));
};

function edit(req, res) {
    Event.findById(req.params.id)
        .then(event => {
            if (!event.hostId.equals(req.user._id)) {
                return res.redirect(`/events/${event._id}`);
            } else {
                res.render('events/edit', {
                    title: 'Edit Event',
                    event,
                    message: req.query.message,
                    color: req.query.color
                })
            }
        })
        .catch(err => res.redirect('/events'));

};

function update(req, res) {
    Event.findById(req.params.id)
        .then(event => {
            if (!event.hostId.equals(req.user._id)) return res.redirect(`/events/${event._id}`);
            event.title = req.body.title;
            event.details = req.body.details;
            event.guestLimit = req.body.guestLimit;
            event.date = req.body.date;
            event.place = req.body.place;
            return event.save()
        })
        .then((event) => res.redirect(`/events/${event._id}?${message("Updated", "green")}`))
        .catch(err => res.redirect('/events'));
}

function deleteEvent(req, res) {
    Event.findByIdAndDelete(req.params.id)
        .then(() => res.redirect(`/events?${message("Deleted", "red")}`))
        .catch(() => res.redirect('/events'))
};

function addAttendee(req, res) {
    Event.findById(req.params.id)
        .then((event) => {
            if (event.hostId.toString() === req.user._id || event.attendees.includes(req.user._id)) {
                res.redirect('/events')
            } else {
                if (event.attendees.length < event.guestLimit) {
                    event.attendees.push(req.user._id);
                    event.save()
                        .then((event) => res.redirect(`/events?${message("You joined: " + event.title, "green")}`))
                        .catch(() => res.redirect('/events'))
                } else {
                    res.redirect(`/events?${message("Sorry! No spots left " + event.title, "red")}`)
                }
            }
        })
        .catch(() => res.redirect('/events'))

};

function removeAttendee(req, res) {
    Event.findById(req.params.id)
        .then((event) => {
            if (event.hostId.toString() === req.user._id) {
                res.redirect('/events')
            } else {
                const newAttendees = event.attendees.filter(el => el.toString() !== req.user._id.toString());
                event.attendees = newAttendees
                event.save()
                    .then((event) => res.redirect(`/events?${message("You left: " + event.title, "red")}`))
                    .catch(() => res.redirect('/events'))
            }
        })
        .catch(() => res.redirect('/events'))

};

module.exports = {
    index,
    new: newEvent,
    create,
    show,
    edit,
    update,
    delete: deleteEvent,
    addAttendee,
    removeAttendee,
};