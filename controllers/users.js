const User = require('../models/user');

function message(message, color) {
    return `message=${encodeURIComponent(message)}&color=${color}`;
}

function index(req, res, next) {
    console.log(req.user)
    res.render('users/index', { title: 'kizApp', user: req.user });
};

function show(req, res) {
    User.findById(req.params.id)
        .then(profile => {
            res.render('users/show', { 
                title: 'Show Profile', 
                profile,
                message: req.query.message,
                color: req.query.color
             })
        })
        .catch(err => {
            console.log(err)
            res.redirect('/events')
        });
};


function update (req, res){
    User.findById(req.user)
    .then(user => {
        if (user._id.toString() !== req.user._id.toString()) return res.redirect(`/events`);
        user.phone= req.body.phone;
        return user.save()
    })
    .then((user) => res.redirect(`/users/show?${message("User Profile updated", "green")}`))
    .catch(err => {
        console.log(err)
        res.redirect('/events')
    });
}

module.exports = {
    index,
    show,
    update,
};