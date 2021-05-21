const Event= require('../models/event');



function index(req, res){
 res.render ('events', { title: 'All Events', user: req.user})
};


function newEvent(req, res) {
    res.render('events/new', { title: 'Add Event', user: req.user });
};

function create (req, res){
    console.log(req.body)
    console.log(req.user)
    const event = new Event (req.body);
    event.host = req.user._id;
    event.save()
    //.then(()=> res.redirect (`/events/${event._id}`))
    .then(()=> res.redirect ('/events'))
    .catch(err => res.redirect ('/events/new'));
};

module.exports = {
    index,
    new: newEvent,
    create,
};