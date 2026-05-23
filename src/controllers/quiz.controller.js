const Chapter = require('../models/Chapter');
const { generateContent, parseJsonResponse } = require('../services/gemini.service');
const { buildQuizGenPrompt } = require('../prompts/quizGen.prompt');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.generate = asyncHandler(async (req, res) => {
  const { chapterId } = req.body;
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  const prompt = buildQuizGenPrompt(chapter);
  const text = await generateContent(prompt);
  const questions = parseJsonResponse(text);
  res.json(questions);
});

exports.submit = asyncHandler(async (req, res) => {
  const { chapterId, answers } = req.body;
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  // answers is array of {questionIndex, selectedIndex} with questions cached in client
  // Re-generate quiz to check answers — or client sends questions with answers
  const { questions } = req.body;
  if (!questions) return res.status(400).json({ error: 'questions required for grading' });

  const perQuestion = questions.map((q, i) => ({
    correct: answers[i] === q.correctIndex,
    explanation: q.explanation,
  }));

  const correctCount = perQuestion.filter(q => q.correct).length;
  const score = Math.round((correctCount / questions.length) * 100);
  res.json({ score, perQuestion, passed: score >= 70 });
});
