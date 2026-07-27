# Maline Translate Bot — Option 2

This version uses `google-translate-api-x`.

No Google Cloud API key is required.

## Railway variables

BOT_TOKEN=your new Telegram bot token
OWNER_ID=your Telegram numeric ID
TRANSLATION_ENABLED=true

## Deploy

1. Upload every file from this ZIP.
2. Do not keep an old package-lock.json from the previous project.
3. Set Start Command to `npm start`.
4. Redeploy.
5. In BotFather, disable privacy mode with `/setprivacy`.
6. Remove and re-add the bot to the group as administrator.
7. Run `/languages`.
8. Select both languages.
9. Send a normal group message.

## Expected Railway logs

Connected to @YourBot
google-translate-api-x loaded
Translation enabled: true

When a message arrives:

Message received
Detected=en
Translation sent
