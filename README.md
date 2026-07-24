# Maline Smart Assistant V3.1 Premium

This corrected version adds:

- Animated splash screen
- Animated hero image and floating particles
- Icons throughout the Mini App
- Glassmorphism buttons and bottom navigation
- Scroll reveal animations
- Apartment filters
- Touch swipe gallery
- Photo counter and gallery dots
- English, Khmer and Chinese interface
- Google Cloud Translation backend from V3
- Fixed automatic welcome from V3
- Contact Guest button in staff inquiries
- Full property services and facility details

## Replace these files

Replace your current:

- index.js
- package.json
- web/index.html
- web/style.css
- web/app.js

Keep your existing Railway Variables.

## Required facility photos

Place these inside web/images:

- logo.png
- building.jpg
- city-view.jpg
- pool.jpg
- gym.jpg
- sauna.jpg
- playground.jpg
- lobby.jpg
- parking.jpg

## Ten room photos

Put 1.jpg through 10.jpg into every room folder.

Example:

web/images/one-bedroom-91/1.jpg
web/images/one-bedroom-91/2.jpg
...
web/images/one-bedroom-91/10.jpg

## Google Translation

Add this Railway variable:

GOOGLE_TRANSLATE_API_KEY=your_google_cloud_api_key

Then use:

/translation_status
/language en zh-CN

## Welcome message

Make the bot an administrator, then run:

/welcome_on
/autoreply_on
