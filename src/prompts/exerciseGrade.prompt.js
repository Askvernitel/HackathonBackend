function buildExerciseGradePrompt(question, idealAnswer, keywords, answer) {
  return `Grade this short answer.
QUESTION: ${question}
IDEAL ANSWER: ${idealAnswer}
EXPECTED KEYWORDS: ${keywords.join(', ')}
STUDENT ANSWER: ${answer}

Output STRICT JSON only:
{"score": 75, "feedback": "1-2 sentence feedback"}
A score >= 60 is passing.`;
}

module.exports = { buildExerciseGradePrompt };
