const db = require('./db');

const insertStmt = db.prepare(`
  INSERT INTO translation_stats(
    chat_id, source_language, target_language, provider,
    characters, latency_ms, success, error_message
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

function recordTranslation(data) {
  insertStmt.run(
    String(data.chatId), data.sourceLanguage || 'unknown',
    data.targetLanguage || 'unknown', data.provider || 'unknown',
    data.characters || 0, data.latencyMs || 0, data.success ? 1 : 0,
    data.errorMessage || null
  );
}

function overview() {
  return db.prepare(`
    SELECT
      COUNT(*) AS attempts,
      SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) AS successful,
      SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) AS failed,
      COALESCE(SUM(characters), 0) AS characters,
      COALESCE(ROUND(AVG(CASE WHEN success = 1 THEN latency_ms END)), 0) AS avg_latency
    FROM translation_stats
  `).get();
}

function today() {
  return db.prepare(`
    SELECT
      COUNT(*) AS attempts,
      SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) AS successful,
      COALESCE(SUM(characters), 0) AS characters
    FROM translation_stats
    WHERE created_at >= datetime('now', 'start of day')
  `).get();
}

function daily(days = 14) {
  return db.prepare(`
    SELECT date(created_at) AS day,
      SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) AS translations,
      COALESCE(SUM(characters), 0) AS characters
    FROM translation_stats
    WHERE created_at >= datetime('now', ?)
    GROUP BY date(created_at)
    ORDER BY day ASC
  `).all(`-${Number(days)} days`);
}

function topGroups(limit = 10) {
  return db.prepare(`
    SELECT s.chat_id, COALESCE(g.chat_title, s.chat_id) AS chat_title,
      COUNT(*) AS translations, SUM(s.characters) AS characters
    FROM translation_stats s
    LEFT JOIN group_settings g ON g.chat_id = s.chat_id
    WHERE s.success = 1
    GROUP BY s.chat_id
    ORDER BY translations DESC
    LIMIT ?
  `).all(Number(limit));
}

function recent(limit = 30) {
  return db.prepare(`
    SELECT s.*, COALESCE(g.chat_title, s.chat_id) AS chat_title
    FROM translation_stats s
    LEFT JOIN group_settings g ON g.chat_id = s.chat_id
    ORDER BY s.id DESC
    LIMIT ?
  `).all(Number(limit));
}

module.exports = { recordTranslation, overview, today, daily, topGroups, recent };
