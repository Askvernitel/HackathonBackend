const router = require('express').Router();
const demoAuth = require('../middleware/demoAuth');
const { generate, submit } = require('../controllers/quiz.controller');

router.post('/generate', demoAuth, generate);
router.post('/submit', demoAuth, submit);

module.exports = router;
