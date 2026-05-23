const Progress = require('../models/Progress');
const Course = require('../models/Course');

const STAGE_SEQUENCE = ['tutor', 'exercise1', 'reverseTutor', 'exercise2', 'quiz', 'summary', 'completed'];

async function getOrCreateProgress(userId, courseId) {
  let progress = await Progress.findOne({ userId, courseId });
  if (!progress) {
    const course = await Course.findById(courseId).populate('chapters');
    if (!course) throw Object.assign(new Error('Course not found'), { status: 404 });
    progress = new Progress({
      userId,
      courseId,
      chapterProgress: course.chapters.map(ch => ({
        chapterId: ch._id,
        currentStage: 'tutor',
      })),
    });
    await progress.save();
  }
  return progress;
}

async function advanceStage(userId, courseId, chapterId, stage, payload = {}) {
  const progress = await getOrCreateProgress(userId, courseId);
  const cp = progress.chapterProgress.find(c => c.chapterId.toString() === chapterId.toString());
  if (!cp) throw Object.assign(new Error('Chapter not found in progress'), { status: 404 });

  cp.stages[stage] = {
    completed: true,
    completedAt: new Date(),
    score: payload.score,
    objectivesCovered: payload.objectivesCovered,
  };

  const currentIdx = STAGE_SEQUENCE.indexOf(stage);
  cp.currentStage = STAGE_SEQUENCE[currentIdx + 1] || 'completed';

  const totalChapters = progress.chapterProgress.length;
  const completedChapters = progress.chapterProgress.filter(c => c.currentStage === 'completed').length;
  progress.overallPercent = Math.round((completedChapters / totalChapters) * 100);

  progress.markModified('chapterProgress');
  await progress.save();
  return progress;
}

async function failReverseTutor(userId, courseId, chapterId) {
  const progress = await getOrCreateProgress(userId, courseId);
  const cp = progress.chapterProgress.find(c => c.chapterId.toString() === chapterId.toString());
  if (!cp) throw Object.assign(new Error('Chapter not found in progress'), { status: 404 });

  cp.currentStage = 'tutor';
  cp.stages.tutor = {};
  cp.stages.exercise1 = {};
  cp.stages.reverseTutor = {};

  progress.markModified('chapterProgress');
  await progress.save();
  return progress;
}

module.exports = { getOrCreateProgress, advanceStage, failReverseTutor };
