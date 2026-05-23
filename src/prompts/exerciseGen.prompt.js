function buildExerciseGenPrompt(chapter, difficulty = 'medium') {
  const objectives = chapter.learningObjectives.join(', ');
  return `Generate 3 exercises for the chapter "${chapter.title}" covering: ${objectives}.
Difficulty: ${difficulty}.
Mix: 2 multiple-choice (4 options each) + 1 short-answer.

Output STRICT JSON array only (no other text):
[
  {"type":"mcq","question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."},
  {"type":"mcq","question":"...","options":["A","B","C","D"],"correctIndex":2,"explanation":"..."},
  {"type":"short","question":"...","expectedAnswerKeywords":["keyword1","keyword2"],"idealAnswer":"..."}
]`;
}

module.exports = { buildExerciseGenPrompt };
