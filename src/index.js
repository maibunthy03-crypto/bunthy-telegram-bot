require('dotenv').config();

const { Telegraf } = require('telegraf');
const translatePackage = require('google-translate-api-x');
const { registerLanguageSelector } = require('./bot/language-selector');
const { getPair, savePair, removePair } = require('./data-store');

const translate =
  typeof translatePackage === 'function'
    ? translatePackage
    : translatePackage.translate;

const BOT_TOKEN = String(
  process.env.BOT_TOKEN ||
  process.env.TELEGRAM_BOT_TOKEN ||
  ''
).trim();

const OWNER_ID = Number(process.env.OWNER_ID || 0);
const TRANSLATION_ENABLED =
  String(process.env.TRANSLATION_ENABLED || 'true').toLowerCase() !== 'false';

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is missing');
  process.exit(1);
}

if (typeof translate !== 'function') {
  console.error('❌ google-translate-api-x did not load correctly');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

function baseLanguage(code) {
  return String(code || '').toLowerCase().split('-')[0];
}

function detectedLanguage(result) {
  return baseLanguage(
    result?.from?.language?.iso ||
    result?.from?.language?.didYouMean ||
    ''
  );
}

async function translateMessage(text, target, source = 'auto') {
  const options = {
    to: target,
    forceTo: true,
    autoCorrect: true
  };

  if (source && source !== 'auto') {
    options.from = source;
  }

  const result = await translate(text, options);

  return {
    text: String(result?.text || '').trim(),
    detected: detectedLanguage(result)
  };
}

bot.start((ctx) =>
  ctx.reply(
    [
      '🌸 Maline Premium Translate Bot V2',
      '',
      'Commands:',
      '/ping',
      '/languages',
      '/currentlanguages'
    ].join('\n')
  )
);

bot.command('ping', (ctx) =>
  ctx.reply(
    [
      '✅ Bot is online.',
      `✅ Free translator loaded: ${typeof translate === 'function' ? 'Yes' : 'No'}`,
      `✅ Translation enabled: ${TRANSLATION_ENABLED ? 'Yes' : 'No'}`
    ].join('\n')
  )
);

registerLanguageSelector(bot, {
  ownerId: OWNER_ID,
  getPair,
  savePair,
  removePair
});

bot.on('text', async (ctx, next) => {
  const text = String(ctx.message?.text || '').trim();

  if (!text || text.startsWith('/')) {
    return next();
  }

  if (!['group', 'supergroup'].includes(ctx.chat?.type)) {
    return next();
  }

  if (ctx.from?.is_bot || !TRANSLATION_ENABLED) {
    return next();
  }

  const chatId = String(ctx.chat.id);
  const pair = await getPair(chatId);

  console.log(
    `📨 Message received | chat=${chatId} | pair=${pair?.a || '-'}↔${pair?.b || '-'} | text=${text.slice(0, 80)}`
  );

  if (!pair?.a || !pair?.b) {
    console.log('⚠️ No language pair saved for this group');
    return next();
  }

  try {
    /*
      First translate to Language 1. This also detects the original language.

      - If original is Language 2, this first result is already correct.
      - If original is Language 1, translate again to Language 2.
      - Ignore messages in any other language.
    */
    const probe = await translateMessage(text, pair.a);
    const detected = baseLanguage(probe.detected);
    const language1 = baseLanguage(pair.a);
    const language2 = baseLanguage(pair.b);

    console.log(
      `🔎 Detected=${detected || 'unknown'} | configured=${language1}↔${language2}`
    );

    let translatedText = '';

    if (detected === language2) {
      translatedText = probe.text;
    } else if (detected === language1) {
      const result = await translateMessage(text, pair.b, pair.a);
      translatedText = result.text;
    } else {
      console.log('ℹ️ Message language is outside the selected pair');
      return next();
    }

    if (
      translatedText &&
      translatedText.toLowerCase() !== text.toLowerCase()
    ) {
      console.log(`✅ Translation sent: ${translatedText.slice(0, 100)}`);

      return ctx.reply(`🌐 ${translatedText}`, {
        reply_parameters: {
          message_id: ctx.message.message_id
        }
      });
    }

    console.log('ℹ️ Translation result was empty or unchanged');
  } catch (error) {
    console.error(
      '❌ FREE TRANSLATION ERROR:',
      error?.stack || error?.message || error
    );

    try {
      await ctx.reply(
        '⚠️ Translation service is temporarily unavailable. Please try again.'
      );
    } catch {}
  }

  return next();
});

bot.catch((error, ctx) => {
  console.error(
    `❌ Telegram bot error for update ${ctx.update?.update_id}:`,
    error?.stack || error
  );
});

async function startBot() {
  try {
    const me = await bot.telegram.getMe();

    console.log(`✅ Connected to @${me.username}`);
    console.log('✅ google-translate-api-x loaded');
    console.log(`✅ Translation enabled: ${TRANSLATION_ENABLED}`);

    await bot.telegram.deleteWebhook({
      drop_pending_updates: true
    });

    await bot.launch({
      dropPendingUpdates: true,
      allowedUpdates: [
        'message',
        'callback_query',
        'my_chat_member',
        'chat_member'
      ]
    });

    console.log('✅ Maline Option 2 translation bot is running');
  } catch (error) {
    console.error(
      '❌ Bot failed to start:',
      error?.stack || error?.message || error
    );
    process.exit(1);
  }
}

startBot();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
