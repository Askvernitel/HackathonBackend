const Chapter = require('../models/Chapter');
const { generateContent, parseJsonResponse } = require('../services/gemini.service');
const { buildExerciseGenPrompt } = require('../prompts/exerciseGen.prompt');
const { buildExerciseGradePrompt } = require('../prompts/exerciseGrade.prompt');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.generate = asyncHandler(async (req, res) => {
  const { chapterId, difficulty = 'medium' } = req.body;
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  const prompt = buildExerciseGenPrompt(chapter, difficulty);
  const text = await generateContent(prompt);
  const exercises = parseJsonResponse(text);
  res.json(exercises);
});

exports.grade = asyncHandler(async (req, res) => {
  const { exercises, answers } = req.body;

  const results = await Promise.all(exercises.map(async (ex, i) => {
    const answer = answers[i];
    if (ex.type === 'mcq') {
      const correct = answer === ex.correctIndex;
      return { score: correct ? 100 : 0, correct, feedback: ex.explanation };
    }
    try {
      const prompt = buildExerciseGradePrompt(ex.question, ex.idealAnswer, ex.expectedAnswerKeywords, answer);
      const text = await generateContent(prompt);
      const graded = parseJsonResponse(text);
      return { ...graded, correct: graded.score >= 60 };
    } catch {
      return { score: 50, feedback: 'Could not grade — good attempt!', correct: false };
    }
  }));

  const totalScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);
  res.json({ results, totalScore, passed: totalScore >= 60 });
});
