function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function layout({ title, body, authenticated = false }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)} · Bunthy Bot</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  ${authenticated ? `<aside class="sidebar">
    <div class="brand">🤖 <span>Bunthy Bot</span></div>
    <nav>
      <a href="/">📊 Dashboard</a>
      <a href="/groups">🌐 Groups</a>
      <a href="/activity">⚡ Activity</a>
      <form method="post" action="/logout"><button>↪ Log out</button></form>
    </nav>
  </aside>` : ''}
  <main class="${authenticated ? 'with-sidebar' : 'centered'}">${body}</main>
</body>
</html>`;
}

module.exports = { layout, escapeHtml };
