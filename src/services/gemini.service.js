const { getModel } = require('../config/gemini');

const CALL_TIMEOUT_MS = 60000;

function withTimeout(promise) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini call timed out after 60s')), CALL_TIMEOUT_MS)
    ),
  ]);
}

function parseJsonResponse(text) {
  const cleaned = text.replace(/```json|```/g, '').trim();
  const braceIdx = cleaned.indexOf('{');
  const bracketIdx = cleaned.indexOf('[');
  const candidates = [braceIdx, bracketIdx].filter(i => i >= 0);
  const start = Math.min(...candidates);
  return JSON.parse(cleaned.slice(start));
}

async function generateContent(prompt, retries = 2) {
  const model = getModel();
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await withTimeout(model.generateContent(prompt));
      return result.response.text();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
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
  const result = await withTimeout(chat.sendMessage(userMessage));
  return result.response.text();
}

async function* streamContent(prompt) {
  const model = getModel();
  const result = await withTimeout(model.generateContentStream(prompt));
  for await (const chunk of result.stream) {
    const t = chunk.text();
    if (t) yield t;
  }
}

function buildChatHistory(systemPrompt, history) {
  return [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Understood. I am ready.' }] },
    ...history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  ];
}

async function* streamChat(systemPrompt, history, userMessage) {
  const model = getModel();
  const chat = model.startChat({ history: buildChatHistory(systemPrompt, history) });
  const result = await withTimeout(chat.sendMessageStream(userMessage));
  for await (const chunk of result.stream) {
    const t = chunk.text();
    if (t) yield t;
  }
}

module.exports = { parseJsonResponse, generateContent, generateChat, streamContent, streamChat };
