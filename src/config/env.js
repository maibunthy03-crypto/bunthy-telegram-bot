require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  appUrl: process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`,
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  webAppUrl: process.env.TELEGRAM_WEB_APP_URL || process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`,
  defaultStaffGroupId: process.env.DEFAULT_STAFF_GROUP_ID || '',
  defaultPrimaryLanguage: process.env.DEFAULT_PRIMARY_LANGUAGE || 'en',
  defaultSecondaryLanguage: process.env.DEFAULT_SECONDARY_LANGUAGE || 'zh',
  translationEnabled: String(process.env.TRANSLATION_ENABLED || 'true') === 'true',
  welcomeEnabled: String(process.env.WELCOME_ENABLED || 'true') === 'true',
  translationProvider: process.env.TRANSLATION_PROVIDER || 'libretranslate',
  translationApiUrl: process.env.TRANSLATION_API_URL || 'https://libretranslate.com',
  translationApiKey: process.env.TRANSLATION_API_KEY || '',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@maline.local',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
  sessionSecret: process.env.SESSION_SECRET || 'change-this-secret'
};

module.exports = env;
