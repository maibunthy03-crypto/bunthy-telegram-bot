const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'bot-data.json');

function defaults() {
  return {
    users: {},
    admins: [],
    staffGroupId: '',
    translationPairs: {},
    welcomeEnabled: {},
    autoReplyEnabled: {},
    prices: {},
    availability: {},
    inquiries: [],
    stats: {
      starts: 0,
      inquiries: 0,
      translations: 0,
      welcomes: 0,
      autoReplies: 0,
      miniAppOpens: 0
    }
  };
}

function load() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    const base = defaults();
    return {
      ...base,
      ...parsed,
      stats: { ...base.stats, ...(parsed.stats || {}) },
      translationPairs: parsed.translationPairs || {},
      prices: parsed.prices || {},
      availability: parsed.availability || {},
      welcomeEnabled: parsed.welcomeEnabled || {},
      autoReplyEnabled: parsed.autoReplyEnabled || {},
      inquiries: parsed.inquiries || [],
      users: parsed.users || {},
      admins: parsed.admins || []
    };
  } catch {
    return defaults();
  }
}

let data = load();

function save() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function getData() {
  return data;
}

async function getPair(chatId) {
  return data.translationPairs[String(chatId)] || null;
}

async function savePair(chatId, pair) {
  data.translationPairs[String(chatId)] = pair;
  save();
}

async function removePair(chatId) {
  delete data.translationPairs[String(chatId)];
  save();
}

module.exports = { getData, save, getPair, savePair, removePair };
