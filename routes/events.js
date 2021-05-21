var express = require('express');
var router = express.Router();
const eventsRouter = require('../controllers/events')

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/google');
  };


router.get('/', isLoggedIn, eventsRouter.index)
router.get('/new', isLoggedIn, eventsRouter.new)
router.post('/', isLoggedIn, eventsRouter.create)
router.get('/:id', isLoggedIn, eventsRouter.show)
router.get('/:id/edit', isLoggedIn, eventsRouter.edit)
router.patch('/:id', isLoggedIn, eventsRouter.update)

module.exports = router;
