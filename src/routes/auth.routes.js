const router = require('express').Router();
const User = require('../models/User');
const demoAuth = require('../middleware/demoAuth');

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ userId: user._id, name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
});

router.get('/me', demoAuth, (req, res) => {
  const { _id, name, email, avatar } = req.user;
  res.json({ userId: _id, name, email, avatar });
});

module.exports = router;
