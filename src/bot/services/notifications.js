const db = require('../../database/db');

function makeReference() {
  const d = new Date();
  return `MLN-${d.toISOString().slice(0,10).replaceAll('-','')}-${String(Date.now()).slice(-6)}`;
}

async function createEnquiry(bot, payload, staffGroupId) {
  const reference = makeReference();
  db.prepare(`INSERT INTO enquiries
    (reference, telegram_user_id, telegram_username, customer_name, phone, subject, message, room_id, preferred_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(reference, payload.userId || '', payload.username || '', payload.name || '', payload.phone || '', payload.subject || 'General enquiry', payload.message || '', payload.roomId || null, payload.preferredDate || '');

  const text = [
    '🏢 <b>NEW CUSTOMER REQUEST</b>', '',
    `🔖 Reference: <code>${reference}</code>`,
    `👤 Customer: ${escapeHtml(payload.name || 'Not provided')}`,
    `📞 Phone: ${escapeHtml(payload.phone || 'Not provided')}`,
    `📝 Subject: ${escapeHtml(payload.subject || 'General enquiry')}`,
    payload.preferredDate ? `📅 Preferred date: ${escapeHtml(payload.preferredDate)}` : '',
    `💬 Message: ${escapeHtml(payload.message || 'No message')}`
  ].filter(Boolean).join('\n');

  if (staffGroupId) {
    await bot.telegram.sendMessage(staffGroupId, text, {
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: [[
        { text: '✅ Accept', callback_data: `enquiry:accepted:${reference}` },
        { text: '🕐 Pending', callback_data: `enquiry:pending:${reference}` }
      ], [{ text: '❌ Decline', callback_data: `enquiry:declined:${reference}` }]] }
    });
  }
  return reference;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
}

module.exports = { createEnquiry };
