const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'settings.json');

function defaultData() {
  return { translationPairs: {} };
}

function readData() {
  try {
    const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    return {
      ...defaultData(),
      ...parsed,
      translationPairs: parsed.translationPairs || {}
    };
  } catch {
    return defaultData();
  }
}

function writeData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

async function getPair(chatId) {
  return readData().translationPairs[String(chatId)] || null;
}

async function savePair(chatId, pair) {
  const data = readData();
  data.translationPairs[String(chatId)] = pair;
  writeData(data);
}

async function removePair(chatId) {
  const data = readData();
  delete data.translationPairs[String(chatId)];
  writeData(data);
}

module.exports = { getPair, savePair, removePair };
