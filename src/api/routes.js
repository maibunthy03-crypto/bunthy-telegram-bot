const express=require('express');
const db=require('../database/db');
const {roomToJson,reference}=require('../services/helpers');
const router=express.Router();
router.get('/rooms',(req,res)=>{
 let sql='SELECT * FROM rooms WHERE 1=1',params=[];
 if(req.query.available==='1'){sql+=' AND available=1'}
 if(req.query.bedrooms){sql+=' AND bedrooms=?';params.push(Number(req.query.bedrooms))}
 if(req.query.maxPrice){sql+=' AND monthly_price<=?';params.push(Number(req.query.maxPrice))}
 if(req.query.q){sql+=' AND (title LIKE ? OR description LIKE ?)';params.push(`%${req.query.q}%`,`%${req.query.q}%`)}
 sql+=' ORDER BY featured DESC,available DESC,id DESC';
 res.json(db.prepare(sql).all(...params).map(roomToJson));
});
router.get('/rooms/:id',(req,res)=>{const room=roomToJson(db.prepare('SELECT * FROM rooms WHERE id=?').get(req.params.id));return room?res.json(room):res.status(404).json({error:'Room not found'})});
router.post('/enquiries',(req,res)=>{
 const b=req.body||{}; if(!b.customerName||!b.phone||!b.message)return res.status(400).json({error:'Name, phone and message are required'});
 const ref=reference('ENQ');db.prepare(`INSERT INTO enquiries(reference,telegram_user_id,telegram_username,customer_name,phone,email,subject,message,room_id,preferred_date) VALUES(?,?,?,?,?,?,?,?,?,?)`).run(ref,b.telegramUserId||'',b.telegramUsername||'',b.customerName,b.phone,b.email||'',b.subject||'General enquiry',b.message,b.roomId||null,b.preferredDate||'');
 res.status(201).json({ok:true,reference:ref});
});
router.post('/bookings',(req,res)=>{
 const b=req.body||{}; if(!b.customerName||!b.phone||!b.roomId||!b.moveInDate)return res.status(400).json({error:'Name, phone, room and move-in date are required'});
 const room=db.prepare('SELECT id FROM rooms WHERE id=? AND available=1').get(b.roomId);if(!room)return res.status(400).json({error:'Room is not available'});
 const ref=reference('BKG');db.prepare(`INSERT INTO bookings(reference,telegram_user_id,customer_name,phone,email,room_id,move_in_date,special_request) VALUES(?,?,?,?,?,?,?,?)`).run(ref,b.telegramUserId||'',b.customerName,b.phone,b.email||'',b.roomId,b.moveInDate,b.specialRequest||'');
 res.status(201).json({ok:true,reference:ref});
});
router.get('/favorites/:userKey',(req,res)=>res.json(db.prepare(`SELECT r.* FROM favorites f JOIN rooms r ON r.id=f.room_id WHERE f.user_key=? ORDER BY f.id DESC`).all(req.params.userKey).map(roomToJson)));
router.post('/favorites',(req,res)=>{const {userKey,roomId}=req.body||{};if(!userKey||!roomId)return res.status(400).json({error:'userKey and roomId are required'});db.prepare('INSERT OR IGNORE INTO favorites(user_key,room_id) VALUES(?,?)').run(String(userKey),Number(roomId));res.json({ok:true})});
router.delete('/favorites/:userKey/:roomId',(req,res)=>{db.prepare('DELETE FROM favorites WHERE user_key=? AND room_id=?').run(req.params.userKey,req.params.roomId);res.json({ok:true})});
router.get('/stats',(req,res)=>res.json({rooms:db.prepare('SELECT COUNT(*) count FROM rooms').get().count,available:db.prepare('SELECT COUNT(*) count FROM rooms WHERE available=1').get().count,enquiries:db.prepare('SELECT COUNT(*) count FROM enquiries').get().count,bookings:db.prepare('SELECT COUNT(*) count FROM bookings').get().count,translations:db.prepare('SELECT COUNT(*) count FROM translation_logs').get().count}));
router.post('/assistant',(req,res)=>{const q=String(req.body?.message||'').toLowerCase();let answer='Our staff can help with availability, price, facilities, location, viewing appointments and bookings.';if(q.includes('price'))answer='Current prices are shown on each apartment card. Prices may change depending on room type and availability.';else if(q.includes('facility')||q.includes('gym')||q.includes('pool'))answer='Maline Apartments includes access to the gym, pool, steam room, sauna and children’s playground for eligible units.';else if(q.includes('electric'))answer='Electricity is excluded and charged at $0.25 per kilowatt-hour.';else if(q.includes('view'))answer='Open any room and select Schedule Viewing, then enter your preferred date and contact details.';else if(q.includes('location'))answer='Maline Apartments is in Phnom Penh. Use the Contact section to open the map and contact the team.';res.json({answer})});
module.exports=router;
