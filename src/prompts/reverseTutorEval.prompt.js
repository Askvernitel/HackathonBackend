function buildEvalPrompt(chapter, history) {
  const objectives = chapter.learningObjectives.join(', ');
  const transcript = history.map(m => `${m.role === 'user' ? 'Student' : 'AI'}: ${m.content}`).join('\n');
  return `You evaluated the following Reverse Tutor session where a student taught these objectives:
${objectives}

CONVERSATION:
${transcript}

For each learning objective, decide if the student demonstrated genuine understanding (covered=true) or not (covered=false). Provide one-line evidence (the student's words or paraphrase).

Output STRICT JSON only:
{
  "objectives": [
    {"objective": "...", "covered": true, "evidence": "..."}
  ],
  "score": 80,
  "passed": true,
  "feedback": "1-sentence encouragement or suggestion"
}`;
}

module.exports = { buildEvalPrompt };
