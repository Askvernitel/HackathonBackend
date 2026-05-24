function buildTutorPrompt(chapter) {
  const contentPreview = chapter.content.slice(0, 3000);

  return `Answer questions about ${chapter.title} concisely and accurately. 1–3 sentences per answer. Use the reference material below.

If the question is outside ${chapter.title}, reply with exactly: __OFF_TOPIC__

${contentPreview}`;
}

function buildTutorStartPrompt(chapter) {
  const objectives = chapter.learningObjectives.map(o => `• ${o}`).join('\n');

  return `Write a dense, factual explanation of ${chapter.title}. Cover these points:
${objectives}

Start directly with content. No greetings, no preamble. Every sentence adds new information. Include one real-world example per point. End with one question that tests understanding of the material.

Reference:
${chapter.content}`;
}

module.exports = { buildTutorPrompt, buildTutorStartPrompt };
