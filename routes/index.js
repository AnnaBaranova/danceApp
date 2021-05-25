var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { 
    title: 'KizMe', 
    message: req.query.message,
    color: req.query.color});
});


router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));

router.get(
  '/oauth2callback',
  passport.authenticate('google', {
    successRedirect: '/events',
    failureRedirect: '/',
  })
);

// OAuth logout route
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
