# Bunthy Translation Bot 2.0

A production-oriented Telegram group translation bot with:

- **193 language choices**
- Two-way automatic translation
- Fast in-memory TTL cache
- SQLite group settings and statistics
- Telegram owner admin panel
- Secure web dashboard
- Optional OpenAI language-detection and translation fallback
- Railway health check, restart policy and persistent-volume support

## Important translation note

The primary provider is the unofficial `@vitalets/google-translate-api` package. Some entries in the expanded language catalog may not be supported by that provider. When `OPENAI_API_KEY` and `OPENAI_MODEL` are configured, the AI fallback can handle ambiguous detection and unsupported/provider-failure cases.

## 1. Railway variables

Copy the names from `.env.example` into **Railway → Service → Variables**.

Required:

```env
BOT_TOKEN=your_botfather_token
OWNER_ID=your_numeric_telegram_user_id
ADMIN_USERNAME=bunthy
ADMIN_PASSWORD=use_a_long_unique_password
JWT_SECRET=use_at_least_32_random_characters
PUBLIC_URL=https://your-service.up.railway.app
DATABASE_PATH=/data/bunthy-bot.db
```

Optional AI fallback:

```env
OPENAI_API_KEY=your_server_side_api_key
OPENAI_MODEL=the_model_you_choose
```

Never put API keys in GitHub.

## 2. Add a Railway Volume

SQLite needs persistent storage:

1. Open the Railway project.
2. Add a **Volume** to the bot service.
3. Mount it at `/data`.
4. Keep `DATABASE_PATH=/data/bunthy-bot.db`.

Without a volume, statistics and group settings can reset after redeployment.

## 3. Generate a public domain

In Railway:

1. Open the service.
2. Go to **Settings → Networking**.
3. Select **Generate Domain**.
4. Copy it into `PUBLIC_URL`.

The dashboard is available at `/login`.

## 4. Telegram privacy mode

In `@BotFather`:

1. Send `/setprivacy`.
2. Select your bot.
3. Select **Disable**.
4. Remove and re-add the bot to the group when necessary.

## 5. Commands

- `/start`
- `/help`
- `/ping`
- `/language`
- `/current`
- `/stats`
- `/admin`
- `/pause`
- `/resume`
- `/reset`

Only the Telegram account matching `OWNER_ID` can change settings or open bot-admin functions.

## 6. Local run

```bash
cp .env.example .env
npm install
npm start
```

Open the dashboard at `http://localhost:3000/login`.

## Security

- Secrets load only from environment variables.
- Dashboard uses a signed, HTTP-only authentication cookie.
- Login endpoint is rate-limited.
- Helmet security headers are enabled.
- Never upload `.env`.
