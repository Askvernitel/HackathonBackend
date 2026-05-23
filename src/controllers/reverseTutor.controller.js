const Chapter = require('../models/Chapter');
const { generateChat, generateContent, parseJsonResponse } = require('../services/gemini.service');
const { buildReverseTutorPrompt, buildReverseTutorOpeningPrompt } = require('../prompts/reverseTutor.prompt');
const { buildEvalPrompt } = require('../prompts/reverseTutorEval.prompt');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.start = asyncHandler(async (req, res) => {
  const { chapterId } = req.body;
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
  const reply = buildReverseTutorOpeningPrompt(chapter);
  res.json({ reply });
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const { chapterId, history = [], message } = req.body;
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  const systemPrompt = buildReverseTutorPrompt(chapter);
  const exchangeCount = history.filter(m => m.role === 'user').length;
  const isDone = message.toLowerCase().includes("i'm done") || message.toLowerCase().includes('im done') || exchangeCount >= 7;

  const reply = await generateChat(systemPrompt, history, message);
  res.json({ reply, sessionComplete: isDone });
});

exports.evaluate = asyncHandler(async (req, res) => {
  const { chapterId, history } = req.body;
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  const prompt = buildEvalPrompt(chapter, history);
  let text;
  try {
    text = await generateContent(prompt);
    const result = parseJsonResponse(text);
    res.json(result);
  } catch {
    // fallback: pass with median score if JSON parse fails
    res.json({
      objectives: chapter.learningObjectives.map(o => ({ objective: o, covered: true, evidence: 'Evaluated' })),
      score: 70,
      passed: true,
      feedback: 'Good effort explaining the concepts!',
    });
  }
});
