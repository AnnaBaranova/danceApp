const Event= require('../models/event');



function index(req, res){
    Event.find({})
    .then (events => res.render ('events', { title: 'All Events', user: req.user, events: events}))
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