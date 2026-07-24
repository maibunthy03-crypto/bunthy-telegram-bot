require('dotenv').config();

const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const { Telegraf, Markup, Input } = require('telegraf');
const { translate } = require('@vitalets/google-translate-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = Number(process.env.OWNER_ID || 0);
const DEFAULT_STAFF_GROUP_ID = String(process.env.STAFF_GROUP_ID || '');
const RECEPTION_PHONE = process.env.RECEPTION_PHONE || '+855 23 987 888';
const RECEPTION_TELEGRAM = process.env.RECEPTION_TELEGRAM || '';
const WEBSITE = process.env.WEBSITE || 'https://www.malineapartments.com.kh';
const GOOGLE_MAPS_URL = process.env.GOOGLE_MAPS_URL || '';
const PUBLIC_URL = String(process.env.PUBLIC_URL || '').replace(/\/$/, '');
const PORT = Number(process.env.PORT || 8000);

if (!BOT_TOKEN) {
  console.error('BOT_TOKEN is missing.');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const DATA_FILE = path.join(__dirname, 'data', 'bot-data.json');

const apartments = {
  studio50: { title: 'Studio Apartment', size: '50 sqm', image: '/web/images/studio.jpg' },
  one84: { title: '1 Bedroom Apartment', size: '84 sqm', image: '/web/images/one-bedroom-84.jpg' },
  one91: { title: '1 Bedroom Apartment', size: '91 sqm', image: '/web/images/one-bedroom-91.jpg' },
  two130: { title: '2 Bedroom Apartment', size: '130 sqm', image: '/web/images/two-bedroom-130.jpg' },
  two138: { title: '2 Bedroom Apartment', size: '138 sqm', image: '/web/images/two-bedroom-138.jpg' },
  two148: { title: '2 Bedroom Apartment', size: '148 sqm', image: '/web/images/two-bedroom-148.jpg' },
  two150: { title: '2 Bedroom Apartment', size: '150 sqm', image: '/web/images/two-bedroom-150.jpg' },
  pha551: { title: 'Penthouse A (PHA)', size: '551 sqm', image: '/web/images/pha.jpg' },
  phb465: { title: 'Penthouse B (PHB)', size: '465 sqm', image: '/web/images/phb.jpg' },
  phc435: { title: 'Penthouse C (PHC)', size: '435 sqm', image: '/web/images/phc.jpg' }
};

function defaultData() {
  return {
    users: {},
    admins: [],
    staffGroupId: DEFAULT_STAFF_GROUP_ID,
    translationPairs: {},
    welcomeEnabled: {},
    autoReplyEnabled: {},
    prices: {},
    availability: {},
    inquiries: [],
    stats: { starts: 0, inquiries: 0, translations: 0, welcomes: 0, autoReplies: 0, miniAppOpens: 0 }
  };
}

function loadData() {
  try {
    return { ...defaultData(), ...JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) };
  } catch {
    return defaultData();
  }
}

let data = loadData();

function saveData() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function isAdmin(ctx) {
  const id = Number(ctx.from?.id || 0);
  return id === OWNER_ID || data.admins.map(Number).includes(id);
}

function isGroup(ctx) {
  return ['group', 'supergroup'].includes(ctx.chat?.type);
}

function staffGroupId() {
  return String(data.staffGroupId || DEFAULT_STAFF_GROUP_ID || '');
}

function mainKeyboard() {
  const rows = [];
  if (PUBLIC_URL) {
    rows.push([Markup.button.webApp('🌸 Open Maline Mini App', `${PUBLIC_URL}/app`)]);
  }
  rows.push(
    [Markup.button.callback('🏨 Apartments', 'apartments'), Markup.button.callback('📅 Book a Viewing', 'book')],
    [Markup.button.callback('🏊 Facilities', 'facilities'), Markup.button.callback('📞 Contact', 'contact')],
    [Markup.button.callback('📍 Location', 'location'), Markup.button.callback('🌍 Languages', 'language_help')]
  );
  return Markup.inlineKeyboard(rows);
}

async function safeMainMenu(ctx) {
  const building = path.join(__dirname, 'web', 'images', 'building.jpg');
  const caption = [
    '🌸 Welcome to Maline Exclusive Serviced Apartments',
    '',
    'Luxury serviced apartments in the heart of Phnom Penh.',
    'Explore rooms, facilities and send a viewing inquiry.'
  ].join('\n');

  if (fs.existsSync(building)) {
    return ctx.replyWithPhoto(Input.fromLocalFile(building), { caption, ...mainKeyboard() });
  }
  return ctx.reply(caption, mainKeyboard());
}

function apartmentKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('Studio • 50 sqm', 'apt:studio50')],
    [Markup.button.callback('1 Bedroom • 84 sqm', 'apt:one84'), Markup.button.callback('91 sqm', 'apt:one91')],
    [Markup.button.callback('2 Bedroom • 130 sqm', 'apt:two130'), Markup.button.callback('138 sqm', 'apt:two138')],
    [Markup.button.callback('2 Bedroom • 148 sqm', 'apt:two148'), Markup.button.callback('150 sqm', 'apt:two150')],
    [Markup.button.callback('PHA • 551 sqm', 'apt:pha551')],
    [Markup.button.callback('PHB • 465 sqm', 'apt:phb465'), Markup.button.callback('PHC • 435 sqm', 'apt:phc435')],
    [Markup.button.callback('⬅️ Main Menu', 'main')]
  ]);
}

async function sendApartment(ctx, key) {
  const apt = apartments[key];
  if (!apt) return;
  const price = data.prices[key] || 'Contact us for price';
  const availability = data.availability[key] || 'Contact reception';
  const text = [
    `🏨 ${apt.title}`,
    `📐 ${apt.size}`,
    `💰 ${price}`,
    `🟢 Availability: ${availability}`,
    '',
    'Open the Mini App to view photos and submit an inquiry.'
  ].join('\n');

  const buttons = Markup.inlineKeyboard([
    ...(PUBLIC_URL ? [[Markup.button.webApp('📷 View in Mini App', `${PUBLIC_URL}/app#apartments`)]] : []),
    [Markup.button.callback('📅 Book This Apartment', `book:${key}`)],
    [Markup.button.callback('⬅️ Apartments', 'apartments')]
  ]);
  return ctx.reply(text, buttons);
}

function matchAutoReply(text) {
  const t = text.toLowerCase();
  const rules = [
    { keys: ['price', 'cost', 'rent', 'តម្លៃ', '多少钱', '价格'], reply: '💰 Please open the Mini App for apartment sizes and submit an inquiry for the latest price.' },
    { keys: ['available', 'availability', 'vacant', 'ទំនេរ', '有房', '空房'], reply: '🟢 Availability changes frequently. Please submit an inquiry and our staff will confirm quickly.' },
    { keys: ['location', 'address', 'where', 'ទីតាំង', '地址', '在哪里'], reply: `📍 Maline Exclusive Serviced Apartments is in central Phnom Penh.${GOOGLE_MAPS_URL ? `\n${GOOGLE_MAPS_URL}` : ''}` },
    { keys: ['phone', 'contact', 'reception', 'ទាក់ទង', '电话', '联系'], reply: `📞 Reception: ${RECEPTION_PHONE}` },
    { keys: ['pool', 'gym', 'sauna', 'steam', 'parking', 'wifi', 'facility', 'បរិក្ខារ', '泳池', '健身房'], reply: '🏊 Facilities include swimming pool, gym, steam and sauna, parking, Wi-Fi, security and reception service.' },
    { keys: ['studio', '1 bedroom', 'one bedroom', '2 bedroom', 'two bedroom', 'penthouse'], reply: '🏨 We offer Studio 50 sqm, 1 Bedroom 84/91 sqm, 2 Bedroom 130/138/148/150 sqm, and Penthouses PHA 551, PHB 465, PHC 435 sqm.' }
  ];
  return rules.find(rule => rule.keys.some(key => t.includes(key)))?.reply || null;
}

async function sendInquiryToStaff(inquiry) {
  const groupId = staffGroupId();
  if (!groupId) return;
  const text = [
    '🌸 NEW MALINE INQUIRY',
    '',
    `ID: ${inquiry.id}`,
    `Guest: ${inquiry.name}`,
    `Phone: ${inquiry.phone}`,
    `Telegram: ${inquiry.telegram || '-'}`,
    `Email: ${inquiry.email || '-'}`,
    `Apartment: ${inquiry.apartment}`,
    `Check-in: ${inquiry.checkIn}`,
    `Stay: ${inquiry.stay}`,
    `Budget: ${inquiry.budget || '-'}`,
    `Message: ${inquiry.message || '-'}`,
    '',
    `Submitted: ${inquiry.createdAt}`
  ].join('\n');

  await bot.telegram.sendMessage(groupId, text, Markup.inlineKeyboard([
    [Markup.button.callback('✅ Contacted', `inq:contacted:${inquiry.id}`)],
    [Markup.button.callback('✔ Completed', `inq:completed:${inquiry.id}`), Markup.button.callback('❌ Cancelled', `inq:cancelled:${inquiry.id}`)]
  ]));
}

bot.start(async (ctx) => {
  data.stats.starts += 1;
  data.users[String(ctx.from.id)] = {
    name: [ctx.from.first_name, ctx.from.last_name].filter(Boolean).join(' '),
    username: ctx.from.username || '',
    lastSeen: new Date().toISOString()
  };
  saveData();
  await safeMainMenu(ctx);
});

bot.command('menu', safeMainMenu);
bot.command('id', (ctx) => ctx.reply(`Chat ID: ${ctx.chat.id}\nYour ID: ${ctx.from.id}`));

bot.command('admin', async (ctx) => {
  if (!isAdmin(ctx)) return ctx.reply('🔒 Admin only.');
  return ctx.reply([
    '👑 Maline Admin Commands',
    '',
    '/stats',
    '/addadmin USER_ID',
    '/removeadmin USER_ID',
    '/setstaffgroup (run inside staff group)',
    '/welcome_on or /welcome_off',
    '/autoreply_on or /autoreply_off',
    '/language en zh-CN',
    '/translation_off',
    '/setprice ROOM_KEY PRICE',
    '/setavailability ROOM_KEY STATUS',
    '',
    `Room keys: ${Object.keys(apartments).join(', ')}`
  ].join('\n'));
});

bot.command('stats', (ctx) => {
  if (!isAdmin(ctx)) return;
  const s = data.stats;
  return ctx.reply([
    '📊 Maline Bot Statistics',
    `Starts: ${s.starts}`,
    `Mini App opens: ${s.miniAppOpens}`,
    `Inquiries: ${s.inquiries}`,
    `Translations: ${s.translations}`,
    `Welcomes: ${s.welcomes}`,
    `Auto replies: ${s.autoReplies}`
  ].join('\n'));
});

bot.command('addadmin', (ctx) => {
  if (Number(ctx.from.id) !== OWNER_ID) return ctx.reply('Owner only.');
  const id = Number(ctx.message.text.split(/\s+/)[1]);
  if (!id) return ctx.reply('Use: /addadmin USER_ID');
  if (!data.admins.includes(id)) data.admins.push(id);
  saveData();
  return ctx.reply(`✅ Admin added: ${id}`);
});

bot.command('removeadmin', (ctx) => {
  if (Number(ctx.from.id) !== OWNER_ID) return ctx.reply('Owner only.');
  const id = Number(ctx.message.text.split(/\s+/)[1]);
  data.admins = data.admins.filter(item => Number(item) !== id);
  saveData();
  return ctx.reply(`✅ Admin removed: ${id}`);
});

bot.command('setstaffgroup', (ctx) => {
  if (!isAdmin(ctx) || !isGroup(ctx)) return ctx.reply('Run this command as an admin inside the staff group.');
  data.staffGroupId = String(ctx.chat.id);
  saveData();
  return ctx.reply(`✅ Staff group saved: ${ctx.chat.id}`);
});

for (const [command, field, enabled] of [
  ['welcome_on', 'welcomeEnabled', true],
  ['welcome_off', 'welcomeEnabled', false],
  ['autoreply_on', 'autoReplyEnabled', true],
  ['autoreply_off', 'autoReplyEnabled', false]
]) {
  bot.command(command, (ctx) => {
    if (!isAdmin(ctx) || !isGroup(ctx)) return ctx.reply('Admin group command only.');
    data[field][String(ctx.chat.id)] = enabled;
    saveData();
    return ctx.reply(`✅ ${command.replace('_', ' ')}.`);
  });
}

bot.command('language', async (ctx) => {
  if (!isAdmin(ctx) || !isGroup(ctx)) return ctx.reply('Admin group command only.');
  const parts = ctx.message.text.trim().split(/\s+/);
  if (parts.length !== 3) return ctx.reply('Use: /language en zh-CN');
  data.translationPairs[String(ctx.chat.id)] = { a: parts[1], b: parts[2] };
  saveData();
  return ctx.reply(`✅ Translation enabled: ${parts[1]} ↔ ${parts[2]}`);
});

bot.command('translation_off', (ctx) => {
  if (!isAdmin(ctx) || !isGroup(ctx)) return ctx.reply('Admin group command only.');
  delete data.translationPairs[String(ctx.chat.id)];
  saveData();
  return ctx.reply('✅ Translation disabled.');
});

bot.command('setprice', (ctx) => {
  if (!isAdmin(ctx)) return;
  const [, key, ...value] = ctx.message.text.trim().split(/\s+/);
  if (!apartments[key] || !value.length) return ctx.reply('Use: /setprice studio50 $1,200/month');
  data.prices[key] = value.join(' ');
  saveData();
  return ctx.reply(`✅ ${key} price updated.`);
});

bot.command('setavailability', (ctx) => {
  if (!isAdmin(ctx)) return;
  const [, key, ...value] = ctx.message.text.trim().split(/\s+/);
  if (!apartments[key] || !value.length) return ctx.reply('Use: /setavailability studio50 Available');
  data.availability[key] = value.join(' ');
  saveData();
  return ctx.reply(`✅ ${key} availability updated.`);
});

bot.action('main', async (ctx) => { await ctx.answerCbQuery(); await safeMainMenu(ctx); });
bot.action('apartments', async (ctx) => { await ctx.answerCbQuery(); await ctx.reply('Choose an apartment:', apartmentKeyboard()); });
bot.action(/^apt:(.+)$/, async (ctx) => { await ctx.answerCbQuery(); await sendApartment(ctx, ctx.match[1]); });
bot.action('book', async (ctx) => {
  await ctx.answerCbQuery();
  if (PUBLIC_URL) return ctx.reply('Open the Mini App and complete the booking inquiry.', Markup.inlineKeyboard([[Markup.button.webApp('📅 Open Booking Form', `${PUBLIC_URL}/app#booking`)]]));
  return ctx.reply('Please contact reception to book a viewing.');
});
bot.action(/^book:(.+)$/, async (ctx) => {
  await ctx.answerCbQuery();
  const key = ctx.match[1];
  if (PUBLIC_URL) return ctx.reply(`Book ${apartments[key]?.title || 'apartment'} in the Mini App.`, Markup.inlineKeyboard([[Markup.button.webApp('📅 Continue', `${PUBLIC_URL}/app?room=${key}#booking`)]]));
});
bot.action('facilities', async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.reply('🏊 Pool\n💪 Gym\n♨️ Steam & Sauna\n🚗 Parking\n📶 Wi-Fi\n🛡️ 24/7 Security\n🛎️ Reception');
});
bot.action('contact', async (ctx) => {
  await ctx.answerCbQuery();
  const rows = [[Markup.button.url('🌐 Website', WEBSITE)]];
  if (RECEPTION_TELEGRAM) rows.unshift([Markup.button.url('💬 Telegram Reception', RECEPTION_TELEGRAM)]);
  return ctx.reply(`📞 Reception: ${RECEPTION_PHONE}`, Markup.inlineKeyboard(rows));
});
bot.action('location', async (ctx) => {
  await ctx.answerCbQuery();
  const keyboard = GOOGLE_MAPS_URL ? Markup.inlineKeyboard([[Markup.button.url('Open Google Maps', GOOGLE_MAPS_URL)]]) : undefined;
  return ctx.reply('📍 Maline Exclusive Serviced Apartments, Phnom Penh, Cambodia', keyboard);
});
bot.action('language_help', async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.reply('The Mini App interface supports English, Khmer and Chinese. Group translation can be configured by an admin.');
});

bot.action(/^inq:(contacted|completed|cancelled):(.+)$/, async (ctx) => {
  if (!isAdmin(ctx)) return ctx.answerCbQuery('Admin only.', { show_alert: true });
  const [, status, id] = ctx.match;
  const inquiry = data.inquiries.find(item => item.id === id);
  if (!inquiry) return ctx.answerCbQuery('Inquiry not found.', { show_alert: true });
  inquiry.status = status;
  inquiry.updatedAt = new Date().toISOString();
  saveData();
  await ctx.answerCbQuery(`Marked ${status}`);
  return ctx.editMessageText(`${ctx.callbackQuery.message.text}\n\nStatus: ${status.toUpperCase()}`);
});

bot.on('new_chat_members', async (ctx) => {
  if (data.welcomeEnabled[String(ctx.chat.id)] === false) return;
  for (const member of ctx.message.new_chat_members || []) {
    if (member.is_bot) continue;
    const name = member.first_name || 'Guest';
    const buttons = PUBLIC_URL ? Markup.inlineKeyboard([[Markup.button.webApp('🌸 Open Maline Mini App', `${PUBLIC_URL}/app`)]]) : undefined;
    await ctx.reply(`🌸 Welcome, ${name}!\n\nWelcome to Maline Exclusive Serviced Apartments. Explore apartments, facilities and contact reception below.`, buttons);
    data.stats.welcomes += 1;
  }
  saveData();
});

bot.on('text', async (ctx, next) => {
  const text = ctx.message.text.trim();
  if (text.startsWith('/')) return next();

  if (isGroup(ctx)) {
    const pair = data.translationPairs[String(ctx.chat.id)];
    if (pair && !ctx.from.is_bot) {
      try {
        const toA = await translate(text, { to: pair.a });
        const detected = toA?.raw?.src || toA?.from?.language?.iso || '';
        let output = '';
        if (detected.startsWith(pair.a.split('-')[0])) {
          output = (await translate(text, { from: pair.a, to: pair.b })).text;
        } else if (detected.startsWith(pair.b.split('-')[0])) {
          output = toA.text;
        }
        if (output && output.toLowerCase() !== text.toLowerCase()) {
          data.stats.translations += 1;
          saveData();
          return ctx.reply(`🌐 ${output}`, { reply_parameters: { message_id: ctx.message.message_id } });
        }
      } catch (error) {
        console.error('Translation error:', error.message);
      }
    }

    if (data.autoReplyEnabled[String(ctx.chat.id)] !== false && !ctx.from.is_bot) {
      const reply = matchAutoReply(text);
      if (reply) {
        data.stats.autoReplies += 1;
        saveData();
        return ctx.reply(reply, { reply_parameters: { message_id: ctx.message.message_id } });
      }
    }
  }
  return next();
});

bot.catch(error => console.error('Bot error:', error));

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
      if (body.length > 1_000_000) reject(new Error('Request too large'));
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

const server = http.createServer(async (req, res) => {
  const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    });
    return res.end();
  }

  if (requestPath === '/' || requestPath === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Maline Smart Assistant V2 is running');
  }

  if (requestPath === '/api/config') {
    return sendJson(res, 200, {
      phone: RECEPTION_PHONE,
      telegram: RECEPTION_TELEGRAM,
      website: WEBSITE,
      maps: GOOGLE_MAPS_URL,
      apartments: Object.entries(apartments).map(([key, apt]) => ({
        key, ...apt,
        price: data.prices[key] || 'Contact us for price',
        availability: data.availability[key] || 'Contact reception'
      }))
    });
  }

  if (requestPath === '/api/open' && req.method === 'POST') {
    data.stats.miniAppOpens += 1;
    saveData();
    return sendJson(res, 200, { success: true });
  }

  if (requestPath === '/api/inquiry' && req.method === 'POST') {
    try {
      const body = JSON.parse(await readBody(req));
      const required = ['name', 'phone', 'apartment', 'checkIn', 'stay'];
      if (required.some(field => !String(body[field] || '').trim())) {
        return sendJson(res, 400, { success: false, message: 'Please complete all required fields.' });
      }
      const inquiry = {
        id: crypto.randomBytes(4).toString('hex').toUpperCase(),
        name: String(body.name).trim().slice(0, 100),
        phone: String(body.phone).trim().slice(0, 50),
        telegram: String(body.telegram || '').trim().slice(0, 100),
        email: String(body.email || '').trim().slice(0, 150),
        apartment: String(body.apartment).trim().slice(0, 100),
        checkIn: String(body.checkIn).trim().slice(0, 30),
        stay: String(body.stay).trim().slice(0, 50),
        budget: String(body.budget || '').trim().slice(0, 50),
        message: String(body.message || '').trim().slice(0, 1000),
        status: 'new',
        createdAt: new Date().toISOString()
      };
      data.inquiries.unshift(inquiry);
      data.inquiries = data.inquiries.slice(0, 500);
      data.stats.inquiries += 1;
      saveData();
      await sendInquiryToStaff(inquiry);
      return sendJson(res, 200, { success: true, inquiryId: inquiry.id });
    } catch (error) {
      console.error('Inquiry error:', error);
      return sendJson(res, 500, { success: false, message: 'Unable to send inquiry.' });
    }
  }

  if (requestPath === '/app' || requestPath === '/app/') {
    const appFile = path.join(__dirname, 'web', 'index.html');
    res.writeHead(200, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-cache' });
    return fs.createReadStream(appFile).pipe(res);
  }

  if (requestPath.startsWith('/web/')) {
    const safeRelative = path.normalize(requestPath.replace(/^\/web\//, '')).replace(/^(\.\.(\/|\\|$))+/, '');
    const webRoot = path.join(__dirname, 'web');
    const filePath = path.join(webRoot, safeRelative);
    if (!filePath.startsWith(webRoot) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600'
    });
    return fs.createReadStream(filePath).pipe(res);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  return res.end('Not found');
});

server.listen(PORT, '0.0.0.0', () => console.log(`✅ Web server running on port ${PORT}`));
bot.launch().then(() => console.log('✅ Maline Smart Assistant V2 is running')).catch(console.error);

process.once('SIGINT', () => { bot.stop('SIGINT'); server.close(); });
process.once('SIGTERM', () => { bot.stop('SIGTERM'); server.close(); });
