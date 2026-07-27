
"use strict";

const { Markup } = require("telegraf");
const {
  LANGUAGES,
  findLanguageByCode,
  getLanguageLabel,
  searchLanguages
} = require("../config/languages");

const PAGE_SIZE = 12;

function clampPage(page, totalPages) {
  const value = Number.parseInt(page, 10);
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), Math.max(totalPages - 1, 0));
}

function languageButtons(items, slot) {
  const rows = [];
  for (let index = 0; index < items.length; index += 2) {
    rows.push(
      items.slice(index, index + 2).map((language) =>
        Markup.button.callback(
          `${language.flag} ${language.name}`,
          `lang:set:${slot}:${language.code}`
        )
      )
    );
  }
  return rows;
}

function buildLanguageKeyboard({ slot = "a", page = 0, query = "" }) {
  const filtered = query ? searchLanguages(query) : LANGUAGES;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = clampPage(page, totalPages);
  const start = safePage * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const rows = languageButtons(visible, slot);
  const nav = [];

  if (safePage > 0) {
    nav.push(Markup.button.callback("⬅️ Previous", `lang:page:${slot}:${safePage - 1}`));
  }

  nav.push(
    Markup.button.callback(
      `${safePage + 1}/${totalPages}`,
      "lang:none"
    )
  );

  if (safePage < totalPages - 1) {
    nav.push(Markup.button.callback("Next ➡️", `lang:page:${slot}:${safePage + 1}`));
  }

  rows.push(nav);
  rows.push([
    Markup.button.callback("🔎 Search help", "lang:search-help"),
    Markup.button.callback("❌ Close", "lang:close")
  ]);

  return Markup.inlineKeyboard(rows);
}

function pairText(settings = {}) {
  const languageA = settings.languageA || "en";
  const languageB = settings.languageB || "zh-CN";
  const enabled = settings.enabled !== false;

  return [
    "🌐 <b>Premium Translation Settings</b>",
    "",
    `Status: ${enabled ? "🟢 Enabled" : "🔴 Disabled"}`,
    `Language 1: ${getLanguageLabel(languageA)}`,
    `Language 2: ${getLanguageLabel(languageB)}`,
    "",
    "Messages written in either selected language will be translated into the other language.",
    "",
    "Only group administrators can change these settings."
  ].join("\n");
}

function mainKeyboard(settings = {}) {
  const enabled = settings.enabled !== false;

  return Markup.inlineKeyboard([
    [
      Markup.button.callback("1️⃣ Select Language 1", "lang:choose:a"),
      Markup.button.callback("2️⃣ Select Language 2", "lang:choose:b")
    ],
    [
      Markup.button.callback(
        enabled ? "🔴 Turn Translation Off" : "🟢 Turn Translation On",
        "lang:toggle"
      )
    ],
    [
      Markup.button.callback("🔄 Swap Languages", "lang:swap"),
      Markup.button.callback("✅ Done", "lang:close")
    ]
  ]);
}

async function defaultAdminCheck(ctx, ownerId) {
  if (String(ctx.from?.id) === String(ownerId || "")) return true;
  if (!["group", "supergroup"].includes(ctx.chat?.type)) return false;

  try {
    const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
    return ["creator", "administrator"].includes(member.status);
  } catch {
    return false;
  }
}

function ensureGroupSettings(data, chatId) {
  data.translationSettings ||= {};
  data.translationSettings.groups ||= {};

  const key = String(chatId);
  data.translationSettings.groups[key] ||= {
    enabled: true,
    languageA: "en",
    languageB: "zh-CN",
    updatedAt: "",
    updatedBy: ""
  };

  return data.translationSettings.groups[key];
}

function registerPremiumLanguageMenu(bot, options = {}) {
  if (!bot) throw new Error("Telegram bot instance is required.");
  if (typeof options.loadData !== "function") {
    throw new Error("options.loadData must be a function.");
  }
  if (typeof options.saveData !== "function") {
    throw new Error("options.saveData must be a function.");
  }

  const ownerId = options.ownerId || process.env.OWNER_ID;
  const isAdmin = options.isAdmin || ((ctx) => defaultAdminCheck(ctx, ownerId));

  async function requireAdmin(ctx) {
    const allowed = await isAdmin(ctx);
    if (!allowed) {
      await ctx.answerCbQuery?.("Only group administrators can change languages.", {
        show_alert: true
      }).catch(() => {});
      if (!ctx.callbackQuery) {
        await ctx.reply("⛔ Only group administrators can use this command.");
      }
      return false;
    }
    return true;
  }

  async function renderMain(ctx, edit = false) {
    const data = await options.loadData();
    const settings = ensureGroupSettings(data, ctx.chat.id);
    const extra = {
      parse_mode: "HTML",
      ...mainKeyboard(settings)
    };

    if (edit && ctx.callbackQuery?.message) {
      return ctx.editMessageText(pairText(settings), extra);
    }
    return ctx.reply(pairText(settings), extra);
  }

  bot.command(["languages", "language", "translate_settings"], async (ctx) => {
    if (!(await requireAdmin(ctx))) return;
    await renderMain(ctx);
  });

  bot.action(/^lang:choose:(a|b)$/, async (ctx) => {
    if (!(await requireAdmin(ctx))) return;
    const slot = ctx.match[1];

    await ctx.answerCbQuery();
    await ctx.editMessageText(
      `🌐 <b>Select Language ${slot === "a" ? "1" : "2"}</b>\n\nChoose from ${LANGUAGES.length}+ languages:`,
      {
        parse_mode: "HTML",
        ...buildLanguageKeyboard({ slot, page: 0 })
      }
    );
  });

  bot.action(/^lang:page:(a|b):(\d+)$/, async (ctx) => {
    if (!(await requireAdmin(ctx))) return;
    const slot = ctx.match[1];
    const page = Number(ctx.match[2]);

    await ctx.answerCbQuery();
    await ctx.editMessageReplyMarkup(
      buildLanguageKeyboard({ slot, page }).reply_markup
    );
  });

  bot.action(/^lang:set:(a|b):(.+)$/, async (ctx) => {
    if (!(await requireAdmin(ctx))) return;

    const slot = ctx.match[1];
    const code = ctx.match[2];
    const language = findLanguageByCode(code);

    if (!language) {
      return ctx.answerCbQuery("This language is not available.", {
        show_alert: true
      });
    }

    const data = await options.loadData();
    const settings = ensureGroupSettings(data, ctx.chat.id);

    if (slot === "a") settings.languageA = code;
    if (slot === "b") settings.languageB = code;

    if (settings.languageA === settings.languageB) {
      return ctx.answerCbQuery(
        "Please choose two different languages.",
        { show_alert: true }
      );
    }

    settings.updatedAt = new Date().toISOString();
    settings.updatedBy = String(ctx.from.id);

    await options.saveData(data);
    await ctx.answerCbQuery(`${language.flag} ${language.name} selected`);
    await renderMain(ctx, true);
  });

  bot.action("lang:toggle", async (ctx) => {
    if (!(await requireAdmin(ctx))) return;

    const data = await options.loadData();
    const settings = ensureGroupSettings(data, ctx.chat.id);
    settings.enabled = !settings.enabled;
    settings.updatedAt = new Date().toISOString();
    settings.updatedBy = String(ctx.from.id);

    await options.saveData(data);
    await ctx.answerCbQuery(
      settings.enabled ? "Translation enabled" : "Translation disabled"
    );
    await renderMain(ctx, true);
  });

  bot.action("lang:swap", async (ctx) => {
    if (!(await requireAdmin(ctx))) return;

    const data = await options.loadData();
    const settings = ensureGroupSettings(data, ctx.chat.id);
    [settings.languageA, settings.languageB] = [
      settings.languageB,
      settings.languageA
    ];
    settings.updatedAt = new Date().toISOString();
    settings.updatedBy = String(ctx.from.id);

    await options.saveData(data);
    await ctx.answerCbQuery("Languages swapped");
    await renderMain(ctx, true);
  });

  bot.action("lang:search-help", async (ctx) => {
    if (!(await requireAdmin(ctx))) return;
    await ctx.answerCbQuery();
    await ctx.reply(
      "🔎 To search, send:\n\n/langsearch English\n/langsearch Khmer\n/langsearch Chinese",
      { parse_mode: "HTML" }
    );
  });

  bot.command("langsearch", async (ctx) => {
    if (!(await requireAdmin(ctx))) return;

    const query = ctx.message.text.replace(/^\/langsearch(?:@\w+)?/i, "").trim();
    if (!query) {
      return ctx.reply("Usage: /langsearch English");
    }

    const matches = searchLanguages(query).slice(0, 20);
    if (!matches.length) {
      return ctx.reply(`No language found for “${query}”.`);
    }

    const rows = languageButtons(matches, "a");
    rows.push([Markup.button.callback("❌ Close", "lang:close")]);

    await ctx.reply(
      `🔎 Search results for “${query}”\n\nChoose a language for Language 1:`,
      Markup.inlineKeyboard(rows)
    );
  });

  bot.action("lang:none", async (ctx) => {
    await ctx.answerCbQuery();
  });

  bot.action("lang:close", async (ctx) => {
    await ctx.answerCbQuery("Closed");
    await ctx.deleteMessage().catch(() => {});
  });
}

module.exports = {
  registerPremiumLanguageMenu,
  buildLanguageKeyboard,
  ensureGroupSettings
};
