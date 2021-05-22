const User = require('../models/user');

function index(req, res, next) {
console.log(req.user)
    res.render('users/index', { title: 'kizApp', user: req.user});
};

function show (req, res) {
    console.log(req.user)
    User.findById(req.user)
        .then(user => {
            res.render('users/show', { title: 'Show Profile', user })
        })
        .catch(err => {
            console.log(err)
            res.redirect('/events')
        });

}
module.exports = {
    index,
    show,
};