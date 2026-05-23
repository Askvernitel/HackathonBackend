const Streak = require('../models/Streak');

async function recordActivity(userId) {
  let streak = await Streak.findOne({ userId });
  if (!streak) {
    streak = new Streak({ userId, currentStreak: 0, longestStreak: 0 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const last = streak.lastActivityDate?.toISOString().slice(0, 10);

  if (last === today) return streak;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  streak.currentStreak = (last === yesterday) ? streak.currentStreak + 1 : 1;
  streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
  streak.lastActivityDate = new Date();
  streak.activityDates.push(new Date());
  await streak.save();
  return streak;
}

async function getStreak(userId) {
  return await Streak.findOne({ userId }) || { currentStreak: 0, longestStreak: 0 };
}

module.exports = { recordActivity, getStreak };
