const { Telegraf, Markup } = require('telegraf');
const db = require('../database/db');
const env = require('../config/env');
const { translateText, detectLanguage } = require('./services/translation');
const { getOrCreateGroup, updateGroup } = require('./services/group-settings');
const { createEnquiry } = require('./services/notifications');

function buildBot() {
  if (!env.botToken) return null;
  const bot = new Telegraf(env.botToken);

  bot.start(async (ctx) => {
    await ctx.reply(
      '🏢 Welcome to Maline Apartments V4\n\nBrowse apartments, schedule a viewing, contact staff, or open the Mini App.',
      Markup.inlineKeyboard([
        [Markup.button.webApp('🏠 Open Apartments', env.webAppUrl)],
        [Markup.button.callback('📅 Schedule Viewing', 'customer:new_enquiry')],
        [Markup.button.callback('🌐 Language Help', 'customer:language_help')]
      ])
    );
  });

  bot.command('help', ctx => ctx.reply([
    'Available commands:',
    '/start - Open the customer menu',
    '/settings - View group settings',
    '/setlanguages en zh - Set two group languages',
    '/translation_on or /translation_off',
    '/welcome_on or /welcome_off',
    '/setstaff - Make this group the staff notification group'
  ].join('\n')));

  bot.command('settings', async (ctx) => {
    if (!['group','supergroup'].includes(ctx.chat.type)) return ctx.reply('Use this command inside a group.');
    const g = getOrCreateGroup(ctx.chat);
    await ctx.reply(`⚙️ Group Settings\n\nTranslation: ${g.translation_enabled ? 'ON' : 'OFF'}\nLanguages: ${g.primary_language} ↔ ${g.secondary_language}\nOther language mode: ${g.other_language_mode}\nWelcome: ${g.welcome_enabled ? 'ON' : 'OFF'}\nStaff group: ${g.staff_group_id || 'Not set'}`);
  });

  async function requireAdmin(ctx) {
    if (!['group','supergroup'].includes(ctx.chat.type)) return false;
    const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
    return ['creator','administrator'].includes(member.status);
  }

  bot.command('setlanguages', async (ctx) => {
    if (!(await requireAdmin(ctx))) return ctx.reply('Only group admins can change languages.');
    const args = ctx.message.text.trim().split(/\s+/).slice(1);
    if (args.length !== 2) return ctx.reply('Usage: /setlanguages en zh');
    getOrCreateGroup(ctx.chat);
    updateGroup(ctx.chat.id, { primary_language: args[0].toLowerCase(), secondary_language: args[1].toLowerCase() });
    await ctx.reply(`✅ Automatic translation set to ${args[0]} ↔ ${args[1]}`);
  });

  for (const [command, field, value, reply] of [
    ['translation_on','translation_enabled',1,'✅ Automatic translation enabled.'],
    ['translation_off','translation_enabled',0,'⛔ Automatic translation disabled.'],
    ['welcome_on','welcome_enabled',1,'✅ Automatic welcome enabled.'],
    ['welcome_off','welcome_enabled',0,'⛔ Automatic welcome disabled.']
  ]) {
    bot.command(command, async ctx => {
      if (!(await requireAdmin(ctx))) return ctx.reply('Only group admins can change this setting.');
      getOrCreateGroup(ctx.chat); updateGroup(ctx.chat.id, { [field]: value }); await ctx.reply(reply);
    });
  }

  bot.command('setstaff', async (ctx) => {
    if (!(await requireAdmin(ctx))) return ctx.reply('Only group admins can use this command.');
    getOrCreateGroup(ctx.chat);
    updateGroup(ctx.chat.id, { staff_group_id: String(ctx.chat.id) });
    db.prepare(`INSERT INTO app_settings(key,value) VALUES('staff_group_id',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`).run(String(ctx.chat.id));
    await ctx.reply('✅ This group is now the main staff notification group.');
  });

  bot.on('new_chat_members', async (ctx) => {
    const g = getOrCreateGroup(ctx.chat);
    if (!g.welcome_enabled) return;
    for (const member of ctx.message.new_chat_members) {
      if (member.is_bot) continue;
      const custom = g.welcome_message || `👋 Welcome, {first_name}!\n\nWelcome to {group_name}. 🏢💗\n\n🏠 Ask about apartments\n📅 Schedule a viewing\n🛠 Request assistance\n🌐 Auto translation: {primary_language} ↔ {secondary_language}\n\nUse /help to see available commands.`;
      const message = custom
        .replaceAll('{first_name}', member.first_name || 'there')
        .replaceAll('{group_name}', ctx.chat.title || 'Maline Apartments')
        .replaceAll('{primary_language}', g.primary_language)
        .replaceAll('{secondary_language}', g.secondary_language);
      await ctx.reply(message, Markup.inlineKeyboard([[Markup.button.webApp('🏠 View Apartments', env.webAppUrl)], [Markup.button.callback('📅 Schedule Viewing', 'customer:new_enquiry')]]));
    }
  });

  bot.action('customer:new_enquiry', async ctx => {
    await ctx.answerCbQuery();
    await ctx.reply('Please send your request in one message using this format:\n\nName: ...\nPhone: ...\nRoom: ...\nDate: ...\nMessage: ...\n\nStart the message with #viewing');
  });
  bot.action('customer:language_help', async ctx => { await ctx.answerCbQuery(); await ctx.reply('In a group, an admin can use /setlanguages en zh. Replace the language codes with the two languages required.'); });

  bot.action(/^enquiry:(accepted|pending|declined):(.+)$/, async ctx => {
    const [, status, reference] = ctx.match;
    const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
    if (!['creator','administrator'].includes(member.status)) return ctx.answerCbQuery('Admins only', { show_alert: true });
    db.prepare('UPDATE enquiries SET status = ?, assigned_to = ? WHERE reference = ?').run(status, ctx.from.username || ctx.from.first_name, reference);
    await ctx.answerCbQuery(`Updated: ${status}`);
    await ctx.editMessageText(`${ctx.callbackQuery.message.text}\n\n✅ Status: ${status.toUpperCase()}\n👤 By: ${ctx.from.first_name}`);
  });

  bot.on('text', async (ctx, next) => {
    const text = ctx.message.text;
    if (text.startsWith('/')) return next();

    if (ctx.chat.type === 'private' && text.toLowerCase().startsWith('#viewing')) {
      const staff = db.prepare(`SELECT value FROM app_settings WHERE key='staff_group_id'`).get()?.value || env.defaultStaffGroupId;
      const lines = Object.fromEntries(text.split('\n').slice(1).map(line => {
        const i = line.indexOf(':'); return i > -1 ? [line.slice(0,i).trim().toLowerCase(), line.slice(i+1).trim()] : ['', ''];
      }).filter(([k]) => k));
      const reference = await createEnquiry(bot, {
        userId: ctx.from.id, username: ctx.from.username, name: lines.name || ctx.from.first_name,
        phone: lines.phone, subject: `Viewing: ${lines.room || 'Apartment'}`,
        preferredDate: lines.date, message: lines.message || text
      }, staff);
      return ctx.reply(`✅ Your request was sent to Maline staff.\nReference: ${reference}`);
    }

    if (!['group','supergroup'].includes(ctx.chat.type) || ctx.from.is_bot) return;
    const g = getOrCreateGroup(ctx.chat);
    if (!g.translation_enabled || text.length > 3500) return;
    try {
      const detected = await detectLanguage(text);
      let target;
      if (detected === g.primary_language) target = g.secondary_language;
      else if (detected === g.secondary_language) target = g.primary_language;
      else if (g.other_language_mode === 'ignore') return;
      else target = g.primary_language;
      const translated = await translateText(text, detected === 'auto' ? 'auto' : detected, target);
      if (!translated || translated.trim().toLowerCase() === text.trim().toLowerCase()) return;
      db.prepare('INSERT INTO translation_logs(chat_id, source_language, target_language) VALUES (?, ?, ?)').run(String(ctx.chat.id), detected, target);
      await ctx.reply(`🌐 ${detected} → ${target}\n\n${translated}`, { reply_parameters: { message_id: ctx.message.message_id } });
    } catch (err) {
      console.error('Translation error:', err.message);
    }
  });

  bot.catch(err => console.error('Bot error:', err));
  return bot;
}

module.exports = buildBot;
