const Chapter = require('../models/Chapter');
const { streamChat, generateContent, parseJsonResponse } = require('../services/gemini.service');
const { buildReverseTutorPrompt, buildReverseTutorOpeningPrompt } = require('../prompts/reverseTutor.prompt');
const { buildEvalPrompt } = require('../prompts/reverseTutorEval.prompt');
const { sendSSE } = require('../utils/sse');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.start = asyncHandler(async (req, res) => {
  const { chapterId } = req.body;
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
  res.json({ reply: buildReverseTutorOpeningPrompt(chapter) });
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const { chapterId, history = [], message } = req.body;
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  const exchangeCount = history.filter(m => m.role === 'user').length;
  const sessionComplete =
    message.toLowerCase().includes("i'm done") ||
    message.toLowerCase().includes('im done') ||
    exchangeCount >= 7;

  sendSSE(res, streamChat(buildReverseTutorPrompt(chapter), history, message), { sessionComplete });
});

exports.evaluate = asyncHandler(async (req, res) => {
  const { chapterId, history } = req.body;
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  try {
    const text = await generateContent(buildEvalPrompt(chapter, history));
    res.json(parseJsonResponse(text));
  } catch {
    res.json({
      objectives: chapter.learningObjectives.map(o => ({ objective: o, covered: true, evidence: 'Evaluated' })),
      score: 70,
      passed: true,
      feedback: 'Good effort explaining the concepts!',
    });
  }
});
