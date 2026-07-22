const { Markup } = require('telegraf');
const { env } = require('../../config/env');

function adminKeyboard() {
  const rows = [
    [
      Markup.button.callback('📊 Statistics', 'admin:stats'),
      Markup.button.callback('🌐 Groups', 'admin:groups')
    ],
    [
      Markup.button.callback('⚡ Performance', 'admin:performance'),
      Markup.button.callback('❓ Help', 'admin:help')
    ]
  ];

  if (env.publicUrl) {
    rows.push([Markup.button.url('🖥 Open Web Dashboard', `${env.publicUrl}/login`)]);
  }

  return Markup.inlineKeyboard(rows);
}

module.exports = { adminKeyboard };
