const db = require('../../database/db');
const env = require('../../config/env');

function getOrCreateGroup(chat) {
  const id = String(chat.id);
  let group = db.prepare('SELECT * FROM groups WHERE chat_id = ?').get(id);
  if (!group) {
    db.prepare(`INSERT INTO groups (chat_id, title, translation_enabled, primary_language, secondary_language, welcome_enabled, staff_group_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(id, chat.title || '', env.translationEnabled ? 1 : 0, env.defaultPrimaryLanguage, env.defaultSecondaryLanguage, env.welcomeEnabled ? 1 : 0, env.defaultStaffGroupId || null);
    group = db.prepare('SELECT * FROM groups WHERE chat_id = ?').get(id);
  }
  return group;
}

function updateGroup(chatId, updates) {
  const allowed = ['translation_enabled','primary_language','secondary_language','other_language_mode','welcome_enabled','welcome_message','staff_group_id'];
  const entries = Object.entries(updates).filter(([k]) => allowed.includes(k));
  if (!entries.length) return;
  const sql = `UPDATE groups SET ${entries.map(([k]) => `${k} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE chat_id = ?`;
  db.prepare(sql).run(...entries.map(([,v]) => v), String(chatId));
}

module.exports = { getOrCreateGroup, updateGroup };
