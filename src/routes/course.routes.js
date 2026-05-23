const router = require('express').Router();
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');

router.get('/', async (req, res, next) => {
  try {
    const courses = await Course.find().populate('chapters', 'title order');
    res.json(courses.map(c => ({
      _id: c._id,
      slug: c.slug,
      title: c.title,
      description: c.description,
      coverColor: c.coverColor,
      chapterCount: c.chapters.length,
    })));
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('chapters', 'title order description learningObjectives');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
