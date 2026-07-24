# Maline Apartments V4.1 Enterprise Core

A runnable Node.js system that combines a Telegram customer bot, Telegram group translation, automatic member welcome, staff notifications, a mobile Telegram Mini App, room/booking management and an admin dashboard.

## Included now

- Mobile-first pink Maline Mini App
- Apartment list, filters and room details
- Photo URL fields ready for photos you add later
- Unlimited facilities, included services, excluded services and nearby places
- Customer enquiries and viewing requests
- Booking requests
- Saved favorites
- Basic FAQ assistant
- Telegram staff notification group
- Staff Accept, Pending and Decline actions
- Staff reply to customer using `/reply REFERENCE message`
- Two-language group auto-translation
- Primary/secondary language controls
- Other-language `primary` or `ignore` mode
- Automatic welcome messages with variables
- Custom welcome command
- Admin dashboard for rooms, enquiries, bookings and group settings
- SQLite database
- Railway-compatible Node.js start command

## 1. Requirements

- Node.js 20 or newer
- A Telegram bot token from BotFather
- An HTTPS URL when deployed as a Telegram Mini App
- A LibreTranslate-compatible translation API or a replacement provider

## 2. Install on Windows

1. Extract the ZIP.
2. Open the extracted folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run:

```bash
npm install
```

5. Copy `.env.example` and rename the copy to `.env`.
6. Put your Telegram token in `.env`:

```env
TELEGRAM_BOT_TOKEN=YOUR_TOKEN
```

7. Change the admin password and session secret.
8. Start:

```bash
npm start
```

Open:

- Mini App: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`
- System check: `http://localhost:3000/health`

## 3. Telegram setup

You already disabled Privacy Mode. Also make the bot an administrator in groups where it should translate and welcome members.

In the staff group:

```text
/setstaff
```

In a translated group:

```text
/setlanguages en zh
/translation_on
/welcome_on
```

Khmer and English:

```text
/setlanguages km en
```

Control messages written in other languages:

```text
/setmode primary
```

or:

```text
/setmode ignore
```

Custom welcome:

```text
/setwelcome Welcome {first_name} to {group_name}! Our group translates {primary_language} and {secondary_language}.
```

Supported variables:

- `{first_name}`
- `{last_name}`
- `{username}`
- `{group_name}`
- `{primary_language}`
- `{secondary_language}`

Staff can reply to a Telegram customer request:

```text
/reply ENQ-20260724-ABCDE Your viewing is confirmed for tomorrow at 2:00 PM.
```

## 4. Translation API

The project uses a LibreTranslate-compatible interface:

```env
TRANSLATION_API_URL=https://your-translation-provider.example
TRANSLATION_API_KEY=YOUR_KEY
```

The exact number of languages depends on the provider. To guarantee 150+ languages, connect a provider whose official API supports that many languages. Without `TRANSLATION_API_URL`, the rest of the system works but automatic translation stays inactive.

## 5. Add photos later

Go to the admin dashboard, edit an apartment and place one public image URL per line in **Photo URLs**. The first URL becomes the card and detail image. No source-code change is required.

For local uploaded files, a future storage integration such as Cloudinary, S3 or Railway volume storage is recommended. Public URLs are supported now.

## 6. Deploy on Railway

1. Upload this project to GitHub.
2. Create a Railway project from the repository.
3. Add every value from `.env.example` as Railway variables.
4. Set:

```env
NODE_ENV=production
APP_URL=https://YOUR-PROJECT.up.railway.app
TELEGRAM_WEB_APP_URL=https://YOUR-PROJECT.up.railway.app
```

5. Deploy.
6. In BotFather use `/setmenubutton` and enter the HTTPS Mini App URL.

SQLite is suitable for one Railway instance. For multiple instances or higher traffic, migrate the database to PostgreSQL.

## 7. Security before public launch

- Change `ADMIN_PASSWORD`.
- Use a long random `SESSION_SECRET`.
- Never upload `.env` to GitHub.
- Use HTTPS.
- Use a reliable private translation API.
- Add persistent database backups.
- Limit the bot to trusted groups.

## 8. Practical scope

This release is a complete enterprise **core**, not a full hotel ERP. Online payments, real-time website synchronization, AI model billing, CRM automation, revenue accounting, multi-property tenancy, media storage and Google Calendar synchronization require external accounts/API keys and should be added as integrations after this core is running.
