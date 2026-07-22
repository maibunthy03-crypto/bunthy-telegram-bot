const { languageKeyboard } = require('../keyboards/languageKeyboard');
const { adminKeyboard } = require('../keyboards/adminKeyboard');
const { LANGUAGE_MAP } = require('../../config/languages');
const groups = require('../../database/groupRepository');
const stats = require('../../database/statsRepository');
const { env } = require('../../config/env');
const { cacheSize } = require('../../services/translationService');

const pending = new Map();

function ownerOnly(ctx) {
  return Number(ctx.from?.id) === env.ownerId;
}

function groupOnly(ctx) {
  return ['group', 'supergroup'].includes(ctx.chat?.type);
}

function registerCommands(bot) {
  bot.start((ctx) => ctx.reply([
    '🤖 Bunthy Translation Bot 2.0',
    '',
    'Fast two-way group translation with 150+ language choices.',
    '',
    'Commands:',
    '/language — choose the two group languages',
    '/current — show current pair',
    '/stats — translation statistics',
    '/admin — owner control panel',
    '/help — setup instructions'
  ].join('\n')));

  bot.command('help', (ctx) => ctx.reply([
    '📘 Setup',
    '',
    '1. Add the bot to your group.',
    '2. In BotFather, disable Privacy Mode with /setprivacy.',
    '3. Run /language inside the group.',
    '4. Choose Language A and Language B.',
    '',
    'Only Bunthy can change settings.'
  ].join('\n')));

  bot.command('ping', (ctx) => ctx.reply('🏓 Bot is online.'));

  bot.command('language', async (ctx) => {
    if (!groupOnly(ctx)) return ctx.reply('Use /language inside a Telegram group.');
    if (!ownerOnly(ctx)) return ctx.reply('🔒 Only Bunthy can change group languages.');
    groups.ensureGroup(ctx.chat.id, ctx.chat.title || '');
    pending.set(String(ctx.chat.id), {});
    return ctx.reply('1️⃣ Select the first communication language:', languageKeyboard(1, 0));
  });

  bot.command('current', (ctx) => {
    if (!groupOnly(ctx)) return ctx.reply('Use /current inside a Telegram group.');
    const group = groups.ensureGroup(ctx.chat.id, ctx.chat.title || '');
    const a = LANGUAGE_MAP.get(group.language_a);
    const b = LANGUAGE_MAP.get(group.language_b);
    return ctx.reply([
      group.enabled ? '✅ Translation enabled' : '⏸ Translation paused',
      '',
      `${a?.flag || '🌐'} ${a?.name || group.language_a}`,
      '↕️',
      `${b?.flag || '🌐'} ${b?.name || group.language_b}`
    ].join('\n'));
  });

  bot.command('stats', (ctx) => {
    if (!ownerOnly(ctx)) return ctx.reply('🔒 Owner only.');
    const all = stats.overview();
    const day = stats.today();
    return ctx.reply([
      '📊 Translation Statistics',
      '',
      `Today: ${day.successful || 0}`,
      `All time: ${all.successful || 0}`,
      `Failed: ${all.failed || 0}`,
      `Characters: ${all.characters || 0}`,
      `Average latency: ${all.avg_latency || 0} ms`
    ].join('\n'));
  });

  bot.command('admin', (ctx) => {
    if (!ownerOnly(ctx)) return ctx.reply('🔒 Owner only.');
    return ctx.reply([
      '👑 Bunthy Admin Panel',
      '',
      'Manage groups, see statistics and open the secure web dashboard.'
    ].join('\n'), adminKeyboard());
  });

  bot.command('reset', (ctx) => {
    if (!groupOnly(ctx)) return ctx.reply('Use /reset inside a group.');
    if (!ownerOnly(ctx)) return ctx.reply('🔒 Owner only.');
    groups.setLanguages(ctx.chat.id, ctx.chat.title || '', 'en', 'zh-CN');
    return ctx.reply('✅ Language pair reset to English ↔ Chinese.');
  });

  bot.command('pause', (ctx) => {
    if (!groupOnly(ctx) || !ownerOnly(ctx)) return ctx.reply('🔒 Owner only in groups.');
    groups.setEnabled(ctx.chat.id, false);
    return ctx.reply('⏸ Automatic translation paused.');
  });

  bot.command('resume', (ctx) => {
    if (!groupOnly(ctx) || !ownerOnly(ctx)) return ctx.reply('🔒 Owner only in groups.');
    groups.setEnabled(ctx.chat.id, true);
    return ctx.reply('▶️ Automatic translation resumed.');
  });

  bot.action('noop', (ctx) => ctx.answerCbQuery());

  bot.action(/^langpage:(1|2):(\d+)$/, async (ctx) => {
    if (!ownerOnly(ctx)) return ctx.answerCbQuery('Owner only.', { show_alert: true });
    await ctx.answerCbQuery();
    return ctx.editMessageReplyMarkup(languageKeyboard(Number(ctx.match[1]), Number(ctx.match[2])).reply_markup);
  });

  bot.action(/^lang:(1|2):(.+)$/, async (ctx) => {
    if (!ownerOnly(ctx)) return ctx.answerCbQuery('Owner only.', { show_alert: true });
    const position = Number(ctx.match[1]);
    const code = ctx.match[2];
    const chatId = String(ctx.callbackQuery.message.chat.id);
    const selected = LANGUAGE_MAP.get(code);
    if (!selected) return ctx.answerCbQuery('Invalid language.', { show_alert: true });

    if (position === 1) {
      pending.set(chatId, { languageA: code });
      await ctx.answerCbQuery(`${selected.name} selected`);
      return ctx.editMessageText(
        `✅ First: ${selected.flag} ${selected.name}\n\n2️⃣ Select the second language:`,
        languageKeyboard(2, 0)
      );
    }

    const languageA = pending.get(chatId)?.languageA;
    if (!languageA) return ctx.answerCbQuery('Run /language again.', { show_alert: true });
    if (languageA === code) return ctx.answerCbQuery('Choose a different language.', { show_alert: true });

    const first = LANGUAGE_MAP.get(languageA);
    groups.setLanguages(chatId, ctx.callbackQuery.message.chat.title || '', languageA, code);
    pending.delete(chatId);
    await ctx.answerCbQuery('Saved');
    return ctx.editMessageText([
      '✅ Two-way translation active',
      '',
      `${first.flag} ${first.name}`,
      '↕️',
      `${selected.flag} ${selected.name}`
    ].join('\n'));
  });

  bot.action('admin:stats', async (ctx) => {
    if (!ownerOnly(ctx)) return ctx.answerCbQuery('Owner only.', { show_alert: true });
    const all = stats.overview();
    await ctx.answerCbQuery();
    return ctx.reply(`📊 ${all.successful || 0} successful translations · ${all.failed || 0} failed`);
  });

  bot.action('admin:groups', async (ctx) => {
    if (!ownerOnly(ctx)) return ctx.answerCbQuery('Owner only.', { show_alert: true });
    const rows = groups.listGroups().slice(0, 10);
    await ctx.answerCbQuery();
    return ctx.reply(rows.length
      ? rows.map((g) => `• ${g.chat_title || g.chat_id}: ${g.language_a} ↔ ${g.language_b} (${g.translations})`).join('\n')
      : 'No groups registered yet.');
  });

  bot.action('admin:performance', async (ctx) => {
    if (!ownerOnly(ctx)) return ctx.answerCbQuery('Owner only.', { show_alert: true });
    const all = stats.overview();
    await ctx.answerCbQuery();
    return ctx.reply(`⚡ Average latency: ${all.avg_latency || 0} ms\n🧠 Cache items: ${cacheSize()}`);
  });

  bot.action('admin:help', async (ctx) => {
    if (!ownerOnly(ctx)) return ctx.answerCbQuery('Owner only.', { show_alert: true });
    await ctx.answerCbQuery();
    return ctx.reply('Use /language, /pause, /resume, /reset, /stats and the web dashboard.');
  });
}

module.exports = { registerCommands };
