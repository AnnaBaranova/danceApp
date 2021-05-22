var express = require('express');
var router = express.Router();
const usersRouter = require('../controllers/users')

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
};

router.get('/', usersRouter.index)
router.get('/:id', isLoggedIn,usersRouter.show)

module.exports = router;
