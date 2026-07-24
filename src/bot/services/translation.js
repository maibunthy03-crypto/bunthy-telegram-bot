const axios = require('axios');
const env = require('../../config/env');

async function translateText(text, source, target) {
  if (!text || source === target) return text;
  if (env.translationProvider !== 'libretranslate') {
    throw new Error(`Unsupported provider: ${env.translationProvider}`);
  }
  const payload = { q: text, source: source || 'auto', target, format: 'text' };
  if (env.translationApiKey) payload.api_key = env.translationApiKey;
  const { data } = await axios.post(`${env.translationApiUrl.replace(/\/$/, '')}/translate`, payload, { timeout: 15000 });
  return data.translatedText;
}

async function detectLanguage(text) {
  try {
    const payload = { q: text };
    if (env.translationApiKey) payload.api_key = env.translationApiKey;
    const { data } = await axios.post(`${env.translationApiUrl.replace(/\/$/, '')}/detect`, payload, { timeout: 10000 });
    return Array.isArray(data) && data[0]?.language ? data[0].language : 'auto';
  } catch {
    return 'auto';
  }
}

module.exports = { translateText, detectLanguage };
