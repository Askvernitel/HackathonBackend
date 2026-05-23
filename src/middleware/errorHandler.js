module.exports = (err, req, res, next) => {
  console.error(err.message || err);

  // Surface Gemini rate-limit errors cleanly
  if (err.message && err.message.includes('429')) {
    return res.status(429).json({ error: 'AI rate limit reached. Please wait a moment and try again.' });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
};
