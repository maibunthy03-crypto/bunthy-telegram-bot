# Maline Smart Assistant V2

## What is included
- Animated luxury Telegram Mini App
- Building background and parallax scrolling
- Studio, 1-bedroom, 2-bedroom and penthouse inventory
- Booking inquiry form sent to the Telegram staff group
- Group welcome messages
- Group automatic replies
- Group two-language automatic translation
- Owner/admin commands
- Inquiry status buttons in the staff group
- English, Khmer and Chinese Mini App interface

## Required image filenames
Put your existing Maline photos inside `web/images/` using these exact names:

- logo.png
- building.jpg
- city-view.jpg
- studio.jpg
- one-bedroom-84.jpg
- one-bedroom-91.jpg
- two-bedroom-130.jpg
- two-bedroom-138.jpg
- two-bedroom-148.jpg
- two-bedroom-150.jpg
- pha.jpg
- phb.jpg
- phc.jpg
- pool.jpg
- gym.jpg
- sauna.jpg
- lobby.jpg

## Railway variables
Copy all variables from `.env.example` into Railway Variables.
Do not manually create PORT on Railway.

## First setup
1. Upload all files to your GitHub repository.
2. Add your photos to `web/images/`.
3. Railway redeploys automatically.
4. In the staff group run `/setstaffgroup`.
5. In any guest group run `/welcome_on` and `/autoreply_on`.
6. For translation, run `/language en zh-CN`.

## Admin commands
- /admin
- /stats
- /addadmin USER_ID
- /removeadmin USER_ID
- /setstaffgroup
- /welcome_on
- /welcome_off
- /autoreply_on
- /autoreply_off
- /language en zh-CN
- /translation_off
- /setprice ROOM_KEY PRICE
- /setavailability ROOM_KEY STATUS

## Important
The free translation library is unofficial and may occasionally stop working. For reliable production translation across a large language list, connect Google Cloud Translation or another paid provider later.
