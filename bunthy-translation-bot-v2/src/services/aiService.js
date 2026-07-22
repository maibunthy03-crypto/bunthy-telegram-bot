const OpenAI = require('openai');
const { env } = require('../config/env');

let client;

function enabled() {
  return Boolean(env.openaiApiKey && env.openaiModel);
}

function getClient() {
  if (!client) client = new OpenAI({ apiKey: env.openaiApiKey });
  return client;
}

async function detectAndTranslate(text, languageA, languageB) {
  if (!enabled()) return null;

  const response = await getClient().responses.create({
    model: env.openaiModel,
    instructions: [
      'You are a strict translation engine.',
      'Determine whether the input is written primarily in language A or language B.',
      'If it is A, translate to B. If it is B, translate to A.',
      'If it is neither, return SKIP.',
      'Return JSON only: {"source":"CODE","target":"CODE","translation":"TEXT"} or {"translation":"SKIP"}.',
      'Do not add explanations.'
    ].join(' '),
    input: `Language A: ${languageA}\nLanguage B: ${languageB}\nText: ${text}`
  });

  const raw = response.output_text?.trim();
  if (!raw) return null;

  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  const parsed = JSON.parse(cleaned);
  if (!parsed.translation || parsed.translation === 'SKIP') return null;

  return {
    sourceLanguage: parsed.source || 'ai-detected',
    targetLanguage: parsed.target || 'ai-selected',
    text: String(parsed.translation).trim(),
    provider: 'openai'
  };
}

module.exports = { enabled, detectAndTranslate };
