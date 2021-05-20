var express = require('express');
var router = express.Router();
const eventsRouter = require('../controllers/events')


router.get('/new', eventsRouter.new)

module.exports = router;
