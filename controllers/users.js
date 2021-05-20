const User = require('../models/user');

function index(req, res, next) {
console.log(req.user)
    res.render('users/index', { title: 'kizApp', user: req.user});
};

module.exports = {
    index
};