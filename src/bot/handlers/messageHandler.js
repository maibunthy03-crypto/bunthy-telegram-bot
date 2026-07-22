const groups = require('../../database/groupRepository');
const stats = require('../../database/statsRepository');
const { translatePair } = require('../../services/translationService');

function registerMessageHandler(bot) {
  bot.on('text', async (ctx) => {
    const text = ctx.message?.text?.trim();
    if (!text || text.startsWith('/') || ctx.from?.is_bot) return;
    if (!['group', 'supergroup'].includes(ctx.chat?.type)) return;

    const group = groups.ensureGroup(ctx.chat.id, ctx.chat.title || '');
    if (!group.enabled) return;

    const started = Date.now();
    try {
      const result = await translatePair(text, group.language_a, group.language_b);
      if (!result?.text) return;
      if (result.text.toLocaleLowerCase() === text.toLocaleLowerCase()) return;

      await ctx.reply(result.text, {
        reply_parameters: { message_id: ctx.message.message_id }
      });

      stats.recordTranslation({
        chatId: ctx.chat.id,
        sourceLanguage: result.sourceLanguage,
        targetLanguage: result.targetLanguage,
        provider: result.provider,
        characters: text.length,
        latencyMs: Date.now() - started,
        success: true
      });
    } catch (error) {
      console.error('Translation error:', error);
      stats.recordTranslation({
        chatId: ctx.chat.id,
        sourceLanguage: group.language_a,
        targetLanguage: group.language_b,
        provider: 'error',
        characters: text.length,
        latencyMs: Date.now() - started,
        success: false,
        errorMessage: String(error.message || error).slice(0, 500)
      });
    }
  });
}

module.exports = { registerMessageHandler };
