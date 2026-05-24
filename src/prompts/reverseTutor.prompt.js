function buildReverseTutorPrompt(chapter) {
  const objectives = chapter.learningObjectives.map(o => `• ${o}`).join('\n');

  return `Ask one short question per reply to probe understanding of ${chapter.title}. Cover each objective below. Use follow-ups like "why?", "what if X changed?", "give an example." After 6–8 exchanges say: "I think I'm starting to get it! Thanks for explaining."

If the message is outside ${chapter.title}, reply with exactly: __OFF_TOPIC__

Objectives:
${objectives}`;
}

function buildReverseTutorOpeningPrompt(chapter) {
  return `Can you explain ${chapter.title} to me? Start from the basics.`;
}

module.exports = { buildReverseTutorPrompt, buildReverseTutorOpeningPrompt };
