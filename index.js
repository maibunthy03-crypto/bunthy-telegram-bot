require('dotenv').config();

const fs = require('fs');
const path = require('path');
const http = require('http');
const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = Number(process.env.OWNER_ID || 0);
const STAFF_GROUP_ID = process.env.STAFF_GROUP_ID || '';
const RECEPTION_PHONE = process.env.RECEPTION_PHONE || '+85523985959';
const RECEPTION_TELEGRAM = process.env.RECEPTION_TELEGRAM || 'https://t.me/99533347';
const WEBSITE = process.env.WEBSITE || 'https://www.malineapartments.com.kh';
const GOOGLE_MAPS_URL = process.env.GOOGLE_MAPS_URL || 'https://maps.app.goo.gl/yGiV63pV5bF9nV8K7';
const PUBLIC_URL = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
const PORT = Number(process.env.PORT || 8000);

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is missing in .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const DATA_FILE = path.join(__dirname, 'data', 'bot-data.json');

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { starts: 0 };
  }
}

let data = loadData();

function saveData() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function webAppUrl() {
  return PUBLIC_URL ? `${PUBLIC_URL}/app` : '';
}

function mainKeyboard() {
  const rows = [];

  if (webAppUrl()) {
    rows.push([
      Markup.button.webApp('🌸 OPEN MALINE FULL-SCREEN MENU', webAppUrl())
    ]);
  }

  rows.push(
    [
      Markup.button.callback('🏨 Apartments', 'apartments'),
      Markup.button.callback('🏊 Facilities', 'facilities')
    ],
    [
      Markup.button.callback('📞 Contact', 'contact'),
      Markup.button.callback('📍 Location', 'location')
    ]
  );

  return Markup.inlineKeyboard(rows);
}

bot.start(async (ctx) => {
  data.starts += 1;
  saveData();

  let message =
    '🌸 Welcome to Maline Exclusive Serviced Apartments\n\n' +
    'Tap the button below to open our pink full-screen mobile menu.';

  if (!PUBLIC_URL) {
    message +=
      '\n\n⚠️ PUBLIC_URL is empty. Add your Railway HTTPS URL to .env, then restart the bot.';
  }

  await ctx.reply(message, mainKeyboard());
});

bot.command('menu', async (ctx) => {
  await ctx.reply('Please choose a service:', mainKeyboard());
});

bot.command('id', async (ctx) => {
  await ctx.reply(
    `Chat ID: ${ctx.chat.id}\nYour user ID: ${ctx.from.id}`
  );
});

bot.command('stats', async (ctx) => {
  if (OWNER_ID && Number(ctx.from.id) !== OWNER_ID) {
    return ctx.reply('This command is only for the owner.');
  }

  await ctx.reply(`Bot starts: ${data.starts}`);
});

bot.action('apartments', async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.reply(
    [
      '🏨 Apartment Types',
      '',
      '• Studio — 50 sqm',
      '• 1 Bedroom — 92 sqm',
      '• 2 Bedrooms — 130 sqm',
      '• 2 Bedrooms — 138 sqm',
      '• 2 Bedrooms — 148 sqm',
      '• 2 Bedrooms — 150 sqm',
      '• Penthouse',
      '',
      'Open the pink full-screen menu to see the complete mobile layout.'
    ].join('\n'),
    mainKeyboard()
  );
});

bot.action('facilities', async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.reply(
    [
      '🏊 Facilities & Services',
      '',
      '🏊 Swimming Pool',
      '💪 Fitness Center',
      '♨️ Steam & Sauna',
      '🧒 Kids Playground',
      '🌿 Garden',
      '🚗 Parking',
      '🛡️ 24-hour Security',
      '🛎️ Reception',
      '📶 Wi-Fi',
      '🧺 Housekeeping & Laundry'
    ].join('\n'),
    mainKeyboard()
  );
});

bot.action('contact', async (ctx) => {
  await ctx.answerCbQuery();

  const buttons = [];

  if (RECEPTION_TELEGRAM) {
    buttons.push([
      Markup.button.url('💬 Telegram Reception', RECEPTION_TELEGRAM)
    ]);
  }

  buttons.push([
    Markup.button.url('🌐 Visit Website', WEBSITE)
  ]);

  await ctx.reply(
    `📞 Reception: ${RECEPTION_PHONE}`,
    Markup.inlineKeyboard(buttons)
  );
});

bot.action('location', async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.reply(
    '📍 Maline Exclusive Serviced Apartments\n' +
      '#16A/B, Street 214, Sangkat Boeung Raing, Khan Daun Penh, Phnom Penh, Cambodia',
    Markup.inlineKeyboard([
      [Markup.button.url('🗺 Open Google Maps', GOOGLE_MAPS_URL)]
    ])
  );
});

bot.catch((error) => {
  console.error('❌ Bot error:', error);
});

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

function sendFile(res, filePath) {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('File not found');
  }

  const extension = path.extname(filePath).toLowerCase();

  res.writeHead(200, {
    'Content-Type': MIME_TYPES[extension] || 'application/octet-stream',
    'Cache-Control': 'no-cache'
  });

  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent(
    (req.url || '/').split('?')[0]
  );

  if (requestPath === '/' || requestPath === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Maline Smart Assistant is running');
  }

  if (requestPath === '/app' || requestPath === '/app/') {
    return sendFile(res, path.join(__dirname, 'web', 'index.html'));
  }

  if (requestPath.startsWith('/web/')) {
    const relativePath = requestPath.replace(/^\/web\//, '');
    const filePath = path.join(__dirname, 'web', relativePath);

    if (!filePath.startsWith(path.join(__dirname, 'web'))) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    return sendFile(res, filePath);
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Web server running on port ${PORT}`);
});

bot.launch()
  .then(() => {
    console.log('✅ Maline Smart Assistant bot is running');
  })
  .catch((error) => {
    console.error('❌ Bot launch error:', error);
  });

process.once('SIGINT', () => {
  bot.stop('SIGINT');
  server.close();
});

process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  server.close();
});
