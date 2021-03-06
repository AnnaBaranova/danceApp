const express = require('express');
const router = express.Router();
const commentsRouter = require('../controllers/comments');

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/auth/google');
  };

router.post('/events/:id/comments', isLoggedIn, commentsRouter.create);
router.delete('/comments/:id', isLoggedIn, commentsRouter.delete)
router.put('/comments/:id', isLoggedIn, commentsRouter.update)
router.get('/comments/:id/like', isLoggedIn, commentsRouter.addRemoveLike)





module.exports = router;
