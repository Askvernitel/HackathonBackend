const Chapter = require('../models/Chapter');
const { generateChat } = require('../services/gemini.service');
const { buildTutorPrompt, buildTutorStartPrompt } = require('../prompts/tutor.prompt');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.startLecture = asyncHandler(async (req, res) => {
  const { chapterId } = req.body;
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  const systemPrompt = buildTutorStartPrompt(chapter);
  const reply = await generateChat(systemPrompt, [], 'Begin the lecture.');
  res.json({ reply });
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const { chapterId, history = [], message } = req.body;
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  const systemPrompt = buildTutorPrompt(chapter);
  const reply = await generateChat(systemPrompt, history, message);
  res.json({ reply });
});
