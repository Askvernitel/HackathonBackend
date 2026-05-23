const { getModel } = require('../config/gemini');

function parseJsonResponse(text) {
  const cleaned = text.replace(/```json|```/g, '').trim();
  const braceIdx = cleaned.indexOf('{');
  const bracketIdx = cleaned.indexOf('[');
  const candidates = [braceIdx, bracketIdx].filter(i => i >= 0);
  const start = Math.min(...candidates);
  return JSON.parse(cleaned.slice(start));
}

async function generateContent(prompt) {
  const model = getModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function generateChat(systemPrompt, history, userMessage) {
  const model = getModel();
  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood. I am ready.' }] },
      ...history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    ],
  });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}

module.exports = { parseJsonResponse, generateContent, generateChat };
