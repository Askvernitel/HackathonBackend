const router = require('express').Router();
const demoAuth = require('../middleware/demoAuth');
const { generate, grade } = require('../controllers/exercise.controller');

router.post('/generate', demoAuth, generate);
router.post('/grade', demoAuth, grade);

module.exports = router;
