const Event= require('../models/event');



function index(req, res){
    Event.find({})
    .then (events => {
        const myEvents = [];
        const guestEvents = [];
        const otherEvents = [];
        events.forEach(event => {
            // console.log(req.user._id.toString() === event.hostId.toString())
            if(req.user._id.toString() === event.hostId.toString()) {
                myEvents.push(event);
            } else if (event.attendees.includes(req.user._id)) {
                guestEvents.push(event);
            } else {
                otherEvents.push(event)
            }
        })

        res.render ('events', { title: 'All Events', user: req.user, myEvents, guestEvents, otherEvents})
    })

    .catch(err => console.log(err))
};


function newEvent(req, res) {
    res.render('events/new', { title: 'Add Event', user: req.user });
};

function create (req, res){
    const event = new Event (req.body);
    event.hostId = req.user._id;
    event.hostName = req.user.name;
    event.save()
    .then(()=> res.redirect ('/events'))
    .catch(err => res.redirect ('/events/new'));
};

function show (req, res){
    Event.findById(req.params.id)
    .populate('attendees')
    .exec()
    .then(event =>  {
        res.render('events/show', { title: 'Show Event', user: req.user, event })
    })

    .catch(err => res.redirect ('/events'));
};

function edit (req, res){
    Event.findById(req.params.id)
    .then(event =>  {
        res.render('events/edit', { title: 'Edit Event', user: req.user, event })
    })
    .catch(err => res.redirect ('/events'));

};

function update (req, res) {
Event.findById(req.params.id)
.then (event => {
    if (!event.hostId.equals(req.user._id)) return res.redirect (`/events/${event._id}`);
    event.title = req.body.title;
    event.details = req.body.details;
    event.guestLimit = req.body.guestLimit;
    event.date = req.body.date;
    event.place = req.body.place;
    return event.save()
})
.then((event)=> res.redirect (`/events/${event._id}`))
.catch(err => res.redirect ('/events'));
}

module.exports = {
    index,
    new: newEvent,
    create,
    show,
    edit,
    update,
};