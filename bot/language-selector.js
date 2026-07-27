const { Markup } = require('telegraf');
const LANGUAGES = require('../config/languages');

const PAGE_SIZE = 8;
const selections = new Map();

function keyOf(ctx) {
  return `${ctx.chat.id}:${ctx.from.id}`;
}

function findLanguage(code) {
  return LANGUAGES.find((language) => language.code === code);
}

async function userCanConfigure(ctx, ownerId) {
  const userId = Number(ctx.from?.id || 0);
  if (ownerId && userId === ownerId) return true;

  if (!['group', 'supergroup'].includes(ctx.chat?.type)) {
    return false;
  }

  try {
    const member = await ctx.telegram.getChatMember(ctx.chat.id, userId);
    return ['creator', 'administrator'].includes(member.status);
  } catch (error) {
    console.error('Admin check failed:', error.message);
    return false;
  }
}

function languageKeyboard(step, page) {
  const pageCount = Math.ceil(LANGUAGES.length / PAGE_SIZE);
  const safePage = Math.max(0, Math.min(page, pageCount - 1));
  const start = safePage * PAGE_SIZE;
  const pageLanguages = LANGUAGES.slice(start, start + PAGE_SIZE);

  const rows = [];
  for (let index = 0; index < pageLanguages.length; index += 2) {
    rows.push(
      pageLanguages.slice(index, index + 2).map((language) =>
        Markup.button.callback(
          `${language.flag} ${language.name}`,
          `ls:${step}:${language.code}`
        )
      )
    );
  }

  const navigation = [];
  if (safePage > 0) {
    navigation.push(Markup.button.callback('⬅️ Previous', `lp:${step}:${safePage - 1}`));
  }
  navigation.push(Markup.button.callback(`${safePage + 1}/${pageCount}`, 'lnop'));
  if (safePage < pageCount - 1) {
    navigation.push(Markup.button.callback('Next ➡️', `lp:${step}:${safePage + 1}`));
  }
  rows.push(navigation);
  rows.push([Markup.button.callback('❌ Cancel', 'lcancel')]);

  return Markup.inlineKeyboard(rows);
}

function languageText(step, selectedFirst) {
  if (step === 1) {
    return [
      '🌐 Premium Language Settings',
      '',
      '1️⃣ Select Language 1',
      `Choose from all ${LANGUAGES.length} languages.`
    ].join('\n');
  }

  return [
    '🌐 Premium Language Settings',
    '',
    `✅ Language 1: ${selectedFirst.flag} ${selectedFirst.name}`,
    '',
    '2️⃣ Select Language 2',
    `Choose from all ${LANGUAGES.length} languages.`
  ].join('\n');
}

function registerLanguageSelector(bot, options) {
  const ownerId = Number(options.ownerId || 0);
  const getPair = options.getPair;
  const savePair = options.savePair;
  const removePair = options.removePair;

  bot.command(['languages', 'setlanguages'], async (ctx) => {
    if (!['group', 'supergroup'].includes(ctx.chat?.type)) {
      return ctx.reply('Please use /languages inside your Telegram group.');
    }

    if (!(await userCanConfigure(ctx, ownerId))) {
      return ctx.reply('⛔ Only the group owner or administrator can change languages.');
    }

    selections.set(keyOf(ctx), { first: null });
    return ctx.reply(languageText(1), languageKeyboard(1, 0));
  });

  bot.action(/^lp:(1|2):(\d+)$/, async (ctx) => {
    await ctx.answerCbQuery();
    if (!(await userCanConfigure(ctx, ownerId))) {
      return ctx.answerCbQuery('Admin only.', { show_alert: true });
    }

    const step = Number(ctx.match[1]);
    const page = Number(ctx.match[2]);
    const state = selections.get(keyOf(ctx));

    if (step === 2 && !state?.first) {
      return ctx.editMessageText(
        'This selection expired. Send /languages again.'
      );
    }

    const first = step === 2 ? findLanguage(state.first) : null;
    return ctx.editMessageText(
      languageText(step, first),
      languageKeyboard(step, page)
    );
  });

  bot.action(/^ls:(1|2):(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();

    if (!(await userCanConfigure(ctx, ownerId))) {
      return ctx.answerCbQuery('Admin only.', { show_alert: true });
    }

    const step = Number(ctx.match[1]);
    const code = ctx.match[2];
    const selected = findLanguage(code);

    if (!selected) {
      return ctx.answerCbQuery('Language not found.', { show_alert: true });
    }

    const stateKey = keyOf(ctx);
    const state = selections.get(stateKey) || { first: null };

    if (step === 1) {
      state.first = code;
      selections.set(stateKey, state);

      return ctx.editMessageText(
        languageText(2, selected),
        languageKeyboard(2, 0)
      );
    }

    if (!state.first) {
      return ctx.editMessageText(
        'This selection expired. Send /languages again.'
      );
    }

    if (state.first === code) {
      return ctx.answerCbQuery(
        'Please choose a different second language.',
        { show_alert: true }
      );
    }

    const first = findLanguage(state.first);
    await savePair(String(ctx.chat.id), {
      a: first.code,
      b: selected.code,
      updatedBy: Number(ctx.from.id),
      updatedAt: new Date().toISOString()
    });
    selections.delete(stateKey);

    return ctx.editMessageText(
      [
        '✅ Auto Translation Updated',
        '',
        `${first.flag} ${first.name} ⇄ ${selected.flag} ${selected.name}`,
        '',
        '🟢 Translation enabled',
        `👑 Updated by ${ctx.from.first_name || 'group administrator'}`
      ].join('\n'),
      Markup.inlineKeyboard([
        [Markup.button.callback('🌐 Change Languages', 'lchange')],
        [Markup.button.callback('🔴 Turn Translation Off', 'loff')]
      ])
    );
  });

  bot.action('lchange', async (ctx) => {
    await ctx.answerCbQuery();
    if (!(await userCanConfigure(ctx, ownerId))) {
      return ctx.answerCbQuery('Admin only.', { show_alert: true });
    }

    selections.set(keyOf(ctx), { first: null });
    return ctx.editMessageText(languageText(1), languageKeyboard(1, 0));
  });

  bot.action('loff', async (ctx) => {
    await ctx.answerCbQuery();
    if (!(await userCanConfigure(ctx, ownerId))) {
      return ctx.answerCbQuery('Admin only.', { show_alert: true });
    }

    await removePair(String(ctx.chat.id));
    selections.delete(keyOf(ctx));
    return ctx.editMessageText('🔴 Auto translation is now disabled.');
  });

  bot.action('lcancel', async (ctx) => {
    await ctx.answerCbQuery('Cancelled');
    selections.delete(keyOf(ctx));
    return ctx.editMessageText('❌ Language selection cancelled.');
  });

  bot.action('lnop', async (ctx) => {
    return ctx.answerCbQuery('Choose a language from this page.');
  });

  bot.command('currentlanguages', async (ctx) => {
    const pair = await getPair(String(ctx.chat.id));
    if (!pair) {
      return ctx.reply('Translation is not configured. Send /languages.');
    }

    const first = findLanguage(pair.a);
    const second = findLanguage(pair.b);
    return ctx.reply(
      first && second
        ? `🌐 Current languages:\n${first.flag} ${first.name} ⇄ ${second.flag} ${second.name}`
        : 'The saved language pair is invalid. Send /languages again.'
    );
  });
}

module.exports = { registerLanguageSelector };
