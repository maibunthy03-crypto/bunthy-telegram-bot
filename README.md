# Maline Telegram Mini App V3

## 1. Add your images
Put these files inside `web/images/`:
- `logo.png`
- `building.jpg`
- `pool.jpg`, `gym.jpg`, `sauna.jpg`, `playground.jpg`, `lobby.jpg`, `parking.jpg` (optional)

Room galleries use folders:
- studio
- one-bedroom-84
- one-bedroom-91
- two-bedroom-130
- two-bedroom-138
- two-bedroom-148
- two-bedroom-150
- three-bedroom-176
- pha
- phb
- phc

Inside each folder add `1.jpg` through `10.jpg`.

## 2. Configure
Copy `.env.example` to `.env`, then add:
- BOT_TOKEN
- OWNER_ID
- PUBLIC_URL
- reception contact information

## 3. Run locally
```bash
npm install
npm start
```

Open:
- Health: http://localhost:8080/health
- Mini App: http://localhost:8080/app

## 4. Railway
Upload this project to GitHub or Railway.
Set all `.env` variables in Railway Variables.
Use start command: `npm start`.

After Railway gives your HTTPS URL, put it in `PUBLIC_URL`.
In BotFather use `/setmenubutton`, select your bot, and paste:
`https://YOUR-RAILWAY-URL/app`

## 5. Staff group
Add the bot to your staff Telegram group.
Run `/setstaffgroup` inside that group from the OWNER_ID account.

## Admin commands
- `/id`
- `/setstaffgroup`
- `/setprice studio50 $1,200`
- `/setavailability studio50 Available`
- `/stats`
