const crypto = require('crypto');
const { translate } = require('@vitalets/google-translate-api');
const { env } = require('../config/env');
const TTLCache = require('../utils/cache');
const { languagesMatch, detectedFromGoogle } = require('../utils/language');
const aiService = require('./aiService');

const cache = new TTLCache(env.cacheMaxItems, env.cacheTtlSeconds);

function cacheKey(text, a, b) {
  return crypto.createHash('sha256').update(`${a}|${b}|${text}`).digest('hex');
}

function withTimeout(promise, milliseconds) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('Translation request timed out')), milliseconds);
    })
  ]).finally(() => clearTimeout(timer));
}

async function googleTranslation(text, languageA, languageB) {
  const detection = await withTimeout(
    translate(text, { to: languageA }),
    env.translationTimeoutMs
  );
  const detected = detectedFromGoogle(detection);

  if (languagesMatch(detected, languageA)) {
    const result = await withTimeout(
      translate(text, { from: languageA, to: languageB }),
      env.translationTimeoutMs
    );
    return {
      sourceLanguage: languageA,
      targetLanguage: languageB,
      text: result.text?.trim() || '',
      provider: 'google'
    };
  }

  if (languagesMatch(detected, languageB)) {
    return {
      sourceLanguage: languageB,
      targetLanguage: languageA,
      text: detection.text?.trim() || '',
      provider: 'google'
    };
  }

  return null;
}

async function translatePair(text, languageA, languageB) {
  const key = cacheKey(text, languageA, languageB);
  const cached = cache.get(key);
  if (cached) return { ...cached, provider: `${cached.provider}-cache`, cached: true };

  let result = null;
  let googleError = null;

  try {
    result = await googleTranslation(text, languageA, languageB);
  } catch (error) {
    googleError = error;
  }

  if (!result) {
    try {
      result = await withTimeout(
        aiService.detectAndTranslate(text, languageA, languageB),
        env.translationTimeoutMs + 8000
      );
    } catch (error) {
      if (googleError) error.cause = googleError;
      throw error;
    }
  }

  if (!result && googleError) throw googleError;
  if (!result?.text) return null;

  cache.set(key, result);
  return result;
}

function cacheSize() {
  return cache.size;
}

module.exports = { translatePair, cacheSize };
