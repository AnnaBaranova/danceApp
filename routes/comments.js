var express = require('express');
var router = express.Router();
const commentsRouter = require('../controllers/comments');


router.post('/events/:id/comments', commentsRouter.create);





module.exports = router;
