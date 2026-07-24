# Maline Apartments Telegram System V4

Complete starter system with:
- Telegram customer bot
- Telegram Mini App
- Two-language automatic group translation
- 150+ language-code compatible configuration (actual availability depends on the configured translation provider)
- Automatic welcome messages for new group members
- Customer-to-staff viewing requests
- Staff notification group and action buttons
- Apartment database with unlimited facilities and photo arrays
- Admin dashboard
- SQLite database
- Railway-compatible Node.js server

## 1. Install

```bash
npm install
cp .env.example .env
```

On Windows, copy `.env.example`, rename the copy to `.env`, then edit it.

## 2. Create the Telegram bot

1. Open `@BotFather` in Telegram.
2. Run `/newbot` and create the bot.
3. Copy the token into `TELEGRAM_BOT_TOKEN` in `.env`.
4. Run `/setprivacy` in BotFather, choose the bot, and select **Disable** so it can read ordinary group messages for translation.
5. Add the bot to the customer/staff group as an administrator.
6. In the staff group, run `/setstaff`.
7. In any translated group, run `/setlanguages en zh`.
8. Run `/translation_on` and `/welcome_on`.

## 3. Translation provider

The starter uses a LibreTranslate-compatible API. Put the service URL and API key in `.env`:

```env
TRANSLATION_API_URL=https://your-provider.example
TRANSLATION_API_KEY=your-key
```

Public endpoints may be rate-limited and may not support every language. For reliable 150+ language support, connect a paid translation provider by replacing `src/bot/services/translation.js` with that provider's official API implementation.

## 4. Start locally

```bash
npm start
```

Open:
- Mini App: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`
- Health check: `http://localhost:3000/health`

Admin login values come from `.env`.

## 5. Telegram Mini App URL

Telegram requires an HTTPS URL. After deploying to Railway, set:

```env
APP_URL=https://your-project.up.railway.app
TELEGRAM_WEB_APP_URL=https://your-project.up.railway.app
```

Then use BotFather `/setmenubutton` to link the bot menu to the deployed URL.

## 6. Add room photos later

Photo support is already represented by `photos_json`. The current interface intentionally uses a Maline placeholder. A future upload endpoint can store image URLs in that array without changing room records.

## Main admin commands

- `/settings`
- `/setlanguages en zh`
- `/translation_on`
- `/translation_off`
- `/welcome_on`
- `/welcome_off`
- `/setstaff`

## Customer viewing format

```text
#viewing
Name: Customer name
Phone: +855...
Room: 2 Bedroom 150 sqm
Date: 28 July 2026, 2 PM
Message: I would like to inspect this apartment.
```

## Security before production

- Change `ADMIN_PASSWORD` and `SESSION_SECRET`.
- Never upload `.env` to GitHub.
- Use HTTPS.
- Use a private/reliable translation provider.
- Add database backup storage.
- Add CSRF protection and stronger admin user management before accepting sensitive production data.
