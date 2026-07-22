const { Markup } = require('telegraf');
const { LANGUAGES } = require('../../config/languages');

const PAGE_SIZE = 12;

function languageKeyboard(position, page = 0) {
  const pages = Math.ceil(LANGUAGES.length / PAGE_SIZE);
  const safePage = Math.max(0, Math.min(Number(page), pages - 1));
  const items = LANGUAGES.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const rows = [];

  for (let index = 0; index < items.length; index += 2) {
    rows.push(items.slice(index, index + 2).map((language) =>
      Markup.button.callback(
        `${language.flag} ${language.name}`,
        `lang:${position}:${language.code}`
      )
    ));
  }

  const nav = [];
  if (safePage > 0) nav.push(Markup.button.callback('⬅️', `langpage:${position}:${safePage - 1}`));
  nav.push(Markup.button.callback(`${safePage + 1}/${pages}`, 'noop'));
  if (safePage < pages - 1) nav.push(Markup.button.callback('➡️', `langpage:${position}:${safePage + 1}`));
  rows.push(nav);

  return Markup.inlineKeyboard(rows);
}

module.exports = { languageKeyboard };
