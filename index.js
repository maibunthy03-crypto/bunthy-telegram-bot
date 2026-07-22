require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { Telegraf, Markup } = require('telegraf');
const { translate } = require('@vitalets/google-translate-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = Number(process.env.OWNER_ID);

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is missing from .env');
  process.exit(1);
}

if (!Number.isInteger(OWNER_ID)) {
  console.error('❌ OWNER_ID is missing or incorrect in .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

const SETTINGS_FILE = path.join(__dirname, 'chat-settings.json');
const LANGUAGES_PER_PAGE = 12;

/*
Each Telegram group saves its own language pair.

Example:
Group 1: Japanese ↔ Chinese
Group 2: Khmer ↔ English
Group 3: Korean ↔ French
*/
let chatSettings = loadSettings();

/*
Temporary storage while Bunthy is selecting
Language 1 and Language 2.
*/
const pendingSelections = {};

/*
Language list.

The translation library accepts Google Translate language codes.
Not every language service supports exactly 200 working languages,
so this menu includes a large list of commonly supported languages.
*/
const LANGUAGES = [
  ['af', 'Afrikaans', '🇿🇦'],
  ['sq', 'Albanian', '🇦🇱'],
  ['am', 'Amharic', '🇪🇹'],
  ['ar', 'Arabic', '🇸🇦'],
  ['hy', 'Armenian', '🇦🇲'],
  ['as', 'Assamese', '🇮🇳'],
  ['ay', 'Aymara', '🇧🇴'],
  ['az', 'Azerbaijani', '🇦🇿'],
  ['bm', 'Bambara', '🇲🇱'],
  ['eu', 'Basque', '🇪🇸'],
  ['be', 'Belarusian', '🇧🇾'],
  ['bn', 'Bengali', '🇧🇩'],
  ['bho', 'Bhojpuri', '🇮🇳'],
  ['bs', 'Bosnian', '🇧🇦'],
  ['bg', 'Bulgarian', '🇧🇬'],
  ['ca', 'Catalan', '🇪🇸'],
  ['ceb', 'Cebuano', '🇵🇭'],
  ['ny', 'Chichewa', '🇲🇼'],
  ['zh-CN', 'Chinese Simplified', '🇨🇳'],
  ['zh-TW', 'Chinese Traditional', '🇹🇼'],
  ['co', 'Corsican', '🇫🇷'],
  ['hr', 'Croatian', '🇭🇷'],
  ['cs', 'Czech', '🇨🇿'],
  ['da', 'Danish', '🇩🇰'],
  ['dv', 'Dhivehi', '🇲🇻'],
  ['doi', 'Dogri', '🇮🇳'],
  ['nl', 'Dutch', '🇳🇱'],
  ['en', 'English', '🇬🇧'],
  ['eo', 'Esperanto', '🌍'],
  ['et', 'Estonian', '🇪🇪'],
  ['ee', 'Ewe', '🇬🇭'],
  ['tl', 'Filipino', '🇵🇭'],
  ['fi', 'Finnish', '🇫🇮'],
  ['fr', 'French', '🇫🇷'],
  ['fy', 'Frisian', '🇳🇱'],
  ['gl', 'Galician', '🇪🇸'],
  ['ka', 'Georgian', '🇬🇪'],
  ['de', 'German', '🇩🇪'],
  ['el', 'Greek', '🇬🇷'],
  ['gn', 'Guarani', '🇵🇾'],
  ['gu', 'Gujarati', '🇮🇳'],
  ['ht', 'Haitian Creole', '🇭🇹'],
  ['ha', 'Hausa', '🇳🇬'],
  ['haw', 'Hawaiian', '🇺🇸'],
  ['he', 'Hebrew', '🇮🇱'],
  ['hi', 'Hindi', '🇮🇳'],
  ['hmn', 'Hmong', '🌍'],
  ['hu', 'Hungarian', '🇭🇺'],
  ['is', 'Icelandic', '🇮🇸'],
  ['ig', 'Igbo', '🇳🇬'],
  ['ilo', 'Ilocano', '🇵🇭'],
  ['id', 'Indonesian', '🇮🇩'],
  ['ga', 'Irish', '🇮🇪'],
  ['it', 'Italian', '🇮🇹'],
  ['ja', 'Japanese', '🇯🇵'],
  ['jv', 'Javanese', '🇮🇩'],
  ['kn', 'Kannada', '🇮🇳'],
  ['kk', 'Kazakh', '🇰🇿'],
  ['km', 'Khmer', '🇰🇭'],
  ['rw', 'Kinyarwanda', '🇷🇼'],
  ['gom', 'Konkani', '🇮🇳'],
  ['ko', 'Korean', '🇰🇷'],
  ['kri', 'Krio', '🇸🇱'],
  ['ku', 'Kurdish', '🌍'],
  ['ckb', 'Kurdish Sorani', '🌍'],
  ['ky', 'Kyrgyz', '🇰🇬'],
  ['lo', 'Lao', '🇱🇦'],
  ['la', 'Latin', '🏛️'],
  ['lv', 'Latvian', '🇱🇻'],
  ['ln', 'Lingala', '🇨🇩'],
  ['lt', 'Lithuanian', '🇱🇹'],
  ['lg', 'Luganda', '🇺🇬'],
  ['lb', 'Luxembourgish', '🇱🇺'],
  ['mk', 'Macedonian', '🇲🇰'],
  ['mai', 'Maithili', '🇮🇳'],
  ['mg', 'Malagasy', '🇲🇬'],
  ['ms', 'Malay', '🇲🇾'],
  ['ml', 'Malayalam', '🇮🇳'],
  ['mt', 'Maltese', '🇲🇹'],
  ['mi', 'Maori', '🇳🇿'],
  ['mr', 'Marathi', '🇮🇳'],
  ['mni-Mtei', 'Meiteilon', '🇮🇳'],
  ['lus', 'Mizo', '🇮🇳'],
  ['mn', 'Mongolian', '🇲🇳'],
  ['my', 'Myanmar', '🇲🇲'],
  ['ne', 'Nepali', '🇳🇵'],
  ['no', 'Norwegian', '🇳🇴'],
  ['or', 'Odia', '🇮🇳'],
  ['om', 'Oromo', '🇪🇹'],
  ['ps', 'Pashto', '🇦🇫'],
  ['fa', 'Persian', '🇮🇷'],
  ['pl', 'Polish', '🇵🇱'],
  ['pt', 'Portuguese', '🇵🇹'],
  ['pa', 'Punjabi', '🇮🇳'],
  ['qu', 'Quechua', '🇵🇪'],
  ['ro', 'Romanian', '🇷🇴'],
  ['ru', 'Russian', '🇷🇺'],
  ['sm', 'Samoan', '🇼🇸'],
  ['sa', 'Sanskrit', '🇮🇳'],
  ['gd', 'Scots Gaelic', '🏴'],
  ['nso', 'Sepedi', '🇿🇦'],
  ['sr', 'Serbian', '🇷🇸'],
  ['st', 'Sesotho', '🇱🇸'],
  ['sn', 'Shona', '🇿🇼'],
  ['sd', 'Sindhi', '🇵🇰'],
  ['si', 'Sinhala', '🇱🇰'],
  ['sk', 'Slovak', '🇸🇰'],
  ['sl', 'Slovenian', '🇸🇮'],
  ['so', 'Somali', '🇸🇴'],
  ['es', 'Spanish', '🇪🇸'],
  ['su', 'Sundanese', '🇮🇩'],
  ['sw', 'Swahili', '🇰🇪'],
  ['sv', 'Swedish', '🇸🇪'],
  ['tg', 'Tajik', '🇹🇯'],
  ['ta', 'Tamil', '🇮🇳'],
  ['tt', 'Tatar', '🇷🇺'],
  ['te', 'Telugu', '🇮🇳'],
  ['th', 'Thai', '🇹🇭'],
  ['ti', 'Tigrinya', '🇪🇷'],
  ['ts', 'Tsonga', '🇿🇦'],
  ['tr', 'Turkish', '🇹🇷'],
  ['tk', 'Turkmen', '🇹🇲'],
  ['ak', 'Twi', '🇬🇭'],
  ['uk', 'Ukrainian', '🇺🇦'],
  ['ur', 'Urdu', '🇵🇰'],
  ['ug', 'Uyghur', '🌍'],
  ['uz', 'Uzbek', '🇺🇿'],
  ['vi', 'Vietnamese', '🇻🇳'],
  ['cy', 'Welsh', '🏴'],
  ['xh', 'Xhosa', '🇿🇦'],
  ['yi', 'Yiddish', '🌍'],
  ['yo', 'Yoruba', '🇳🇬'],
  ['zu', 'Zulu', '🇿🇦']
];

const languageMap = Object.fromEntries(
  LANGUAGES.map(([code, name, flag]) => [
    code,
    { code, name, flag }
  ])
);

/* --------------------------------
   SETTINGS
-------------------------------- */

function loadSettings() {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      return {};
    }

    const data = fs.readFileSync(SETTINGS_FILE, 'utf8');

    return JSON.parse(data);
  } catch (error) {
    console.error('Settings loading error:', error.message);
    return {};
  }
}

function saveSettings() {
  try {
    fs.writeFileSync(
      SETTINGS_FILE,
      JSON.stringify(chatSettings, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error('Settings saving error:', error.message);
  }
}

function isOwner(ctx) {
  return Number(ctx.from?.id) === OWNER_ID;
}

function getLanguagePair(chatId) {
  const saved = chatSettings[String(chatId)];

  if (
    saved &&
    saved.languageA &&
    saved.languageB
  ) {
    return saved;
  }

  return {
    languageA: 'ja',
    languageB: 'zh-CN'
  };
}

function setLanguagePair(chatId, languageA, languageB) {
  chatSettings[String(chatId)] = {
    languageA,
    languageB
  };

  saveSettings();
}

/* --------------------------------
   LANGUAGE DETECTION
-------------------------------- */

function normalizeLanguageCode(code) {
  if (!code) return '';

  const normalized = String(code)
    .trim()
    .toLowerCase()
    .replace('_', '-');

  if (normalized === 'zh') {
    return 'zh-cn';
  }

  return normalized;
}

function languagesMatch(detectedCode, selectedCode) {
  const detected = normalizeLanguageCode(detectedCode);
  const selected = normalizeLanguageCode(selectedCode);

  if (!detected || !selected) {
    return false;
  }

  if (detected === selected) {
    return true;
  }

  /*
  Treat all Chinese variants as Chinese.
  */
  if (
    detected.startsWith('zh') &&
    selected.startsWith('zh')
  ) {
    return true;
  }

  /*
  Some detectors return only the first part
  of a regional language code.
  */
  if (
    detected.split('-')[0] === selected.split('-')[0]
  ) {
    return true;
  }

  return false;
}

function getDetectedLanguage(result) {
  return (
    result?.raw?.src ||
    result?.from?.language?.iso ||
    result?.from?.language?.didYouMean ||
    null
  );
}

/* --------------------------------
   LANGUAGE MENU
-------------------------------- */

function createLanguageMenu(page = 0, position = 1) {
  const totalPages = Math.ceil(
    LANGUAGES.length / LANGUAGES_PER_PAGE
  );

  const safePage = Math.max(
    0,
    Math.min(Number(page), totalPages - 1)
  );

  const start = safePage * LANGUAGES_PER_PAGE;

  const pageLanguages = LANGUAGES.slice(
    start,
    start + LANGUAGES_PER_PAGE
  );

  const rows = [];

  for (let i = 0; i < pageLanguages.length; i += 2) {
    const row = pageLanguages
      .slice(i, i + 2)
      .map(([code, name, flag]) =>
        Markup.button.callback(
          `${flag} ${name}`,
          `select_${position}:${code}`
        )
      );

    rows.push(row);
  }

  const navigationRow = [];

  if (safePage > 0) {
    navigationRow.push(
      Markup.button.callback(
        '⬅️ Back',
        `pair_page:${position}:${safePage - 1}`
      )
    );
  }

  navigationRow.push(
    Markup.button.callback(
      `${safePage + 1}/${totalPages}`,
      'page_number'
    )
  );

  if (safePage < totalPages - 1) {
    navigationRow.push(
      Markup.button.callback(
        'Next ➡️',
        `pair_page:${position}:${safePage + 1}`
      )
    );
  }

  rows.push(navigationRow);

  return Markup.inlineKeyboard(rows);
}

function getCurrentPairText(chatId) {
  const { languageA, languageB } =
    getLanguagePair(chatId);

  const first = languageMap[languageA];
  const second = languageMap[languageB];

  if (!first || !second) {
    return 'No valid language pair selected.';
  }

  return [
    '🌐 Current communication languages',
    '',
    `${first.flag} ${first.name}`,
    '↕️',
    `${second.flag} ${second.name}`
  ].join('\n');
}

/* --------------------------------
   BOT COMMANDS
-------------------------------- */

bot.start(async (ctx) => {
  await ctx.reply(
    [
      '🤖 Bunthy’s Translation Bot',
      '',
      'Add me to a Telegram group.',
      '',
      'Bunthy can use /language inside the group to select two communication languages.',
      '',
      'Example:',
      '🇯🇵 Japanese ↔ 🇨🇳 Chinese'
    ].join('\n')
  );
});

bot.command('language', async (ctx) => {
  if (
    ctx.chat.type !== 'group' &&
    ctx.chat.type !== 'supergroup'
  ) {
    return ctx.reply(
      'Please use /language inside your Telegram group.'
    );
  }

  if (!isOwner(ctx)) {
    return ctx.reply(
      '🔒 Only Bunthy can set the group languages.'
    );
  }

  const chatId = String(ctx.chat.id);

  pendingSelections[chatId] = {};

  await ctx.reply(
    [
      '🤖 Bunthy’s Translation Bot',
      '',
      '1️⃣ Select the first communication language.'
    ].join('\n'),
    createLanguageMenu(0, 1)
  );
});

bot.command('current', async (ctx) => {
  await ctx.reply(
    getCurrentPairText(ctx.chat.id)
  );
});

/* --------------------------------
   MENU PAGE BUTTONS
-------------------------------- */

bot.action(
  /^pair_page:(1|2):(\d+)$/,
  async (ctx) => {
    if (!isOwner(ctx)) {
      return ctx.answerCbQuery(
        'Only Bunthy can use this menu.',
        { show_alert: true }
      );
    }

    const position = Number(ctx.match[1]);
    const page = Number(ctx.match[2]);

    await ctx.answerCbQuery();

    const title =
      position === 1
        ? '1️⃣ Select the first communication language.'
        : '2️⃣ Select the second communication language.';

    await ctx.editMessageText(
      title,
      createLanguageMenu(page, position)
    );
  }
);

bot.action('page_number', async (ctx) => {
  await ctx.answerCbQuery();
});

/* --------------------------------
   SELECT LANGUAGE 1
-------------------------------- */

bot.action(/^select_1:(.+)$/, async (ctx) => {
  if (!isOwner(ctx)) {
    return ctx.answerCbQuery(
      'Only Bunthy can change languages.',
      { show_alert: true }
    );
  }

  const chatId = String(
    ctx.callbackQuery.message.chat.id
  );

  const languageCode = ctx.match[1];
  const language = languageMap[languageCode];

  if (!language) {
    return ctx.answerCbQuery(
      'This language is not available.',
      { show_alert: true }
    );
  }

  pendingSelections[chatId] = {
    languageA: languageCode
  };

  await ctx.answerCbQuery(
    `${language.name} selected`
  );

  await ctx.editMessageText(
    [
      `✅ First language: ${language.flag} ${language.name}`,
      '',
      '2️⃣ Now select the second communication language.'
    ].join('\n'),
    createLanguageMenu(0, 2)
  );
});

/* --------------------------------
   SELECT LANGUAGE 2
-------------------------------- */

bot.action(/^select_2:(.+)$/, async (ctx) => {
  if (!isOwner(ctx)) {
    return ctx.answerCbQuery(
      'Only Bunthy can change languages.',
      { show_alert: true }
    );
  }

  const chatId = String(
    ctx.callbackQuery.message.chat.id
  );

  const languageB = ctx.match[1];
  const languageA =
    pendingSelections[chatId]?.languageA;

  if (!languageA) {
    return ctx.answerCbQuery(
      'Please run /language and select Language 1 again.',
      { show_alert: true }
    );
  }

  if (languagesMatch(languageA, languageB)) {
    return ctx.answerCbQuery(
      'Please select two different languages.',
      { show_alert: true }
    );
  }

  const first = languageMap[languageA];
  const second = languageMap[languageB];

  if (!first || !second) {
    return ctx.answerCbQuery(
      'Invalid language selection.',
      { show_alert: true }
    );
  }

  setLanguagePair(
    chatId,
    languageA,
    languageB
  );

  delete pendingSelections[chatId];

  await ctx.answerCbQuery(
    'Language pair saved'
  );

  await ctx.editMessageText(
    [
      '✅ Two-way translation is active',
      '',
      `${first.flag} ${first.name}`,
      '↕️',
      `${second.flag} ${second.name}`,
      '',
      `${first.name} → ${second.name}`,
      `${second.name} → ${first.name}`,
      '',
      '🔒 Only Bunthy can change this setting.'
    ].join('\n')
  );
});

/* --------------------------------
   AUTOMATIC GROUP TRANSLATION
-------------------------------- */

bot.on('text', async (ctx) => {
  const text = ctx.message?.text?.trim();

  if (!text) return;

  /*
  Do not translate bot commands.
  */
  if (text.startsWith('/')) return;

  /*
  Do not translate messages from bots.
  */
  if (ctx.from?.is_bot) return;

  /*
  Translation works only in groups.
  */
  if (
    ctx.chat.type !== 'group' &&
    ctx.chat.type !== 'supergroup'
  ) {
    return;
  }

  const { languageA, languageB } =
    getLanguagePair(ctx.chat.id);

  try {
    /*
    First request:
    Translate to Language A and detect
    the original message language.
    */
    const detectionResult = await translate(
      text,
      {
        to: languageA
      }
    );

    const detectedLanguage =
      getDetectedLanguage(detectionResult);

    let translatedText = '';

    /*
    Language A → Language B
    */
    if (
      languagesMatch(
        detectedLanguage,
        languageA
      )
    ) {
      const result = await translate(
        text,
        {
          from: languageA,
          to: languageB
        }
      );

      translatedText = result.text?.trim();
    }

    /*
    Language B → Language A
    */
    else if (
      languagesMatch(
        detectedLanguage,
        languageB
      )
    ) {
      translatedText =
        detectionResult.text?.trim();
    }

    /*
    Ignore messages written in languages
    outside the selected pair.
    */
    else {
      return;
    }

    if (!translatedText) return;

    /*
    Avoid sending the same text.
    */
    if (
      translatedText.toLocaleLowerCase() ===
      text.toLocaleLowerCase()
    ) {
      return;
    }

    /*
    Send only the translated text.
    */
    await ctx.reply(
      translatedText,
      {
        reply_to_message_id:
          ctx.message.message_id
      }
    );
  } catch (error) {
    console.error(
      '❌ Translation error:',
      error.message
    );
  }
});

/* --------------------------------
   ERROR HANDLING AND START
-------------------------------- */

bot.catch((error, ctx) => {
  console.error(
    `❌ Bot error in chat ${ctx.chat?.id}:`,
    error
  );
});

bot.launch()
  .then(() => {
    console.log(
      '✅ Bunthy’s Translation Bot is running...'
    );
  })
  .catch((error) => {
    console.error(
      '❌ Bot starting error:',
      error
    );
  });

process.once('SIGINT', () => {
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
});