const { getOrCreateProgress, advanceStage, failReverseTutor } = require('../services/progress.service');
const { recordActivity } = require('../services/streak.service');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.getProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const progress = await getOrCreateProgress(req.user._id, courseId);
  res.json(progress);
});

exports.advance = asyncHandler(async (req, res) => {
  const { courseId, chapterId, stage, payload = {} } = req.body;
  const progress = await advanceStage(req.user._id, courseId, chapterId, stage, payload);
  await recordActivity(req.user._id);
  res.json(progress);
});

exports.failReverseTutor = asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.body;
  const progress = await failReverseTutor(req.user._id, courseId, chapterId);
  res.json(progress);
});
