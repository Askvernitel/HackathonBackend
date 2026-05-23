const router = require('express').Router();
const demoAuth = require('../middleware/demoAuth');
const Streak = require('../models/Streak');

router.get('/', demoAuth, async (req, res, next) => {
  try {
    const streak = await Streak.findOne({ userId: req.user._id }) || { currentStreak: 0, longestStreak: 0, activityDates: [] };
    res.json(streak);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
