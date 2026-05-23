const router = require('express').Router();
const demoAuth = require('../middleware/demoAuth');
const { startLecture, sendMessage } = require('../controllers/tutor.controller');

router.post('/start', demoAuth, startLecture);
router.post('/message', demoAuth, sendMessage);

module.exports = router;
