const path = require('path');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const env = require('./src/config/env');
const db = require('./src/database/db');
const buildBot = require('./src/bot/bot');
const apiRoutes = require('./src/api/routes');

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: env.sessionSecret, resave: false, saveUninitialized: false, cookie: { httpOnly: true, sameSite: 'lax', secure: env.nodeEnv === 'production' } }));
app.use('/api', apiRoutes);
app.use('/', express.static(path.join(__dirname, 'mini-app')));
app.use('/admin-assets', express.static(path.join(__dirname, 'admin/public')));

function requireAuth(req, res, next) { if (req.session.admin) return next(); res.redirect('/admin/login'); }
app.get('/admin/login', (req,res) => res.sendFile(path.join(__dirname,'admin/views/login.html')));
app.post('/admin/login', (req,res) => {
  if (req.body.email === env.adminEmail && req.body.password === env.adminPassword) { req.session.admin = { email: req.body.email }; return res.redirect('/admin'); }
  res.status(401).send('Invalid login. <a href="/admin/login">Try again</a>');
});
app.post('/admin/logout', (req,res) => req.session.destroy(() => res.redirect('/admin/login')));
app.get('/admin', requireAuth, (req,res) => res.sendFile(path.join(__dirname,'admin/views/dashboard.html')));
app.get('/admin/api/rooms', requireAuth, (req,res) => res.json(db.prepare('SELECT * FROM rooms ORDER BY id DESC').all()));
app.post('/admin/api/rooms', requireAuth, (req,res) => {
  const b=req.body;
  const info=db.prepare(`INSERT INTO rooms(title,bedrooms,bathrooms,size_sqm,floor,monthly_price,currency,available,featured,description,facilities_json,included_json,excluded_json) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(b.title,Number(b.bedrooms||0),Number(b.bathrooms||0),Number(b.size_sqm||0),b.floor||'',Number(b.monthly_price||0),b.currency||'USD',b.available?1:0,b.featured?1:0,b.description||'',JSON.stringify(b.facilities||[]),JSON.stringify(b.servicesIncluded||[]),JSON.stringify(b.servicesExcluded||[]));
  res.json({ok:true,id:info.lastInsertRowid});
});
app.patch('/admin/api/rooms/:id', requireAuth, (req,res) => {
  const b=req.body;
  db.prepare(`UPDATE rooms SET title=?,bedrooms=?,bathrooms=?,size_sqm=?,floor=?,monthly_price=?,available=?,featured=?,description=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`)
    .run(b.title,Number(b.bedrooms||0),Number(b.bathrooms||0),Number(b.size_sqm||0),b.floor||'',Number(b.monthly_price||0),b.available?1:0,b.featured?1:0,b.description||'',req.params.id);
  res.json({ok:true});
});
app.delete('/admin/api/rooms/:id', requireAuth, (req,res)=>{db.prepare('DELETE FROM rooms WHERE id=?').run(req.params.id);res.json({ok:true});});
app.get('/admin/api/enquiries', requireAuth, (req,res)=>res.json(db.prepare('SELECT * FROM enquiries ORDER BY id DESC').all()));
app.get('/admin/api/groups', requireAuth, (req,res)=>res.json(db.prepare('SELECT * FROM groups ORDER BY updated_at DESC').all()));

app.get('/health', (req,res)=>res.json({ok:true,version:'4.0.0'}));
app.listen(env.port, () => console.log(`Maline V4 running on ${env.appUrl}`));

const bot = buildBot();
if (bot) bot.launch().then(()=>console.log('Telegram bot started')).catch(console.error);
else console.log('TELEGRAM_BOT_TOKEN missing: web app started without bot.');
process.once('SIGINT',()=>bot?.stop('SIGINT')); process.once('SIGTERM',()=>bot?.stop('SIGTERM'));
