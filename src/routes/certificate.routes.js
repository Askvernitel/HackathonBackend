const router = require('express').Router();
const demoAuth = require('../middleware/demoAuth');
const { issue } = require('../controllers/certificate.controller');

router.post('/issue', demoAuth, issue);

module.exports = router;
