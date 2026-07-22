const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { layout, escapeHtml } = require('../views/layout');
const stats = require('../../database/statsRepository');
const groups = require('../../database/groupRepository');
const { LANGUAGES, LANGUAGE_MAP } = require('../../config/languages');
const { cacheSize } = require('../../services/translationService');
const aiService = require('../../services/aiService');

const router = express.Router();
router.use(requireAuth);

function number(value) {
  return new Intl.NumberFormat('en-US').format(Number(value || 0));
}

router.get('/', (req, res) => {
  const all = stats.overview();
  const day = stats.today();
  const chart = stats.daily(14);
  const top = stats.topGroups(8);
  const max = Math.max(1, ...chart.map((item) => item.translations));

  const chartHtml = chart.map((item) => `
    <div class="bar-item" title="${escapeHtml(item.day)}: ${item.translations}">
      <div class="bar" style="height:${Math.max(4, item.translations / max * 150)}px"></div>
      <span>${escapeHtml(item.day.slice(5))}</span>
    </div>`).join('');

  res.send(layout({
    title: 'Dashboard', authenticated: true,
    body: `<header><div><p class="eyebrow">OVERVIEW</p><h1>Translation dashboard</h1></div><span class="status">● Bot configured</span></header>
    <section class="cards">
      <article class="card"><span>Today</span><strong>${number(day.successful)}</strong><small>successful translations</small></article>
      <article class="card"><span>All time</span><strong>${number(all.successful)}</strong><small>${number(all.failed)} failed</small></article>
      <article class="card"><span>Characters</span><strong>${number(all.characters)}</strong><small>processed</small></article>
      <article class="card"><span>Average speed</span><strong>${number(all.avg_latency)} ms</strong><small>${cacheSize()} cached items</small></article>
    </section>
    <section class="grid">
      <article class="panel wide"><h2>Last 14 days</h2><div class="chart">${chartHtml || '<p>No data yet.</p>'}</div></article>
      <article class="panel"><h2>System</h2>
        <div class="system-row"><span>Languages</span><b>${LANGUAGES.length}+</b></div>
        <div class="system-row"><span>AI fallback</span><b>${aiService.enabled() ? 'Enabled' : 'Disabled'}</b></div>
        <div class="system-row"><span>Database</span><b>SQLite WAL</b></div>
        <div class="system-row"><span>Cache</span><b>${cacheSize()} items</b></div>
      </article>
      <article class="panel wide"><h2>Top groups</h2>
        <table><thead><tr><th>Group</th><th>Translations</th><th>Characters</th></tr></thead>
        <tbody>${top.map((g) => `<tr><td>${escapeHtml(g.chat_title)}</td><td>${number(g.translations)}</td><td>${number(g.characters)}</td></tr>`).join('') || '<tr><td colspan="3">No data yet.</td></tr>'}</tbody></table>
      </article>
    </section>`
  }));
});

router.get('/groups', (req, res) => {
  const rows = groups.listGroups();
  const options = LANGUAGES.map((l) => `<option value="${escapeHtml(l.code)}">${escapeHtml(l.flag)} ${escapeHtml(l.name)}</option>`).join('');
  res.send(layout({
    title: 'Groups', authenticated: true,
    body: `<header><div><p class="eyebrow">MANAGEMENT</p><h1>Telegram groups</h1></div></header>
      <section class="panel">
      <table><thead><tr><th>Group</th><th>Language pair</th><th>Status</th><th>Translations</th><th>Action</th></tr></thead>
      <tbody>${rows.map((g) => `<tr>
        <td><b>${escapeHtml(g.chat_title || 'Unnamed group')}</b><small class="block">${escapeHtml(g.chat_id)}</small></td>
        <td><form class="inline-form" method="post" action="/groups/${encodeURIComponent(g.chat_id)}/languages">
          <select name="languageA">${options.replace(`value="${g.language_a}"`, `value="${g.language_a}" selected`)}</select>
          <span>↔</span>
          <select name="languageB">${options.replace(`value="${g.language_b}"`, `value="${g.language_b}" selected`)}</select>
          <button>Save</button></form></td>
        <td><span class="pill ${g.enabled ? 'on' : 'off'}">${g.enabled ? 'Enabled' : 'Paused'}</span></td>
        <td>${number(g.translations)}</td>
        <td><form method="post" action="/groups/${encodeURIComponent(g.chat_id)}/toggle"><button>${g.enabled ? 'Pause' : 'Resume'}</button></form></td>
      </tr>`).join('') || '<tr><td colspan="5">Add the bot to a Telegram group first.</td></tr>'}</tbody></table>
      </section>`
  }));
});

router.post('/groups/:chatId/languages', express.urlencoded({ extended: false }), (req, res) => {
  if (!LANGUAGE_MAP.has(req.body.languageA) || !LANGUAGE_MAP.has(req.body.languageB) || req.body.languageA === req.body.languageB) {
    return res.status(400).send('Invalid language pair');
  }
  const current = groups.ensureGroup(req.params.chatId);
  groups.setLanguages(req.params.chatId, current.chat_title, req.body.languageA, req.body.languageB);
  res.redirect('/groups');
});

router.post('/groups/:chatId/toggle', (req, res) => {
  const current = groups.ensureGroup(req.params.chatId);
  groups.setEnabled(req.params.chatId, !current.enabled);
  res.redirect('/groups');
});

router.get('/activity', (req, res) => {
  const rows = stats.recent(100);
  res.send(layout({
    title: 'Activity', authenticated: true,
    body: `<header><div><p class="eyebrow">LIVE LOG</p><h1>Recent activity</h1></div></header>
      <section class="panel"><table><thead><tr><th>Time</th><th>Group</th><th>Direction</th><th>Provider</th><th>Speed</th><th>Status</th></tr></thead>
      <tbody>${rows.map((r) => `<tr>
        <td>${escapeHtml(r.created_at)}</td><td>${escapeHtml(r.chat_title)}</td>
        <td>${escapeHtml(r.source_language)} → ${escapeHtml(r.target_language)}</td>
        <td>${escapeHtml(r.provider)}</td><td>${number(r.latency_ms)} ms</td>
        <td><span class="pill ${r.success ? 'on' : 'off'}">${r.success ? 'Success' : 'Failed'}</span></td>
      </tr>`).join('') || '<tr><td colspan="6">No activity yet.</td></tr>'}</tbody></table></section>`
  }));
});

module.exports = router;
