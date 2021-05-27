const express = require('express');
const router = express.Router();
const usersRouter = require('../controllers/users')

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
};

router.get('/', usersRouter.index)
router.get('/:id', isLoggedIn,usersRouter.show)
router.put('/:id', isLoggedIn,usersRouter.update)

module.exports = router;
