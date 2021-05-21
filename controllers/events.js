const Event= require('../models/event');



function index(req, res){
    Event.find({})
    .then (events => {
        const myEvents = [];
        const guestEvents = [];
        const otherEvents = [];
        events.forEach(event => {
            console.log(req.user._id)
            console.log(event.hostId)
            console.log(event)
            console.log(req.user._id.toString() === event.hostId.toString())
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
    console.log (req.user)
    event.hostId = req.user._id;
    event.hostName = req.user.name;
    event.save()
    .then(()=> res.redirect ('/events'))
    .catch(err => res.redirect ('/events/new'));
};

module.exports = {
    index,
    new: newEvent,
    create,
};