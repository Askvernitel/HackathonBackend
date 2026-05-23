const router = require('express').Router();
const demoAuth = require('../middleware/demoAuth');
const { getProgress, advance, failReverseTutor } = require('../controllers/progress.controller');

router.get('/:courseId', demoAuth, getProgress);
router.post('/advance', demoAuth, advance);
router.post('/fail-reverse-tutor', demoAuth, failReverseTutor);

module.exports = router;
