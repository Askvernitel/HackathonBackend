const router = require('express').Router();
const demoAuth = require('../middleware/demoAuth');
const { start, sendMessage, evaluate } = require('../controllers/reverseTutor.controller');

router.post('/start', demoAuth, start);
router.post('/message', demoAuth, sendMessage);
router.post('/evaluate', demoAuth, evaluate);

module.exports = router;
