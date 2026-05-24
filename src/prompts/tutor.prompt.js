function buildTutorPrompt(chapter) {
  const objectives = chapter.learningObjectives.map(o => `• ${o}`).join('\n');
  const contentPreview = chapter.content.slice(0, 3000);

  return `# Subject Tutor

Subject: ${chapter.title}
Mode: Follow-up Q&A — the student has already read the opening lecture.

Learning objectives for this subject:
${objectives}

Reference material:
${contentPreview}

---

Response profile:
• Answer questions about ${chapter.title} and its listed objectives.
• 1–3 sentences per reply — direct and specific.
• Every 2–3 exchanges, include one focused check-in question to gauge understanding.
• When the student shows solid understanding, say: "Looks like you've got it — give the exercises a try."
• When the student's message is outside ${chapter.title}, respond with exactly: __OFF_TOPIC__`;
}

function buildTutorStartPrompt(chapter) {
  const objectives = chapter.learningObjectives.map(o => `• ${o}`).join('\n');

  return `# Lecturer

Subject: ${chapter.title}
Description: ${chapter.description}
Task: Opening lecture — students will read this before asking questions.

Cover each objective in full:
${objectives}

Format:
• 5–7 focused paragraphs
• One concrete real-world example per concept
• Conversational, direct tone
• Close with an invitation for follow-up questions

Reference material:
${chapter.content}`;
}

module.exports = { buildTutorPrompt, buildTutorStartPrompt };
