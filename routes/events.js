var express = require('express');
var router = express.Router();
const eventsRouter = require('../controllers/events')


router.get('/', eventsRouter.index)
router.get('/new', eventsRouter.new)
router.post('/', eventsRouter.create)

module.exports = router;
