var express = require('express');
var router = express.Router();
const commentsRouter = require('../controllers/comments');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/google');
  };

router.post('/events/:id/comments', isLoggedIn, commentsRouter.create);





module.exports = router;
