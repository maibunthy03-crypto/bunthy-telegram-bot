function registerMemberHandler(bot) {
  bot.on('new_chat_members', async (ctx) => {
    const me = await ctx.telegram.getMe();
    const joined = ctx.message.new_chat_members.some((member) => member.id === me.id);
    if (!joined) return;
    await ctx.reply([
      '👋 Hello! I am Bunthy Translation Bot 2.0.',
      '',
      'Bunthy can run /language to choose two communication languages.',
      'Please disable Privacy Mode in BotFather so I can read group messages.'
    ].join('\n'));
  });
}

module.exports = { registerMemberHandler };
