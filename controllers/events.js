const Event= require('../models/event');

function newEvent(req, res) {
    res.render('events/new', { title: 'Add Event', user: req.user });
};

module.exports = {
    new: newEvent,
};