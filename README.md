# Maline Pink Telegram Mini App

## Replace these files

1. Replace your old `index.js` with the new `index.js`.
2. Create a folder named `web`.
3. Put `index.html` inside the `web` folder.
4. Replace `package.json`.
5. Copy `.env.example` to `.env`.
6. Put your NEW BotFather token in `.env`.

## Run locally

```powershell
npm install
npm start
```

Open this in Chrome for testing:

```text
http://localhost:8000/app
```

## Important

Telegram Mini Apps require a public HTTPS address. Localhost cannot open from your phone.

After deploying to Railway, put the Railway address in `.env`:

```env
PUBLIC_URL=https://your-project-name.up.railway.app
```

Then restart/redeploy the project and send `/start` to the bot again.

Normal Telegram chat buttons cannot be made pink. The buttons become pink inside the Mini App after tapping the full-screen menu button.
