require('dotenv').config();

const { validateEnv, env } = require('./config/env');
validateEnv();

require('./database/db');

const { createBot } = require('./bot/createBot');
const { createWebApp } = require('./web/createWebApp');

async function main() {
  const app = createWebApp();
  const server = app.listen(env.port, '0.0.0.0', () => {
    console.log(`✅ Web dashboard listening on port ${env.port}`);
  });

  const bot = createBot();
  await bot.launch({ dropPendingUpdates: false });
  console.log('✅ Bunthy Translation Bot 2.0 is running');

  const shutdown = async (signal) => {
    console.log(`Received ${signal}; shutting down...`);
    bot.stop(signal);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((error) => {
  console.error('Fatal startup error:', error);
  process.exit(1);
});
