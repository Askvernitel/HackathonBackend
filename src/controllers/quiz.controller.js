const Chapter = require('../models/Chapter');
const { streamContent } = require('../services/gemini.service');
const { buildQuizGenPrompt } = require('../prompts/quizGen.prompt');
const { sendSSE } = require('../utils/sse');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.generate = asyncHandler(async (req, res) => {
  const { chapterId } = req.body;
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });
  sendSSE(res, streamContent(buildQuizGenPrompt(chapter)));
});

exports.submit = asyncHandler(async (req, res) => {
  const { answers, questions } = req.body;
  if (!questions) return res.status(400).json({ error: 'questions required for grading' });

  const perQuestion = questions.map((q, i) => ({
    correct: answers[i] === q.correctIndex,
    explanation: q.explanation,
  }));

  const score = Math.round(perQuestion.filter(q => q.correct).length / questions.length * 100);
  res.json({ score, perQuestion, passed: score >= 70 });
});
