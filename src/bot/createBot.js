const { Telegraf } = require('telegraf');
const { env } = require('../config/env');
const { registerCommands } = require('./commands/registerCommands');
const { registerMessageHandler } = require('./handlers/messageHandler');
const { registerMemberHandler } = require('./handlers/memberHandler');

function createBot() {
  const bot = new Telegraf(env.botToken);
  registerCommands(bot);
  registerMessageHandler(bot);
  registerMemberHandler(bot);

  bot.catch((error, ctx) => {
    console.error(`Bot error in chat ${ctx.chat?.id || 'unknown'}:`, error);
  });

  return bot;
}

module.exports = { createBot };
