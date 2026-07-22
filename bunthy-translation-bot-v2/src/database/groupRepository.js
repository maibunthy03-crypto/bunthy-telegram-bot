const db = require('./db');

const getStmt = db.prepare('SELECT * FROM group_settings WHERE chat_id = ?');
const upsertStmt = db.prepare(`
  INSERT INTO group_settings(chat_id, chat_title, language_a, language_b, enabled)
  VALUES(@chatId, @chatTitle, @languageA, @languageB, @enabled)
  ON CONFLICT(chat_id) DO UPDATE SET
    chat_title = excluded.chat_title,
    language_a = excluded.language_a,
    language_b = excluded.language_b,
    enabled = excluded.enabled,
    updated_at = CURRENT_TIMESTAMP
`);
const listStmt = db.prepare(`
  SELECT g.*,
    (SELECT COUNT(*) FROM translation_stats s WHERE s.chat_id = g.chat_id AND s.success = 1) AS translations
  FROM group_settings g
  ORDER BY g.updated_at DESC
`);

function getGroup(chatId) {
  return getStmt.get(String(chatId)) || null;
}

function ensureGroup(chatId, title = '') {
  const existing = getGroup(chatId);
  if (existing) {
    if (title && title !== existing.chat_title) {
      upsertStmt.run({
        chatId: String(chatId), chatTitle: title,
        languageA: existing.language_a, languageB: existing.language_b,
        enabled: existing.enabled
      });
      return getGroup(chatId);
    }
    return existing;
  }
  upsertStmt.run({
    chatId: String(chatId), chatTitle: title,
    languageA: 'en', languageB: 'zh-CN', enabled: 1
  });
  return getGroup(chatId);
}

function setLanguages(chatId, title, languageA, languageB) {
  const existing = ensureGroup(chatId, title);
  upsertStmt.run({
    chatId: String(chatId), chatTitle: title || existing.chat_title,
    languageA, languageB, enabled: existing.enabled
  });
  return getGroup(chatId);
}

function setEnabled(chatId, enabled) {
  const existing = ensureGroup(chatId);
  upsertStmt.run({
    chatId: String(chatId), chatTitle: existing.chat_title,
    languageA: existing.language_a, languageB: existing.language_b,
    enabled: enabled ? 1 : 0
  });
  return getGroup(chatId);
}

function listGroups() {
  return listStmt.all();
}

module.exports = { getGroup, ensureGroup, setLanguages, setEnabled, listGroups };
