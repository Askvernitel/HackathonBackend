const Chapter = require('../models/Chapter');
const { streamChat } = require('../services/gemini.service');
const { buildTutorPrompt, buildTutorStartPrompt } = require('../prompts/tutor.prompt');
const { sendSSE } = require('../utils/sse');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.startLecture = asyncHandler(async (req, res) => {
  const { chapterId } = req.body;
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
  sendSSE(res, streamChat(buildTutorStartPrompt(chapter), [], 'Begin the lecture.'));
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const { chapterId, history = [], message } = req.body;
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
  sendSSE(res, streamChat(buildTutorPrompt(chapter), history, message));
});
