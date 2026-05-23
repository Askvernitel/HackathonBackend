function buildQuizGenPrompt(chapter) {
  const objectives = chapter.learningObjectives.join(', ');
  return `Generate 5 multiple-choice quiz questions covering the full chapter "${chapter.title}".
Objectives: ${objectives}.
Difficulty: medium-hard. Cover different objectives across the 5.

Output STRICT JSON array of 5 MCQs only (no other text):
[
  {"type":"mcq","question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."},
  {"type":"mcq","question":"...","options":["A","B","C","D"],"correctIndex":1,"explanation":"..."},
  {"type":"mcq","question":"...","options":["A","B","C","D"],"correctIndex":2,"explanation":"..."},
  {"type":"mcq","question":"...","options":["A","B","C","D"],"correctIndex":3,"explanation":"..."},
  {"type":"mcq","question":"...","options":["A","B","C","D"],"correctIndex":0,"explanation":"..."}
]`;
}

module.exports = { buildQuizGenPrompt };
