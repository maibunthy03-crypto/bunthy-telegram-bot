require('dotenv').config();

const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const { Telegraf, Markup, Input } = require('telegraf');
const translatePackage = require('google-translate-api-x');
const { registerLanguageSelector } = require('./bot/language-selector');
const { getData, save, getPair, savePair, removePair } = require('./store');

const translate = typeof translatePackage === 'function'
  ? translatePackage
  : translatePackage.translate;

const BOT_TOKEN = String(process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '').trim();
const OWNER_ID = Number(process.env.OWNER_ID || 0);
const PUBLIC_URL = String(process.env.PUBLIC_URL || process.env.APP_URL || '').replace(/\/$/, '');
const PORT = Number(process.env.PORT || 8080);
const STAFF_GROUP_ID = String(process.env.STAFF_GROUP_ID || '');
const RECEPTION_PHONE = process.env.RECEPTION_PHONE || '+855 23 985 959';
const RECEPTION_TELEGRAM = process.env.RECEPTION_TELEGRAM || '';
const WEBSITE = process.env.WEBSITE || 'https://www.malineapartments.com.kh';
const GOOGLE_MAPS_URL = process.env.GOOGLE_MAPS_URL || '';
const TRANSLATION_ENABLED = String(process.env.TRANSLATION_ENABLED || 'true').toLowerCase() !== 'false';
const DEFAULT_WELCOME_ENABLED = String(process.env.WELCOME_ENABLED || 'true').toLowerCase() !== 'false';

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is missing');
  process.exit(1);
}
if (typeof translate !== 'function') {
  console.error('❌ google-translate-api-x did not load correctly');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const data = getData();
if (!data.staffGroupId && STAFF_GROUP_ID) data.staffGroupId = STAFF_GROUP_ID;

const apartments = {
  studio50: { title: 'Studio Apartment', size: '50 sqm', folder: 'studio' },
  one84: { title: '1 Bedroom Apartment', size: '84 sqm', folder: 'one-bedroom-84' },
  one91: { title: '1 Bedroom Apartment', size: '91 sqm', folder: 'one-bedroom-91' },
  two130: { title: '2 Bedroom Apartment', size: '130 sqm', folder: 'two-bedroom-130' },
  two138: { title: '2 Bedroom Apartment', size: '138 sqm', folder: 'two-bedroom-138' },
  two148: { title: '2 Bedroom Apartment', size: '148 sqm', folder: 'two-bedroom-148' },
  two150: { title: '2 Bedroom Apartment', size: '150 sqm', folder: 'two-bedroom-150' },
  three176: { title: '3 Bedroom Apartment', size: '176 sqm', folder: 'three-bedroom-176' },
  pha551: { title: 'Penthouse A (PHA)', size: '551 sqm', folder: 'pha' },
  phb465: { title: 'Penthouse B (PHB)', size: '465 sqm', folder: 'phb' },
  phc435: { title: 'Penthouse C (PHC)', size: '435 sqm', folder: 'phc' }
};

const serviceIncluded = [
  'Cable TV', 'Fully equipped kitchen', 'Iron and ironing board',
  'Safe deposit box', 'Washing machine', 'Dining table with chairs',
  'Management fee', 'One in-house parking', 'Daily newspaper at lobby',
  'Modern gym', 'Swimming pool', 'Steam and sauna', 'Kids playground',
  'Wi-Fi internet', 'Cleaning and linen change twice per week',
  'Water supply', 'Lift maintenance', 'Building maintenance'
];
const serviceExcluded = ['Telephone IDD', 'Electricity usage — $0.25/kWh', 'Rooftop sky bar'];

function isGroup(ctx) {
  return ['group', 'supergroup'].includes(ctx.chat?.type);
}

function isAdmin(ctx) {
  const id = Number(ctx.from?.id || 0);
  return id === OWNER_ID || data.admins.map(Number).includes(id);
}

function contactBlock() {
  return `📞 ${RECEPTION_PHONE}\n🌐 ${WEBSITE}${RECEPTION_TELEGRAM ? `\n💬 ${RECEPTION_TELEGRAM}` : ''}`;
}

function galleryFor(folder) {
  const images = [];
  for (let i = 1; i <= 10; i += 1) {
    for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
      const file = path.join(__dirname, 'web', 'images', folder, `${i}.${ext}`);
      if (fs.existsSync(file)) {
        images.push(`/web/images/${folder}/${i}.${ext}`);
        break;
      }
    }
  }
  const building = path.join(__dirname, 'web', 'images', 'building.jpg');
  return images.length ? images : (fs.existsSync(building) ? ['/web/images/building.jpg'] : []);
}

function mainKeyboard() {
  const rows = [];
  if (PUBLIC_URL) rows.push([Markup.button.webApp('🌸 Open Maline Mini App', `${PUBLIC_URL}/app`)]);
  rows.push(
    [Markup.button.callback('🏨 Apartments', 'apartments'), Markup.button.callback('📅 Book a Viewing', 'book')],
    [Markup.button.callback('🏊 Facilities', 'facilities'), Markup.button.callback('📞 Contact', 'contact')],
    [Markup.button.callback('📍 Location', 'location'), Markup.button.callback('🌍 Languages', 'language_help')]
  );
  return Markup.inlineKeyboard(rows);
}

async function safeMainMenu(ctx) {
  const building = path.join(__dirname, 'web', 'images', 'building.jpg');
  const caption = '🌸 Welcome to Maline Exclusive Serviced Apartments\n\nLuxury serviced apartments in the heart of Phnom Penh.';
  if (fs.existsSync(building)) {
    return ctx.replyWithPhoto(Input.fromLocalFile(building), { caption, ...mainKeyboard() });
  }
  return ctx.reply(caption, mainKeyboard());
}

function apartmentKeyboard() {
  const rows = Object.entries(apartments).map(([key, room]) => [
    Markup.button.callback(`${room.title} • ${room.size}`, `apt:${key}`)
  ]);
  rows.push([Markup.button.callback('⬅️ Main Menu', 'main')]);
  return Markup.inlineKeyboard(rows);
}

async function sendApartment(ctx, key) {
  const room = apartments[key];
  if (!room) return;
  const text = [
    `🏨 ${room.title}`,
    `📐 ${room.size}`,
    `💰 ${data.prices[key] || 'Contact us for price'}`,
    `🟢 Availability: ${data.availability[key] || 'Contact reception'}`,
    '',
    contactBlock()
  ].join('\n');
  const rows = [];
  if (PUBLIC_URL) rows.push([Markup.button.webApp('📷 View Photo Gallery', `${PUBLIC_URL}/app?room=${key}#apartments`)]);
  rows.push([Markup.button.callback('📅 Book This Apartment', `book:${key}`)]);
  rows.push([Markup.button.callback('⬅️ Apartments', 'apartments')]);
  return ctx.reply(text, Markup.inlineKeyboard(rows));
}

function baseLanguage(code) {
  return String(code || '').toLowerCase().split('-')[0];
}

async function translateMessage(text, target, source = 'auto') {
  const options = { to: target, forceTo: true, autoCorrect: true };
  if (source && source !== 'auto') options.from = source;
  const result = await translate(text, options);
  return {
    text: String(result?.text || '').trim(),
    detected: baseLanguage(result?.from?.language?.iso || '')
  };
}

function matchAutoReply(text) {
  const value = text.toLowerCase();
  const rules = [
    { keys: ['price', 'cost', 'rent', 'តម្លៃ', '价格'], reply: `💰 Please contact us for the latest price.\n${contactBlock()}` },
    { keys: ['available', 'availability', 'vacant', 'ទំនេរ', '空房'], reply: `🟢 Please contact reception for current availability.\n${contactBlock()}` },
    { keys: ['location', 'address', 'where', 'ទីតាំង', '地址'], reply: `📍 Maline Exclusive Serviced Apartments, Phnom Penh.${GOOGLE_MAPS_URL ? `\n${GOOGLE_MAPS_URL}` : ''}` },
    { keys: ['pool', 'gym', 'sauna', 'steam', 'parking', 'wifi', 'facility', 'បរិក្ខារ', '健身房'], reply: '🏊 Pool, gym, steam, sauna, kids playground, parking, Wi-Fi and reception.' }
  ];
  return rules.find(rule => rule.keys.some(key => value.includes(key)))?.reply || null;
}

async function sendInquiryToStaff(inquiry) {
  const groupId = String(data.staffGroupId || STAFF_GROUP_ID || '');
  if (!groupId) return;
  const text = [
    '🌸 NEW MALINE INQUIRY', '',
    `ID: ${inquiry.id}`,
    `Guest: ${inquiry.name}`,
    `Phone: ${inquiry.phone}`,
    `Telegram: ${inquiry.telegram || '-'}`,
    `Email: ${inquiry.email || '-'}`,
    `Apartment: ${inquiry.apartment}`,
    `Check-in: ${inquiry.checkIn}`,
    `Check-out: ${inquiry.checkOut || '-'}`,
    `Stay: ${inquiry.stay}`,
    `Budget: ${inquiry.budget || '-'}`,
    `Message: ${inquiry.message || '-'}`
  ].join('\n');
  await bot.telegram.sendMessage(groupId, text);
}

bot.start(async ctx => {
  data.stats.starts += 1;
  data.users[String(ctx.from.id)] = {
    name: [ctx.from.first_name, ctx.from.last_name].filter(Boolean).join(' '),
    username: ctx.from.username || '',
    lastSeen: new Date().toISOString()
  };
  save();
  await safeMainMenu(ctx);
});

bot.command('menu', safeMainMenu);
bot.command('ping', ctx => ctx.reply('✅ Bot, translation and Mini App server are online.'));
bot.command('id', ctx => ctx.reply(`Chat ID: ${ctx.chat.id}\nYour ID: ${ctx.from.id}`));

bot.command('admin', ctx => {
  if (!isAdmin(ctx)) return ctx.reply('🔒 Admin only.');
  return ctx.reply([
    '👑 Admin Commands',
    '/stats', '/languages', '/translation_off',
    '/setprice ROOM_KEY PRICE',
    '/setavailability ROOM_KEY STATUS',
    '/welcome_on', '/welcome_off',
    '/autoreply_on', '/autoreply_off',
    '/setstaffgroup', '',
    'Room keys:', ...Object.keys(apartments)
  ].join('\n'));
});

bot.command('stats', ctx => {
  if (!isAdmin(ctx)) return ctx.reply('🔒 Admin only.');
  const s = data.stats;
  return ctx.reply(`📊 Starts: ${s.starts}\nMini App opens: ${s.miniAppOpens}\nInquiries: ${s.inquiries}\nTranslations: ${s.translations}\nWelcomes: ${s.welcomes}\nAuto replies: ${s.autoReplies}`);
});

bot.command('setprice', ctx => {
  if (!isAdmin(ctx)) return ctx.reply('🔒 Admin only.');
  const [, key, ...value] = ctx.message.text.trim().split(/\s+/);
  if (!apartments[key] || !value.length) return ctx.reply('Use: /setprice studio50 $1,200/month');
  data.prices[key] = value.join(' ');
  save();
  return ctx.reply(`✅ Price updated\n${key}: ${data.prices[key]}`);
});

bot.command('setavailability', ctx => {
  if (!isAdmin(ctx)) return ctx.reply('🔒 Admin only.');
  const [, key, ...value] = ctx.message.text.trim().split(/\s+/);
  if (!apartments[key] || !value.length) return ctx.reply('Use: /setavailability studio50 Available');
  data.availability[key] = value.join(' ');
  save();
  return ctx.reply(`✅ Availability updated\n${key}: ${data.availability[key]}`);
});

bot.command('setstaffgroup', ctx => {
  if (!isAdmin(ctx) || !isGroup(ctx)) return ctx.reply('Run this command inside the staff group.');
  data.staffGroupId = String(ctx.chat.id);
  save();
  return ctx.reply('✅ Staff group saved.');
});

for (const [command, field, enabled] of [
  ['welcome_on', 'welcomeEnabled', true],
  ['welcome_off', 'welcomeEnabled', false],
  ['autoreply_on', 'autoReplyEnabled', true],
  ['autoreply_off', 'autoReplyEnabled', false]
]) {
  bot.command(command, ctx => {
    if (!isAdmin(ctx) || !isGroup(ctx)) return ctx.reply('Admin group command only.');
    data[field][String(ctx.chat.id)] = enabled;
    save();
    return ctx.reply(`✅ ${command.replace('_', ' ')}`);
  });
}

bot.command('translation_off', ctx => {
  if (!isAdmin(ctx) || !isGroup(ctx)) return ctx.reply('Admin group command only.');
  removePair(String(ctx.chat.id));
  return ctx.reply('✅ Translation disabled.');
});

registerLanguageSelector(bot, {
  ownerId: OWNER_ID,
  getPair,
  savePair,
  removePair
});

bot.action('main', async ctx => { await ctx.answerCbQuery(); return safeMainMenu(ctx); });
bot.action('apartments', async ctx => { await ctx.answerCbQuery(); return ctx.reply('Choose an apartment:', apartmentKeyboard()); });
bot.action(/^apt:(.+)$/, async ctx => { await ctx.answerCbQuery(); return sendApartment(ctx, ctx.match[1]); });
bot.action('book', async ctx => {
  await ctx.answerCbQuery();
  if (PUBLIC_URL) return ctx.reply('Open booking form:', Markup.inlineKeyboard([[Markup.button.webApp('📅 Open Booking Form', `${PUBLIC_URL}/app#booking`)]]));
  return ctx.reply(contactBlock());
});
bot.action(/^book:(.+)$/, async ctx => {
  await ctx.answerCbQuery();
  if (PUBLIC_URL) return ctx.reply('Continue booking:', Markup.inlineKeyboard([[Markup.button.webApp('📅 Continue', `${PUBLIC_URL}/app?room=${ctx.match[1]}#booking`)]]));
});
bot.action('facilities', async ctx => { await ctx.answerCbQuery(); return ctx.reply('🏊 Pool\n💪 Gym\n♨️ Steam & Sauna\n🧸 Kids Playground\n🚗 Parking\n📶 Wi-Fi\n🛡️ Security\n🛎️ Reception'); });
bot.action('contact', async ctx => {
  await ctx.answerCbQuery();
  const rows = [[Markup.button.url('🌐 Website', WEBSITE)]];
  if (RECEPTION_TELEGRAM) rows.unshift([Markup.button.url('💬 Telegram Reception', RECEPTION_TELEGRAM)]);
  return ctx.reply(`📞 ${RECEPTION_PHONE}`, Markup.inlineKeyboard(rows));
});
bot.action('location', async ctx => {
  await ctx.answerCbQuery();
  return ctx.reply('📍 Maline Exclusive Serviced Apartments, Phnom Penh', GOOGLE_MAPS_URL ? Markup.inlineKeyboard([[Markup.button.url('Open Google Maps', GOOGLE_MAPS_URL)]]) : undefined);
});
bot.action('language_help', async ctx => { await ctx.answerCbQuery(); return ctx.reply('Use /languages inside a group to choose two translation languages.'); });

const welcomeCache = new Map();
async function welcomeMember(ctx, member) {
  if (!member || member.is_bot) return;
  const chatId = String(ctx.chat.id);
  const enabled = data.welcomeEnabled[chatId];
  if (enabled === false || (enabled === undefined && !DEFAULT_WELCOME_ENABLED)) return;
  const cacheKey = `${chatId}:${member.id}`;
  if (Date.now() - (welcomeCache.get(cacheKey) || 0) < 120000) return;
  welcomeCache.set(cacheKey, Date.now());
  const rows = [];
  if (PUBLIC_URL) rows.push([Markup.button.webApp('🌸 Open Maline Mini App', `${PUBLIC_URL}/app`)]);
  if (RECEPTION_TELEGRAM) rows.push([Markup.button.url('💬 Contact Us', RECEPTION_TELEGRAM)]);
  await ctx.reply(`🌸 Welcome, ${member.first_name || 'Guest'}!\n\nWelcome to Maline Exclusive Serviced Apartments.\n${contactBlock()}`, Markup.inlineKeyboard(rows));
  data.stats.welcomes += 1;
  save();
}

bot.on('new_chat_members', async ctx => {
  for (const member of ctx.message.new_chat_members || []) await welcomeMember(ctx, member);
});
bot.on('chat_member', async ctx => {
  const update = ctx.update.chat_member;
  const oldStatus = update.old_chat_member?.status;
  const newStatus = update.new_chat_member?.status;
  if (['left', 'kicked'].includes(oldStatus) && ['member', 'administrator', 'creator', 'restricted'].includes(newStatus)) {
    await welcomeMember(ctx, update.new_chat_member?.user);
  }
});

bot.on('text', async (ctx, next) => {
  const text = String(ctx.message?.text || '').trim();
  if (!text || text.startsWith('/')) return next();
  if (!isGroup(ctx) || ctx.from?.is_bot) return next();

  const pair = await getPair(String(ctx.chat.id));
  if (pair?.a && pair?.b && TRANSLATION_ENABLED) {
    try {
      const probe = await translateMessage(text, pair.a);
      const detected = baseLanguage(probe.detected);
      const first = baseLanguage(pair.a);
      const second = baseLanguage(pair.b);
      let translatedText = '';
      if (detected === second) translatedText = probe.text;
      else if (detected === first) translatedText = (await translateMessage(text, pair.b, pair.a)).text;
      if (translatedText && translatedText.toLowerCase() !== text.toLowerCase()) {
        data.stats.translations += 1;
        save();
        return ctx.reply(`🌐 ${translatedText}`, { reply_parameters: { message_id: ctx.message.message_id } });
      }
    } catch (error) {
      console.error('❌ Translation error:', error?.message || error);
    }
  }

  if (data.autoReplyEnabled[String(ctx.chat.id)] !== false) {
    const reply = matchAutoReply(text);
    if (reply) {
      data.stats.autoReplies += 1;
      save();
      return ctx.reply(reply, { reply_parameters: { message_id: ctx.message.message_id } });
    }
  }
  return next();
});

bot.catch(error => console.error('❌ Bot error:', error));

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store'
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1000000) reject(new Error('Request body too large'));
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const WEB_ROOT = path.join(__dirname, 'web');

function sendFile(res, file, cache = 'no-cache') {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end(`File not found: ${path.relative(process.cwd(), file)}`);
  }
  res.writeHead(200, {
    'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': cache
  });
  const stream = fs.createReadStream(file);
  stream.on('error', error => {
    console.error('❌ File stream error:', error);
    if (!res.writableEnded) res.end('Unable to load file.');
  });
  return stream.pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);

    if (requestPath === '/' || requestPath === '/health') {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Maline Complete Bot V5 is running');
    }

    if (requestPath === '/debug/paths') {
      return sendJson(res, 200, {
        cwd: process.cwd(),
        dirname: __dirname,
        webRoot: WEB_ROOT,
        appFile: path.join(WEB_ROOT, 'index.html'),
        appExists: fs.existsSync(path.join(WEB_ROOT, 'index.html'))
      });
    }

    if (requestPath === '/api/config') {
      return sendJson(res, 200, {
        phone: RECEPTION_PHONE,
        telegram: RECEPTION_TELEGRAM,
        website: WEBSITE,
        maps: GOOGLE_MAPS_URL,
        serviceIncluded,
        serviceExcluded,
        apartments: Object.entries(apartments).map(([key, room]) => ({
          key,
          ...room,
          images: galleryFor(room.folder),
          price: data.prices[key] || 'Contact us for price',
          availability: data.availability[key] || 'Contact reception'
        }))
      });
    }

    if (requestPath === '/api/open' && req.method === 'POST') {
      data.stats.miniAppOpens += 1;
      save();
      return sendJson(res, 200, { success: true });
    }

    if (requestPath === '/api/inquiry' && req.method === 'POST') {
      try {
        const body = JSON.parse(await readBody(req));
        for (const field of ['name', 'phone', 'apartment', 'checkIn', 'stay']) {
          if (!String(body[field] || '').trim()) return sendJson(res, 400, { success: false, message: 'Please complete all required fields.' });
        }
        const inquiry = {
          id: crypto.randomBytes(4).toString('hex').toUpperCase(),
          ...body,
          status: 'new',
          createdAt: new Date().toISOString()
        };
        data.inquiries.unshift(inquiry);
        data.inquiries = data.inquiries.slice(0, 500);
        data.stats.inquiries += 1;
        save();
        await sendInquiryToStaff(inquiry);
        return sendJson(res, 200, { success: true, inquiryId: inquiry.id });
      } catch (error) {
        console.error('❌ Inquiry error:', error);
        return sendJson(res, 500, { success: false, message: 'Unable to send inquiry.' });
      }
    }

    if (requestPath === '/app' || requestPath === '/app/') {
      return sendFile(res, path.join(WEB_ROOT, 'index.html'));
    }

    if (requestPath.startsWith('/web/')) {
      const relative = path.normalize(requestPath.replace(/^\/web\//, '')).replace(/^(\.\.(\/|\\|$))+/, '');
      const file = path.join(WEB_ROOT, relative);
      if (!file.startsWith(WEB_ROOT)) {
        res.writeHead(403);
        return res.end('Forbidden');
      }
      return sendFile(res, file, 'public, max-age=300');
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Not found');
  } catch (error) {
    console.error('❌ HTTP route error:', error);
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    if (!res.writableEnded) res.end('Internal server error');
  }
});

server.on('error', error => console.error('❌ Web server error:', error));
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Web server on ${PORT}`);
  console.log(`✅ Mini App file: ${path.join(WEB_ROOT, 'index.html')}`);
  console.log(`✅ Mini App exists: ${fs.existsSync(path.join(WEB_ROOT, 'index.html'))}`);
});

async function startBot() {
  try {
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    const me = await bot.telegram.getMe();
    console.log(`✅ Connected to @${me.username}`);
    console.log('✅ google-translate-api-x loaded');
    await bot.launch({
      dropPendingUpdates: true,
      allowedUpdates: ['message', 'callback_query', 'chat_member', 'my_chat_member']
    });
    console.log('✅ Telegram polling is running');
  } catch (error) {
    console.error('❌ BOT START FAILED:', error?.response?.description || error?.message || error);
    console.error('ℹ️ Web/Mini App server will stay online. Stop the other bot instance, then redeploy.');
  }
}

startBot();
process.once('SIGINT', () => { bot.stop('SIGINT'); server.close(); });
process.once('SIGTERM', () => { bot.stop('SIGTERM'); server.close(); });
