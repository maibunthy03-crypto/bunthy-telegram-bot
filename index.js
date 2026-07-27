require('dotenv').config();
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OWNER_ID = Number(process.env.OWNER_ID || 0);
const PUBLIC_URL = String(process.env.PUBLIC_URL || '').replace(/\/$/, '');
const RECEPTION_PHONE = process.env.RECEPTION_PHONE || '+855 23 985 959';
const RECEPTION_TELEGRAM = process.env.RECEPTION_TELEGRAM || '';
const WEBSITE = process.env.WEBSITE || 'https://www.malineapartments.com.kh';
const GOOGLE_MAPS_URL = process.env.GOOGLE_MAPS_URL || '';
const PORT = Number(process.env.PORT || 8080);
const DATA_FILE = path.join(__dirname, 'data', 'bot-data.json');

if (!BOT_TOKEN) {
  console.error('BOT_TOKEN is missing. Copy .env.example to .env and add your token.');
  process.exit(1);
}

const apartments = {
  studio50: { title:'Studio Apartment', size:'50 sqm', folder:'studio' },
  one84: { title:'1 Bedroom Apartment', size:'84 sqm', folder:'one-bedroom-84' },
  one91: { title:'1 Bedroom Apartment', size:'91 sqm', folder:'one-bedroom-91' },
  two130: { title:'2 Bedroom Apartment', size:'130 sqm', folder:'two-bedroom-130' },
  two138: { title:'2 Bedroom Apartment', size:'138 sqm', folder:'two-bedroom-138' },
  two148: { title:'2 Bedroom Apartment', size:'148 sqm', folder:'two-bedroom-148' },
  two150: { title:'2 Bedroom Apartment', size:'150 sqm', folder:'two-bedroom-150' },
  three176: { title:'3 Bedroom Apartment', size:'176 sqm', folder:'three-bedroom-176' },
  pha551: { title:'Penthouse A (PHA)', size:'551 sqm', folder:'pha' },
  phb465: { title:'Penthouse B (PHB)', size:'465 sqm', folder:'phb' },
  phc435: { title:'Penthouse C (PHC)', size:'435 sqm', folder:'phc' }
};

const included = [
  'Cable TV','Fully equipped kitchen','Iron and ironing board','Safe deposit box',
  'Washing machine','Dining table with chairs','Management fee','One in-house parking',
  'Gym, swimming pool, steam and sauna','Kids playground','Wi-Fi internet',
  'Cleaning and linen change twice per week','Water supply','Lift and building maintenance'
];
const excluded = ['Telephone IDD','Electricity usage — $0.25/kWh','Rooftop sky bar'];

function loadData(){
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return {staffGroupId:'',prices:{},availability:{},inquiries:[],stats:{starts:0,miniAppOpens:0,inquiries:0,welcomes:0}}; }
}
let data = loadData();
function saveData(){
  fs.mkdirSync(path.dirname(DATA_FILE), {recursive:true});
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}
function galleryFor(folder){
  const list = [];
  for(let i=1;i<=10;i++){
    for(const ext of ['jpg','jpeg','png','webp']){
      const file = path.join(__dirname,'web','images',folder,`${i}.${ext}`);
      if(fs.existsSync(file)){ list.push(`/web/images/${folder}/${i}.${ext}`); break; }
    }
  }
  return list.length ? list : ['/web/images/building.jpg'];
}

const bot = new Telegraf(BOT_TOKEN);
const isOwner = ctx => Number(ctx.from?.id || 0) === OWNER_ID;
const isGroup = ctx => ['group','supergroup'].includes(ctx.chat?.type);

function menu(){
  const rows = [];
  if(PUBLIC_URL) rows.push([Markup.button.webApp('🌸 Open Maline Mini App', `${PUBLIC_URL}/app`)]);
  rows.push(
    [Markup.button.callback('🏨 Apartments','apartments'),Markup.button.callback('📅 Book a Viewing','book')],
    [Markup.button.callback('🏊 Facilities','facilities'),Markup.button.callback('📞 Contact','contact')],
    [Markup.button.callback('📍 Location','location')]
  );
  return Markup.inlineKeyboard(rows);
}

bot.start(async ctx => {
  data.stats.starts = (data.stats.starts || 0) + 1; saveData();
  await ctx.reply('🌸 Welcome to Maline Exclusive Serviced Apartments\n\nExplore apartments, facilities and schedule a viewing.', menu());
});
bot.command('menu', ctx => ctx.reply('Main Menu', menu()));
bot.command('id', ctx => ctx.reply(`Chat ID: ${ctx.chat.id}\nYour ID: ${ctx.from.id}`));
bot.command('setstaffgroup', ctx => {
  if(!isOwner(ctx) || !isGroup(ctx)) return ctx.reply('Owner must run this command inside the staff group.');
  data.staffGroupId = String(ctx.chat.id); saveData();
  return ctx.reply('✅ Staff group saved.');
});
bot.command('setprice', ctx => {
  if(!isOwner(ctx)) return;
  const [,key,...value] = ctx.message.text.split(/\s+/);
  if(!apartments[key] || !value.length) return ctx.reply('Use: /setprice studio50 $1,200');
  data.prices[key] = value.join(' '); saveData(); ctx.reply('✅ Price updated.');
});
bot.command('setavailability', ctx => {
  if(!isOwner(ctx)) return;
  const [,key,...value] = ctx.message.text.split(/\s+/);
  if(!apartments[key] || !value.length) return ctx.reply('Use: /setavailability studio50 Available');
  data.availability[key] = value.join(' '); saveData(); ctx.reply('✅ Availability updated.');
});
bot.command('stats', ctx => {
  if(!isOwner(ctx)) return;
  const s=data.stats;
  ctx.reply(`📊 Starts: ${s.starts||0}\nMini App opens: ${s.miniAppOpens||0}\nInquiries: ${s.inquiries||0}`);
});

bot.action('apartments', async ctx => {
  await ctx.answerCbQuery();
  const buttons = Object.entries(apartments).map(([k,a]) => [Markup.button.callback(`${a.title} • ${a.size}`,`apt:${k}`)]);
  buttons.push([Markup.button.callback('⬅️ Main Menu','main')]);
  ctx.reply('Choose an apartment:',Markup.inlineKeyboard(buttons));
});
bot.action(/^apt:(.+)$/, async ctx => {
  await ctx.answerCbQuery();
  const key=ctx.match[1], a=apartments[key];
  if(!a) return;
  ctx.reply(`🏨 ${a.title}\n📐 ${a.size}\n💰 ${data.prices[key]||'Contact us for price'}\n🟢 ${data.availability[key]||'Contact reception'}`,
    Markup.inlineKeyboard([
      ...(PUBLIC_URL ? [[Markup.button.webApp('📷 View Gallery',`${PUBLIC_URL}/app?room=${key}`)]] : []),
      [Markup.button.callback('📅 Book This Apartment',`book:${key}`)]
    ]));
});
bot.action('book', async ctx => {
  await ctx.answerCbQuery();
  if(PUBLIC_URL) return ctx.reply('Open the booking form:',Markup.inlineKeyboard([[Markup.button.webApp('📅 Open Booking Form',`${PUBLIC_URL}/app#booking`)]]));
  ctx.reply(`Contact reception: ${RECEPTION_PHONE}`);
});
bot.action(/^book:(.+)$/, async ctx => {
  await ctx.answerCbQuery();
  const key=ctx.match[1];
  if(PUBLIC_URL) ctx.reply('Continue in the Mini App:',Markup.inlineKeyboard([[Markup.button.webApp('📅 Continue',`${PUBLIC_URL}/app?room=${key}#booking`)]]));
});
bot.action('facilities', async ctx => { await ctx.answerCbQuery(); ctx.reply('🏊 Swimming Pool\n💪 Professional Gym\n♨️ Steam & Sauna\n🧸 Kids Playground\n🚗 Parking\n📶 Wi-Fi\n🛡️ 24/7 Security'); });
bot.action('contact', async ctx => {
  await ctx.answerCbQuery();
  const rows=[];
  if(RECEPTION_TELEGRAM) rows.push([Markup.button.url('💬 Telegram Reception',RECEPTION_TELEGRAM)]);
  rows.push([Markup.button.url('🌐 Website',WEBSITE)]);
  ctx.reply(`📞 ${RECEPTION_PHONE}`,Markup.inlineKeyboard(rows));
});
bot.action('location', async ctx => {
  await ctx.answerCbQuery();
  ctx.reply('📍 Maline Exclusive Serviced Apartments, Phnom Penh', GOOGLE_MAPS_URL ? Markup.inlineKeyboard([[Markup.button.url('Open Google Maps',GOOGLE_MAPS_URL)]]) : undefined);
});
bot.action('main', async ctx => { await ctx.answerCbQuery(); ctx.reply('Main Menu',menu()); });

bot.on('new_chat_members', async ctx => {
  for(const member of ctx.message.new_chat_members || []){
    if(member.is_bot) continue;
    data.stats.welcomes=(data.stats.welcomes||0)+1; saveData();
    await ctx.reply(`🌸 Welcome, ${member.first_name || 'Guest'}!\nWelcome to Maline Exclusive Serviced Apartments.`,menu());
  }
});

async function notifyStaff(inquiry){
  if(!data.staffGroupId) return;
  const text = `🌸 NEW MALINE INQUIRY\n\nID: ${inquiry.id}\nGuest: ${inquiry.name}\nPhone: ${inquiry.phone}\nTelegram: ${inquiry.telegram||'-'}\nEmail: ${inquiry.email||'-'}\nApartment: ${inquiry.apartment}\nCheck-in: ${inquiry.checkIn}\nCheck-out: ${inquiry.checkOut||'-'}\nStay: ${inquiry.stay}\nBudget: ${inquiry.budget||'-'}\nMessage: ${inquiry.message||'-'}`;
  await bot.telegram.sendMessage(data.staffGroupId,text);
}

function sendJson(res,status,body){
  res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});
  res.end(JSON.stringify(body));
}
function bodyOf(req){
  return new Promise((resolve,reject)=>{
    let raw='';
    req.on('data',c=>{raw+=c;if(raw.length>1e6)req.destroy();});
    req.on('end',()=>resolve(raw));
    req.on('error',reject);
  });
}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};

const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,`http://${req.headers.host}`);
  if(url.pathname==='/'||url.pathname==='/health'){res.writeHead(200,{'Content-Type':'text/plain'});return res.end('Maline Mini App V3 is running');}
  if(url.pathname==='/api/config'){
    return sendJson(res,200,{phone:RECEPTION_PHONE,telegram:RECEPTION_TELEGRAM,website:WEBSITE,maps:GOOGLE_MAPS_URL,serviceIncluded:included,serviceExcluded:excluded,
      apartments:Object.entries(apartments).map(([key,a])=>({key,...a,images:galleryFor(a.folder),price:data.prices[key]||'Contact us for price',availability:data.availability[key]||'Contact reception'}))
    });
  }
  if(url.pathname==='/api/open'&&req.method==='POST'){data.stats.miniAppOpens=(data.stats.miniAppOpens||0)+1;saveData();return sendJson(res,200,{success:true});}
  if(url.pathname==='/api/inquiry'&&req.method==='POST'){
    try{
      const b=JSON.parse(await bodyOf(req));
      for(const f of ['name','phone','apartment','checkIn','stay']) if(!String(b[f]||'').trim()) return sendJson(res,400,{success:false,message:'Please complete all required fields.'});
      const inquiry={id:crypto.randomBytes(4).toString('hex').toUpperCase(),...b,createdAt:new Date().toISOString()};
      data.inquiries.unshift(inquiry); data.inquiries=data.inquiries.slice(0,500); data.stats.inquiries=(data.stats.inquiries||0)+1; saveData();
      await notifyStaff(inquiry);
      return sendJson(res,200,{success:true,inquiryId:inquiry.id});
    }catch(e){return sendJson(res,500,{success:false,message:'Unable to send inquiry.'});}
  }
  if(url.pathname==='/app'||url.pathname==='/app/') url.pathname='/web/index.html';
  if(url.pathname.startsWith('/web/')){
    const base=path.join(__dirname,'web');
    const rel=path.normalize(url.pathname.replace('/web/','')).replace(/^(\.\.(\/|\\|$))+/, '');
    const file=path.join(base,rel);
    if(!file.startsWith(base)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end('Not found');}
    res.writeHead(200,{'Content-Type':mime[path.extname(file).toLowerCase()]||'application/octet-stream'});
    return fs.createReadStream(file).pipe(res);
  }
  res.writeHead(404);res.end('Not found');
});

server.listen(PORT,'0.0.0.0',()=>console.log(`✅ Web server running on port ${PORT}`));
bot.launch().then(()=>console.log('✅ Maline Telegram Mini App V3 running')).catch(console.error);
process.once('SIGINT',()=>{bot.stop('SIGINT');server.close();});
process.once('SIGTERM',()=>{bot.stop('SIGTERM');server.close();});
