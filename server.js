const path=require('path');
const express=require('express');
const helmet=require('helmet');
const session=require('express-session');
const env=require('./src/config/env');
const db=require('./src/database/db');
const buildBot=require('./src/bot/bot');
const apiRoutes=require('./src/api/routes');
const {roomToJson,cleanArray}=require('./src/services/helpers');
const app=express();
app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:'1mb'}));
app.use(express.urlencoded({extended:true}));
app.use(session({secret:env.sessionSecret,resave:false,saveUninitialized:false,cookie:{httpOnly:true,sameSite:'lax',secure:env.nodeEnv==='production',maxAge:8*60*60*1000}}));
app.use('/api',apiRoutes);
app.use('/',express.static(path.join(__dirname,'mini-app')));
app.use('/admin-assets',express.static(path.join(__dirname,'admin/public')));
function auth(req,res,next){if(req.session.admin)return next();res.status(401).json({error:'Unauthorized'})}
function pageAuth(req,res,next){if(req.session.admin)return next();res.redirect('/admin/login')}
function audit(actor,action,details=''){db.prepare('INSERT INTO audit_logs(actor,action,details) VALUES(?,?,?)').run(actor,action,String(details))}
app.get('/admin/login',(req,res)=>res.sendFile(path.join(__dirname,'admin/views/login.html')));
app.post('/admin/login',(req,res)=>{if(req.body.email===env.adminEmail&&req.body.password===env.adminPassword){req.session.admin={email:req.body.email};audit(req.body.email,'login');return res.redirect('/admin')}res.status(401).send('Invalid login. <a href="/admin/login">Try again</a>')});
app.post('/admin/logout',(req,res)=>req.session.destroy(()=>res.redirect('/admin/login')));
app.get('/admin',pageAuth,(req,res)=>res.sendFile(path.join(__dirname,'admin/views/dashboard.html')));
app.get('/admin/api/dashboard',auth,(req,res)=>res.json({stats:{rooms:db.prepare('SELECT COUNT(*) n FROM rooms').get().n,available:db.prepare('SELECT COUNT(*) n FROM rooms WHERE available=1').get().n,enquiries:db.prepare("SELECT COUNT(*) n FROM enquiries WHERE status='new'").get().n,bookings:db.prepare("SELECT COUNT(*) n FROM bookings WHERE status='pending'").get().n,translations:db.prepare('SELECT COUNT(*) n FROM translation_logs').get().n},recentEnquiries:db.prepare('SELECT * FROM enquiries ORDER BY id DESC LIMIT 8').all(),recentBookings:db.prepare('SELECT b.*,r.title room_title FROM bookings b LEFT JOIN rooms r ON r.id=b.room_id ORDER BY b.id DESC LIMIT 8').all()}));
app.get('/admin/api/rooms',auth,(req,res)=>res.json(db.prepare('SELECT * FROM rooms ORDER BY featured DESC,id DESC').all().map(roomToJson)));
app.post('/admin/api/rooms',auth,(req,res)=>{const b=req.body||{};if(!b.title)return res.status(400).json({error:'Title is required'});const info=db.prepare(`INSERT INTO rooms(title,unit_number,bedrooms,bathrooms,size_sqm,floor,monthly_price,currency,available,featured,description,photos_json,videos_json,facilities_json,included_json,excluded_json,nearby_json) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(b.title,b.unitNumber||'',Number(b.bedrooms||0),Number(b.bathrooms||0),Number(b.sizeSqm||0),b.floor||'',Number(b.monthlyPrice||0),b.currency||'USD',b.available?1:0,b.featured?1:0,b.description||'',JSON.stringify(cleanArray(b.photos)),JSON.stringify(cleanArray(b.videos)),JSON.stringify(cleanArray(b.facilities)),JSON.stringify(cleanArray(b.servicesIncluded)),JSON.stringify(cleanArray(b.servicesExcluded)),JSON.stringify(cleanArray(b.nearbyPlaces)));audit(req.session.admin.email,'room_create',info.lastInsertRowid);res.status(201).json({ok:true,id:info.lastInsertRowid})});
app.put('/admin/api/rooms/:id',auth,(req,res)=>{const b=req.body||{};db.prepare(`UPDATE rooms SET title=?,unit_number=?,bedrooms=?,bathrooms=?,size_sqm=?,floor=?,monthly_price=?,currency=?,available=?,featured=?,description=?,photos_json=?,videos_json=?,facilities_json=?,included_json=?,excluded_json=?,nearby_json=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(b.title,b.unitNumber||'',Number(b.bedrooms||0),Number(b.bathrooms||0),Number(b.sizeSqm||0),b.floor||'',Number(b.monthlyPrice||0),b.currency||'USD',b.available?1:0,b.featured?1:0,b.description||'',JSON.stringify(cleanArray(b.photos)),JSON.stringify(cleanArray(b.videos)),JSON.stringify(cleanArray(b.facilities)),JSON.stringify(cleanArray(b.servicesIncluded)),JSON.stringify(cleanArray(b.servicesExcluded)),JSON.stringify(cleanArray(b.nearbyPlaces)),req.params.id);audit(req.session.admin.email,'room_update',req.params.id);res.json({ok:true})});
app.delete('/admin/api/rooms/:id',auth,(req,res)=>{db.prepare('DELETE FROM rooms WHERE id=?').run(req.params.id);audit(req.session.admin.email,'room_delete',req.params.id);res.json({ok:true})});
app.get('/admin/api/enquiries',auth,(req,res)=>res.json(db.prepare('SELECT e.*,r.title room_title FROM enquiries e LEFT JOIN rooms r ON r.id=e.room_id ORDER BY e.id DESC').all()));
app.patch('/admin/api/enquiries/:id',auth,(req,res)=>{const allowed=['new','pending','accepted','declined','closed'];if(!allowed.includes(req.body.status))return res.status(400).json({error:'Invalid status'});db.prepare('UPDATE enquiries SET status=?,assigned_to=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(req.body.status,req.session.admin.email,req.params.id);res.json({ok:true})});
app.get('/admin/api/bookings',auth,(req,res)=>res.json(db.prepare('SELECT b.*,r.title room_title FROM bookings b LEFT JOIN rooms r ON r.id=b.room_id ORDER BY b.id DESC').all()));
app.patch('/admin/api/bookings/:id',auth,(req,res)=>{const allowed=['pending','confirmed','declined','cancelled','completed'];if(!allowed.includes(req.body.status))return res.status(400).json({error:'Invalid status'});db.prepare('UPDATE bookings SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(req.body.status,req.params.id);res.json({ok:true})});
app.get('/admin/api/groups',auth,(req,res)=>res.json(db.prepare('SELECT * FROM groups ORDER BY updated_at DESC').all()));
app.put('/admin/api/groups/:chatId',auth,(req,res)=>{const b=req.body||{};db.prepare(`UPDATE groups SET translation_enabled=?,primary_language=?,secondary_language=?,other_language_mode=?,welcome_enabled=?,welcome_message=?,updated_at=CURRENT_TIMESTAMP WHERE chat_id=?`).run(b.translationEnabled?1:0,b.primaryLanguage||'en',b.secondaryLanguage||'zh',b.otherLanguageMode||'primary',b.welcomeEnabled?1:0,b.welcomeMessage||'',req.params.chatId);res.json({ok:true})});
app.get('/health',(req,res)=>res.json({ok:true,version:'4.1.0',botConfigured:Boolean(env.botToken),translationConfigured:Boolean(env.translationApiUrl)}));
const server=app.listen(env.port,()=>console.log(`Maline V4.1 running at ${env.appUrl}`));
const bot=buildBot();if(bot)bot.launch().then(()=>console.log('Telegram bot started')).catch(err=>console.error('Telegram launch failed:',err.message));else console.log('Bot token missing: web system started without Telegram bot.');
function shutdown(signal){bot?.stop(signal);server.close(()=>process.exit(0))}process.once('SIGINT',()=>shutdown('SIGINT'));process.once('SIGTERM',()=>shutdown('SIGTERM'));
