require('dotenv').config();

const { Telegraf } = require('telegraf');
const { registerLanguageSelector } = require('./bot/language-selector');
const { getPair, savePair, removePair } = require('./data-store');

const BOT_TOKEN = String(process.env.BOT_TOKEN || '').trim();
const OWNER_ID = Number(process.env.OWNER_ID || 0);

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is missing in Railway Variables or .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply(
    [
      '🌸 Maline Premium Language Bot',
      '',
      'Use these commands inside your group:',
      '/ping',
      '/languages',
      '/currentlanguages'
    ].join('\n')
  )
);

bot.command('ping', (ctx) =>
  ctx.reply('✅ Bot is online and the new src/index.js is running.')
);

registerLanguageSelector(bot, {
  ownerId: OWNER_ID,
  getPair,
  savePair,
  removePair
});

bot.catch((error, ctx) => {
  console.error(`❌ Bot error for update ${ctx.update.update_id}:`, error);
});

async function startBot() {
  try {
    const me = await bot.telegram.getMe();
    console.log(`✅ Connected to @${me.username}`);

    await bot.telegram.deleteWebhook({ drop_pending_updates: true });

    await bot.launch({
      dropPendingUpdates: true,
      allowedUpdates: ['message', 'callback_query', 'my_chat_member', 'chat_member']
    });

    console.log('✅ Maline language bot is running');
  } catch (error) {
    console.error('❌ Bot failed to start:', error);
    process.exit(1);
  }
}

startBot();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
