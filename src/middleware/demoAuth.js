const User = require('../models/User');

module.exports = async (req, res, next) => {
  const userId = req.header('x-demo-user-id');
  if (!userId) return res.status(401).json({ error: 'No demo user header' });
  const user = await User.findById(userId);
  if (!user) return res.status(401).json({ error: 'Invalid demo user' });
  req.user = user;
  next();
};
