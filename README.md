# Maline Mini App V3 — First Style Full

This version has the animated opening screen with:
- Maline logo animation
- Building rising animation
- Pink floating background
- Loading bar
- Smooth room-card reveal

Working functions:
- Telegram /start and menu
- Apartments, facilities, location and contact
- Booking inquiry form
- Inquiry sent to staff group
- Contacted / Completed / Cancelled buttons
- Welcome new group members
- Group auto-reply
- Google translation pair
- Admin list
- Prices and availability
- English / Khmer / Chinese Mini App
- Full mobile layout
- 10 photos for every room
- Railway-compatible web server

Setup:
1. Rename `.env.example` to `.env`.
2. Fill BOT_TOKEN, OWNER_ID and PUBLIC_URL.
3. Put `logo.png` and `building.jpg` inside `web/images/`.
4. Put room photos as `1.jpg` to `10.jpg` in each room folder.
5. Run `npm install`.
6. Run `npm start`.
7. Add the bot to the staff group, then run `/setstaffgroup`.
8. In BotFather use `/setmenubutton` and set URL to `https://YOUR-URL/app`.

Translation requires a Google Cloud Translation API key in GOOGLE_TRANSLATE_API_KEY.
