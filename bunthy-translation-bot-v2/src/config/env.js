const path = require('path');

function integer(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) throw new Error(`${name} must be an integer`);
  return parsed;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: integer('PORT', 3000),
  botToken: process.env.BOT_TOKEN || '',
  ownerId: integer('OWNER_ID', 0),
  adminUsername: process.env.ADMIN_USERNAME || 'bunthy',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  jwtSecret: process.env.JWT_SECRET || '',
  publicUrl: (process.env.PUBLIC_URL || '').replace(/\/$/, ''),
  databasePath: process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'bunthy-bot.db'),
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || '',
  cacheTtlSeconds: integer('CACHE_TTL_SECONDS', 3600),
  cacheMaxItems: integer('CACHE_MAX_ITEMS', 1000),
  translationTimeoutMs: integer('TRANSLATION_TIMEOUT_MS', 12000)
};

function validateEnv() {
  const missing = [];
  if (!env.botToken) missing.push('BOT_TOKEN');
  if (!env.ownerId) missing.push('OWNER_ID');
  if (!env.adminPassword) missing.push('ADMIN_PASSWORD');
  if (env.jwtSecret.length < 32) missing.push('JWT_SECRET (minimum 32 characters)');
  if (missing.length) {
    throw new Error(`Missing or invalid environment variables: ${missing.join(', ')}`);
  }
}

module.exports = { env, validateEnv };
