const router = require('express').Router();
const Chapter = require('../models/Chapter');
const demoAuth = require('../middleware/demoAuth');

router.get('/:id', demoAuth, async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
    res.json(chapter);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
