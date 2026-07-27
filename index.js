
require('dotenv').config();
const fs=require('fs'), path=require('path'), http=require('http'), crypto=require('crypto');
const {Telegraf,Markup,Input}=require('telegraf');

const BOT_TOKEN=process.env.BOT_TOKEN;
const OWNER_ID=Number(process.env.OWNER_ID||0);
const DEFAULT_STAFF_GROUP_ID=String(process.env.STAFF_GROUP_ID||'');
const PUBLIC_URL=String(process.env.PUBLIC_URL||'').replace(/\/$/,'');
const RECEPTION_PHONE=process.env.RECEPTION_PHONE||'+855 23 985 959';
const RECEPTION_TELEGRAM=process.env.RECEPTION_TELEGRAM||'';
const WEBSITE=process.env.WEBSITE||'https://www.malineapartments.com.kh';
const GOOGLE_MAPS_URL=process.env.GOOGLE_MAPS_URL||'';
const GOOGLE_TRANSLATE_API_KEY=process.env.GOOGLE_TRANSLATE_API_KEY||'';
const PORT=Number(process.env.PORT||8080);
if(!BOT_TOKEN){console.error('BOT_TOKEN is missing');process.exit(1)}
const bot=new Telegraf(BOT_TOKEN);
const DATA_FILE=path.join(__dirname,'data','bot-data.json');

const SERVICE_INCLUDED=['Cable TV','Fully equipped kitchen','Iron and ironing board','Safe deposit box','Washing machine','Dining table with chairs','Management fee','One in-house parking','Daily newspaper at lobby','Modern gym','Swimming pool','Steam and sauna','Kids playground','Wi-Fi internet','Cleaning and linen change twice per week','Water supply','Lift maintenance','Building maintenance'];
const SERVICE_EXCLUDED=['Telephone IDD','Electricity usage — $0.25/kWh','Rooftop sky bar'];
const apartments={
 studio50:{title:'Studio Apartment',size:'50 sqm',folder:'studio'},
 one84:{title:'1 Bedroom Apartment',size:'84 sqm',folder:'one-bedroom-84'},
 one91:{title:'1 Bedroom Apartment',size:'91 sqm',folder:'one-bedroom-91'},
 two130:{title:'2 Bedroom Apartment',size:'130 sqm',folder:'two-bedroom-130'},
 two138:{title:'2 Bedroom Apartment',size:'138 sqm',folder:'two-bedroom-138'},
 two148:{title:'2 Bedroom Apartment',size:'148 sqm',folder:'two-bedroom-148'},
 two150:{title:'2 Bedroom Apartment',size:'150 sqm',folder:'two-bedroom-150'},
 three176:{title:'3 Bedroom Apartment',size:'176 sqm',folder:'three-bedroom-176'},
 pha551:{title:'Penthouse A (PHA)',size:'551 sqm',folder:'pha'},
 phb465:{title:'Penthouse B (PHB)',size:'465 sqm',folder:'phb'},
 phc435:{title:'Penthouse C (PHC)',size:'435 sqm',folder:'phc'}
};
function defaultData(){return{users:{},admins:[],staffGroupId:DEFAULT_STAFF_GROUP_ID,translationPairs:{},welcomeEnabled:{},autoReplyEnabled:{},prices:{},availability:{},inquiries:[],stats:{starts:0,inquiries:0,translations:0,welcomes:0,autoReplies:0,miniAppOpens:0}}}
function loadData(){try{return{...defaultData(),...JSON.parse(fs.readFileSync(DATA_FILE,'utf8'))}}catch{return defaultData()}}
let data=loadData();
function saveData(){fs.mkdirSync(path.dirname(DATA_FILE),{recursive:true});fs.writeFileSync(DATA_FILE,JSON.stringify(data,null,2))}
function isAdmin(ctx){const id=Number(ctx.from?.id||0);return id===OWNER_ID||data.admins.map(Number).includes(id)}
function isGroup(ctx){return['group','supergroup'].includes(ctx.chat?.type)}
function staffGroupId(){return String(data.staffGroupId||DEFAULT_STAFF_GROUP_ID||'')}
function galleryFor(folder){const a=[];for(let i=1;i<=10;i++)for(const ext of['jpg','jpeg','png','webp']){const f=path.join(__dirname,'web','images',folder,`${i}.${ext}`);if(fs.existsSync(f)){a.push(`/web/images/${folder}/${i}.${ext}`);break}}return a.length?a:['/web/images/building.jpg']}
function contactBlock(){return`📞 ${RECEPTION_PHONE}\n🌐 ${WEBSITE}${RECEPTION_TELEGRAM?`\n💬 ${RECEPTION_TELEGRAM}`:''}`}
function mainKeyboard(){const rows=[];if(PUBLIC_URL)rows.push([Markup.button.webApp('🌸 Open Maline Mini App',`${PUBLIC_URL}/app`)]);rows.push([Markup.button.callback('🏨 Apartments','apartments'),Markup.button.callback('📅 Book a Viewing','book')],[Markup.button.callback('🏊 Facilities','facilities'),Markup.button.callback('📞 Contact','contact')],[Markup.button.callback('📍 Location','location'),Markup.button.callback('🌍 Languages','language_help')]);return Markup.inlineKeyboard(rows)}
async function safeMainMenu(ctx){const building=path.join(__dirname,'web','images','building.jpg');const caption='🌸 Welcome to Maline Exclusive Serviced Apartments\n\nLuxury serviced apartments in the heart of Phnom Penh.\nExplore rooms, facilities and send a viewing inquiry.';if(fs.existsSync(building))return ctx.replyWithPhoto(Input.fromLocalFile(building),{caption,...mainKeyboard()});return ctx.reply(caption,mainKeyboard())}
function apartmentKeyboard(){return Markup.inlineKeyboard(Object.entries(apartments).map(([k,a])=>[Markup.button.callback(`${a.title} • ${a.size}`,`apt:${k}`)]).concat([[Markup.button.callback('⬅️ Main Menu','main')]]))}
async function sendApartment(ctx,key){const a=apartments[key];if(!a)return;const text=`🏨 ${a.title}\n📐 ${a.size}\n💰 ${data.prices[key]||'Contact us for price'}\n🟢 Availability: ${data.availability[key]||'Contact reception'}\n\n${contactBlock()}`;const rows=[];if(PUBLIC_URL)rows.push([Markup.button.webApp('📷 View Photo Gallery',`${PUBLIC_URL}/app?room=${key}#apartments`)]);rows.push([Markup.button.callback('📅 Book This Apartment',`book:${key}`)],[Markup.button.callback('⬅️ Apartments','apartments')]);return ctx.reply(text,Markup.inlineKeyboard(rows))}
async function translateText(text,target,source=''){if(!GOOGLE_TRANSLATE_API_KEY)throw new Error('GOOGLE_TRANSLATE_API_KEY missing');const body=new URLSearchParams({q:text,target,format:'text'});if(source)body.set('source',source);const r=await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(GOOGLE_TRANSLATE_API_KEY)}`,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});const j=await r.json();if(!r.ok)throw new Error(j?.error?.message||'Translation failed');const x=j.data.translations[0];return{text:x.translatedText,detected:x.detectedSourceLanguage||source}}
function matchAutoReply(text){const t=text.toLowerCase();const rules=[{keys:['price','cost','rent','តម្លៃ','价格'],reply:`💰 Please contact us for the latest price.\n${contactBlock()}`},{keys:['available','availability','vacant','ទំនេរ','空房'],reply:`🟢 Please contact reception for current availability.\n${contactBlock()}`},{keys:['location','address','where','ទីតាំង','地址'],reply:`📍 Maline Exclusive Serviced Apartments, Phnom Penh.${GOOGLE_MAPS_URL?`\n${GOOGLE_MAPS_URL}`:''}`},{keys:['pool','gym','sauna','steam','parking','wifi','facility','បរិក្ខារ','健身房'],reply:'🏊 Pool, gym, steam, sauna, kids playground, parking, Wi-Fi and 24/7 reception.'}];return rules.find(r=>r.keys.some(k=>t.includes(k)))?.reply||null}
async function sendInquiryToStaff(q){const gid=staffGroupId();if(!gid)return;const text=`🌸 NEW MALINE INQUIRY\n\nID: ${q.id}\nGuest: ${q.name}\nPhone: ${q.phone}\nTelegram: ${q.telegram||'-'}\nEmail: ${q.email||'-'}\nApartment: ${q.apartment}\nCheck-in: ${q.checkIn}\nCheck-out: ${q.checkOut||'-'}\nStay: ${q.stay}\nBudget: ${q.budget||'-'}\nMessage: ${q.message||'-'}`;const rows=[];if(q.telegram&&/^@?[A-Za-z0-9_]{5,}$/.test(q.telegram))rows.push([Markup.button.url('💬 Contact Guest',`https://t.me/${q.telegram.replace('@','')}`)]);rows.push([Markup.button.callback('✅ Contacted',`inq:contacted:${q.id}`)],[Markup.button.callback('✔ Completed',`inq:completed:${q.id}`),Markup.button.callback('❌ Cancelled',`inq:cancelled:${q.id}`)]);await bot.telegram.sendMessage(gid,text,Markup.inlineKeyboard(rows))}
bot.start(async ctx=>{data.stats.starts++;data.users[String(ctx.from.id)]={name:[ctx.from.first_name,ctx.from.last_name].filter(Boolean).join(' '),username:ctx.from.username||'',lastSeen:new Date().toISOString()};saveData();await safeMainMenu(ctx)});
bot.command('menu',safeMainMenu);bot.command('id',ctx=>ctx.reply(`Chat ID: ${ctx.chat.id}\nYour ID: ${ctx.from.id}`));
bot.command('admin',ctx=>{if(!isAdmin(ctx))return ctx.reply('🔒 Admin only.');return ctx.reply(`👑 Admin Commands\n/stats\n/addadmin USER_ID\n/removeadmin USER_ID\n/setstaffgroup\n/welcome_on\n/welcome_off\n/autoreply_on\n/autoreply_off\n/language en zh-CN\n/translation_off\n/setprice ROOM_KEY PRICE\n/setavailability ROOM_KEY STATUS\n\nRoom keys:\n${Object.keys(apartments).join('\n')}`)});
bot.command('stats',ctx=>{if(!isAdmin(ctx))return;const s=data.stats;ctx.reply(`📊 Starts: ${s.starts}\nMini App opens: ${s.miniAppOpens}\nInquiries: ${s.inquiries}\nTranslations: ${s.translations}\nWelcomes: ${s.welcomes}\nAuto replies: ${s.autoReplies}`)});
bot.command('addadmin',ctx=>{if(Number(ctx.from.id)!==OWNER_ID)return ctx.reply('Owner only.');const id=Number(ctx.message.text.split(/\s+/)[1]);if(!id)return ctx.reply('Use: /addadmin USER_ID');if(!data.admins.includes(id))data.admins.push(id);saveData();ctx.reply('✅ Admin added')});
bot.command('removeadmin',ctx=>{if(Number(ctx.from.id)!==OWNER_ID)return;const id=Number(ctx.message.text.split(/\s+/)[1]);data.admins=data.admins.filter(x=>Number(x)!==id);saveData();ctx.reply('✅ Admin removed')});
bot.command('setstaffgroup',ctx=>{if(!isAdmin(ctx)||!isGroup(ctx))return ctx.reply('Run this command inside the staff group.');data.staffGroupId=String(ctx.chat.id);saveData();ctx.reply('✅ Staff group saved')});
for(const [cmd,field,val] of [['welcome_on','welcomeEnabled',true],['welcome_off','welcomeEnabled',false],['autoreply_on','autoReplyEnabled',true],['autoreply_off','autoReplyEnabled',false]])bot.command(cmd,ctx=>{if(!isAdmin(ctx)||!isGroup(ctx))return ctx.reply('Admin group command only.');data[field][String(ctx.chat.id)]=val;saveData();ctx.reply(`✅ ${cmd.replace('_',' ')}`)});

const PREMIUM_LANGUAGES=[{"code": "af", "flag": "🇿🇦", "name": "Afrikaans"}, {"code": "sq", "flag": "🇦🇱", "name": "Albanian"}, {"code": "am", "flag": "🇪🇹", "name": "Amharic"}, {"code": "ar", "flag": "🇸🇦", "name": "Arabic"}, {"code": "hy", "flag": "🇦🇲", "name": "Armenian"}, {"code": "as", "flag": "🇮🇳", "name": "Assamese"}, {"code": "ay", "flag": "🇧🇴", "name": "Aymara"}, {"code": "az", "flag": "🇦🇿", "name": "Azerbaijani"}, {"code": "bm", "flag": "🇲🇱", "name": "Bambara"}, {"code": "eu", "flag": "🇪🇸", "name": "Basque"}, {"code": "be", "flag": "🇧🇾", "name": "Belarusian"}, {"code": "bn", "flag": "🇧🇩", "name": "Bengali"}, {"code": "bho", "flag": "🇮🇳", "name": "Bhojpuri"}, {"code": "bs", "flag": "🇧🇦", "name": "Bosnian"}, {"code": "bg", "flag": "🇧🇬", "name": "Bulgarian"}, {"code": "ca", "flag": "🇪🇸", "name": "Catalan"}, {"code": "ceb", "flag": "🇵🇭", "name": "Cebuano"}, {"code": "ny", "flag": "🇲🇼", "name": "Chichewa"}, {"code": "zh-CN", "flag": "🇨🇳", "name": "Chinese Simplified"}, {"code": "zh-TW", "flag": "🇹🇼", "name": "Chinese Traditional"}, {"code": "co", "flag": "🇫🇷", "name": "Corsican"}, {"code": "hr", "flag": "🇭🇷", "name": "Croatian"}, {"code": "cs", "flag": "🇨🇿", "name": "Czech"}, {"code": "da", "flag": "🇩🇰", "name": "Danish"}, {"code": "dv", "flag": "🇲🇻", "name": "Dhivehi"}, {"code": "doi", "flag": "🇮🇳", "name": "Dogri"}, {"code": "nl", "flag": "🇳🇱", "name": "Dutch"}, {"code": "en", "flag": "🇬🇧", "name": "English"}, {"code": "eo", "flag": "🌍", "name": "Esperanto"}, {"code": "et", "flag": "🇪🇪", "name": "Estonian"}, {"code": "ee", "flag": "🇬🇭", "name": "Ewe"}, {"code": "fil", "flag": "🇵🇭", "name": "Filipino"}, {"code": "fi", "flag": "🇫🇮", "name": "Finnish"}, {"code": "fr", "flag": "🇫🇷", "name": "French"}, {"code": "fy", "flag": "🇳🇱", "name": "Frisian"}, {"code": "gl", "flag": "🇪🇸", "name": "Galician"}, {"code": "ka", "flag": "🇬🇪", "name": "Georgian"}, {"code": "de", "flag": "🇩🇪", "name": "German"}, {"code": "el", "flag": "🇬🇷", "name": "Greek"}, {"code": "gn", "flag": "🇵🇾", "name": "Guarani"}, {"code": "gu", "flag": "🇮🇳", "name": "Gujarati"}, {"code": "ht", "flag": "🇭🇹", "name": "Haitian Creole"}, {"code": "ha", "flag": "🇳🇬", "name": "Hausa"}, {"code": "haw", "flag": "🇺🇸", "name": "Hawaiian"}, {"code": "he", "flag": "🇮🇱", "name": "Hebrew"}, {"code": "hi", "flag": "🇮🇳", "name": "Hindi"}, {"code": "hmn", "flag": "🌏", "name": "Hmong"}, {"code": "hu", "flag": "🇭🇺", "name": "Hungarian"}, {"code": "is", "flag": "🇮🇸", "name": "Icelandic"}, {"code": "ig", "flag": "🇳🇬", "name": "Igbo"}, {"code": "ilo", "flag": "🇵🇭", "name": "Ilocano"}, {"code": "id", "flag": "🇮🇩", "name": "Indonesian"}, {"code": "ga", "flag": "🇮🇪", "name": "Irish"}, {"code": "it", "flag": "🇮🇹", "name": "Italian"}, {"code": "ja", "flag": "🇯🇵", "name": "Japanese"}, {"code": "jv", "flag": "🇮🇩", "name": "Javanese"}, {"code": "kn", "flag": "🇮🇳", "name": "Kannada"}, {"code": "kk", "flag": "🇰🇿", "name": "Kazakh"}, {"code": "km", "flag": "🇰🇭", "name": "Khmer"}, {"code": "rw", "flag": "🇷🇼", "name": "Kinyarwanda"}, {"code": "gom", "flag": "🇮🇳", "name": "Konkani"}, {"code": "ko", "flag": "🇰🇷", "name": "Korean"}, {"code": "kri", "flag": "🇸🇱", "name": "Krio"}, {"code": "ku", "flag": "🌍", "name": "Kurdish"}, {"code": "ckb", "flag": "🌍", "name": "Kurdish Sorani"}, {"code": "ky", "flag": "🇰🇬", "name": "Kyrgyz"}, {"code": "lo", "flag": "🇱🇦", "name": "Lao"}, {"code": "la", "flag": "🏛️", "name": "Latin"}, {"code": "lv", "flag": "🇱🇻", "name": "Latvian"}, {"code": "ln", "flag": "🇨🇩", "name": "Lingala"}, {"code": "lt", "flag": "🇱🇹", "name": "Lithuanian"}, {"code": "lg", "flag": "🇺🇬", "name": "Luganda"}, {"code": "lb", "flag": "🇱🇺", "name": "Luxembourgish"}, {"code": "mk", "flag": "🇲🇰", "name": "Macedonian"}, {"code": "mai", "flag": "🇮🇳", "name": "Maithili"}, {"code": "mg", "flag": "🇲🇬", "name": "Malagasy"}, {"code": "ms", "flag": "🇲🇾", "name": "Malay"}, {"code": "ml", "flag": "🇮🇳", "name": "Malayalam"}, {"code": "mt", "flag": "🇲🇹", "name": "Maltese"}, {"code": "mi", "flag": "🇳🇿", "name": "Maori"}, {"code": "mr", "flag": "🇮🇳", "name": "Marathi"}, {"code": "mni", "flag": "🇮🇳", "name": "Meiteilon"}, {"code": "lus", "flag": "🇮🇳", "name": "Mizo"}, {"code": "mn", "flag": "🇲🇳", "name": "Mongolian"}, {"code": "my", "flag": "🇲🇲", "name": "Myanmar"}, {"code": "ne", "flag": "🇳🇵", "name": "Nepali"}, {"code": "no", "flag": "🇳🇴", "name": "Norwegian"}, {"code": "or", "flag": "🇮🇳", "name": "Odia"}, {"code": "om", "flag": "🇪🇹", "name": "Oromo"}, {"code": "ps", "flag": "🇦🇫", "name": "Pashto"}, {"code": "fa", "flag": "🇮🇷", "name": "Persian"}, {"code": "pl", "flag": "🇵🇱", "name": "Polish"}, {"code": "pt", "flag": "🇵🇹", "name": "Portuguese"}, {"code": "pa", "flag": "🇮🇳", "name": "Punjabi"}, {"code": "qu", "flag": "🇵🇪", "name": "Quechua"}, {"code": "ro", "flag": "🇷🇴", "name": "Romanian"}, {"code": "ru", "flag": "🇷🇺", "name": "Russian"}, {"code": "sm", "flag": "🇼🇸", "name": "Samoan"}, {"code": "sa", "flag": "🇮🇳", "name": "Sanskrit"}, {"code": "gd", "flag": "🏴", "name": "Scots Gaelic"}, {"code": "nso", "flag": "🇿🇦", "name": "Sepedi"}, {"code": "sr", "flag": "🇷🇸", "name": "Serbian"}, {"code": "st", "flag": "🇱🇸", "name": "Sesotho"}, {"code": "sn", "flag": "🇿🇼", "name": "Shona"}, {"code": "sd", "flag": "🇵🇰", "name": "Sindhi"}, {"code": "si", "flag": "🇱🇰", "name": "Sinhala"}, {"code": "sk", "flag": "🇸🇰", "name": "Slovak"}, {"code": "sl", "flag": "🇸🇮", "name": "Slovenian"}, {"code": "so", "flag": "🇸🇴", "name": "Somali"}, {"code": "es", "flag": "🇪🇸", "name": "Spanish"}, {"code": "su", "flag": "🇮🇩", "name": "Sundanese"}, {"code": "sw", "flag": "🇰🇪", "name": "Swahili"}, {"code": "sv", "flag": "🇸🇪", "name": "Swedish"}, {"code": "tg", "flag": "🇹🇯", "name": "Tajik"}, {"code": "ta", "flag": "🇮🇳", "name": "Tamil"}, {"code": "tt", "flag": "🌍", "name": "Tatar"}, {"code": "te", "flag": "🇮🇳", "name": "Telugu"}, {"code": "th", "flag": "🇹🇭", "name": "Thai"}, {"code": "ti", "flag": "🇪🇷", "name": "Tigrinya"}, {"code": "ts", "flag": "🇿🇦", "name": "Tsonga"}, {"code": "tr", "flag": "🇹🇷", "name": "Turkish"}, {"code": "tk", "flag": "🇹🇲", "name": "Turkmen"}, {"code": "ak", "flag": "🇬🇭", "name": "Twi"}, {"code": "uk", "flag": "🇺🇦", "name": "Ukrainian"}, {"code": "ur", "flag": "🇵🇰", "name": "Urdu"}, {"code": "ug", "flag": "🌏", "name": "Uyghur"}, {"code": "uz", "flag": "🇺🇿", "name": "Uzbek"}, {"code": "vi", "flag": "🇻🇳", "name": "Vietnamese"}, {"code": "cy", "flag": "🏴", "name": "Welsh"}, {"code": "xh", "flag": "🇿🇦", "name": "Xhosa"}, {"code": "yi", "flag": "🌍", "name": "Yiddish"}, {"code": "yo", "flag": "🇳🇬", "name": "Yoruba"}, {"code": "zu", "flag": "🇿🇦", "name": "Zulu"}, {"code": "ace", "flag": "🇮🇩", "name": "Acehnese"}, {"code": "ach", "flag": "🇺🇬", "name": "Acholi"}, {"code": "awa", "flag": "🇮🇳", "name": "Awadhi"}, {"code": "bal", "flag": "🇵🇰", "name": "Balochi"}, {"code": "ban", "flag": "🇮🇩", "name": "Balinese"}, {"code": "ba", "flag": "🇷🇺", "name": "Bashkir"}, {"code": "ber", "flag": "🌍", "name": "Berber"}, {"code": "br", "flag": "🇫🇷", "name": "Breton"}, {"code": "bua", "flag": "🇷🇺", "name": "Buryat"}, {"code": "ch", "flag": "🇬🇺", "name": "Chamorro"}, {"code": "chr", "flag": "🇺🇸", "name": "Cherokee"}, {"code": "cv", "flag": "🇷🇺", "name": "Chuvash"}, {"code": "din", "flag": "🇸🇸", "name": "Dinka"}, {"code": "dz", "flag": "🇧🇹", "name": "Dzongkha"}, {"code": "fo", "flag": "🇫🇴", "name": "Faroese"}, {"code": "fj", "flag": "🇫🇯", "name": "Fijian"}, {"code": "fur", "flag": "🇮🇹", "name": "Friulian"}, {"code": "gaa", "flag": "🇬🇭", "name": "Ga"}, {"code": "kl", "flag": "🇬🇱", "name": "Greenlandic"}, {"code": "hil", "flag": "🇵🇭", "name": "Hiligaynon"}, {"code": "iba", "flag": "🇲🇾", "name": "Iban"}, {"code": "io", "flag": "🌍", "name": "Ido"}, {"code": "iu", "flag": "🇨🇦", "name": "Inuktitut"}, {"code": "kab", "flag": "🇩🇿", "name": "Kabyle"}, {"code": "kea", "flag": "🇨🇻", "name": "Kabuverdianu"}, {"code": "kg", "flag": "🇨🇩", "name": "Kongo"}];
const LANGUAGE_PAGE_SIZE=10;
const languageSelection=new Map();

function languageLabel(code){
 const l=PREMIUM_LANGUAGES.find(x=>x.code===code);
 return l?`${l.flag} ${l.name}`:`🌐 ${code}`;
}
async function isLanguageAdmin(ctx){
 if(isAdmin(ctx))return true;
 if(!isGroup(ctx))return false;
 try{
  const m=await ctx.telegram.getChatMember(ctx.chat.id,ctx.from.id);
  return ['creator','administrator'].includes(m.status);
 }catch{return false}
}
function languageMenuKeyboard(step,page=0,first=''){
 const total=Math.ceil(PREMIUM_LANGUAGES.length/LANGUAGE_PAGE_SIZE);
 page=Math.max(0,Math.min(Number(page)||0,total-1));
 const start=page*LANGUAGE_PAGE_SIZE;
 const list=PREMIUM_LANGUAGES.slice(start,start+LANGUAGE_PAGE_SIZE);
 const rows=[];
 for(let i=0;i<list.length;i+=2){
  rows.push(list.slice(i,i+2).map(l=>Markup.button.callback(`${l.flag} ${l.name}`, `lng:${step}:${page}:${l.code}`)));
 }
 const nav=[];
 if(page>0)nav.push(Markup.button.callback('⬅️ Previous',`lngpage:${step}:${page-1}`));
 nav.push(Markup.button.callback(`${page+1}/${total}`,'lngnoop'));
 if(page<total-1)nav.push(Markup.button.callback('Next ➡️',`lngpage:${step}:${page+1}`));
 rows.push(nav);
 rows.push([Markup.button.callback('❌ Cancel','lngcancel')]);
 return Markup.inlineKeyboard(rows);
}
async function showLanguageStep(ctx,step,page=0,edit=false){
 const key=`${ctx.chat.id}:${ctx.from.id}`;
 const state=languageSelection.get(key)||{first:''};
 const title=step===1
  ?`🌐 <b>Select Language 1</b>\n\nChoose the first language from all 159 languages.`
  :`✅ Language 1: <b>${languageLabel(state.first)}</b>\n\n🌐 <b>Select Language 2</b>\n\nChoose the second language from all 159 languages.`;
 const extra={parse_mode:'HTML',...languageMenuKeyboard(step,page,state.first)};
 if(edit&&ctx.callbackQuery?.message)return ctx.editMessageText(title,extra);
 return ctx.reply(title,extra);
}

bot.command(['language','languages','setlanguage'],async ctx=>{
 if(!isGroup(ctx))return ctx.reply('Please use this command inside a Telegram group.');
 if(!(await isLanguageAdmin(ctx)))return ctx.reply('⛔ Only the group owner or administrators can change languages.');
 languageSelection.set(`${ctx.chat.id}:${ctx.from.id}`,{first:''});
 await showLanguageStep(ctx,1,0,false);
});
bot.action(/^lngpage:(1|2):(\d+)$/,async ctx=>{
 if(!(await isLanguageAdmin(ctx)))return ctx.answerCbQuery('Admin only',{show_alert:true});
 await ctx.answerCbQuery();
 await showLanguageStep(ctx,Number(ctx.match[1]),Number(ctx.match[2]),true);
});
bot.action(/^lng:(1|2):(\d+):(.+)$/,async ctx=>{
 if(!(await isLanguageAdmin(ctx)))return ctx.answerCbQuery('Admin only',{show_alert:true});
 const step=Number(ctx.match[1]),code=ctx.match[3];
 const lang=PREMIUM_LANGUAGES.find(x=>x.code===code);
 if(!lang)return ctx.answerCbQuery('Language not found',{show_alert:true});
 const key=`${ctx.chat.id}:${ctx.from.id}`;
 const state=languageSelection.get(key)||{first:''};
 if(step===1){
   state.first=code;languageSelection.set(key,state);
   await ctx.answerCbQuery(`${lang.flag} ${lang.name} selected`);
   return showLanguageStep(ctx,2,0,true);
 }
 if(!state.first)return ctx.answerCbQuery('Please select Language 1 first',{show_alert:true});
 if(state.first===code)return ctx.answerCbQuery('Please choose a different second language',{show_alert:true});
 data.translationPairs[String(ctx.chat.id)]={a:state.first,b:code};
 saveData();languageSelection.delete(key);
 await ctx.answerCbQuery('Translation languages saved');
 return ctx.editMessageText(
  `✅ <b>Auto Translation Updated</b>\n\n${languageLabel(state.first)} ⇄ ${languageLabel(code)}\n\n🟢 Translation enabled\n👑 Updated by group admin`,
  {parse_mode:'HTML',...Markup.inlineKeyboard([
   [Markup.button.callback('🔄 Change Languages','lngrestart')],
   [Markup.button.callback('🔴 Turn Translation Off','lngoff')]
  ])}
 );
});
bot.action('lngrestart',async ctx=>{
 if(!(await isLanguageAdmin(ctx)))return ctx.answerCbQuery('Admin only',{show_alert:true});
 languageSelection.set(`${ctx.chat.id}:${ctx.from.id}`,{first:''});
 await ctx.answerCbQuery();
 await showLanguageStep(ctx,1,0,true);
});
bot.action('lngoff',async ctx=>{
 if(!(await isLanguageAdmin(ctx)))return ctx.answerCbQuery('Admin only',{show_alert:true});
 delete data.translationPairs[String(ctx.chat.id)];saveData();
 await ctx.answerCbQuery('Translation disabled');
 await ctx.editMessageText('🔴 <b>Auto translation is disabled.</b>\n\nUse /languages to choose a new language pair.',{parse_mode:'HTML'});
});
bot.action('lngnoop',ctx=>ctx.answerCbQuery());
bot.action('lngcancel',async ctx=>{await ctx.answerCbQuery('Cancelled');await ctx.deleteMessage().catch(()=>{})});

bot.command('translation_off',ctx=>{if(!isAdmin(ctx)||!isGroup(ctx))return;delete data.translationPairs[String(ctx.chat.id)];saveData();ctx.reply('✅ Translation disabled')});
bot.command('setprice',ctx=>{if(!isAdmin(ctx))return;const[,key,...v]=ctx.message.text.trim().split(/\s+/);if(!apartments[key]||!v.length)return ctx.reply('Use: /setprice studio50 $1,200/month');data.prices[key]=v.join(' ');saveData();ctx.reply('✅ Price updated')});
bot.command('setavailability',ctx=>{if(!isAdmin(ctx))return;const[,key,...v]=ctx.message.text.trim().split(/\s+/);if(!apartments[key]||!v.length)return ctx.reply('Use: /setavailability studio50 Available');data.availability[key]=v.join(' ');saveData();ctx.reply('✅ Availability updated')});
bot.action('main',async ctx=>{await ctx.answerCbQuery();await safeMainMenu(ctx)});bot.action('apartments',async ctx=>{await ctx.answerCbQuery();await ctx.reply('Choose an apartment:',apartmentKeyboard())});bot.action(/^apt:(.+)$/,async ctx=>{await ctx.answerCbQuery();await sendApartment(ctx,ctx.match[1])});
bot.action('book',async ctx=>{await ctx.answerCbQuery();if(PUBLIC_URL)return ctx.reply('Open booking form:',Markup.inlineKeyboard([[Markup.button.webApp('📅 Open Booking Form',`${PUBLIC_URL}/app#booking`)]]));ctx.reply(contactBlock())});
bot.action(/^book:(.+)$/,async ctx=>{await ctx.answerCbQuery();const key=ctx.match[1];if(PUBLIC_URL)return ctx.reply('Continue booking:',Markup.inlineKeyboard([[Markup.button.webApp('📅 Continue',`${PUBLIC_URL}/app?room=${key}#booking`)]]))});
bot.action('facilities',async ctx=>{await ctx.answerCbQuery();ctx.reply('🏊 Pool\n💪 Gym\n♨️ Steam & Sauna\n🧸 Kids Playground\n🚗 Parking\n📶 Wi-Fi\n🛡️ 24/7 Security\n🛎️ Reception')});
bot.action('contact',async ctx=>{await ctx.answerCbQuery();const rows=[[Markup.button.url('🌐 Website',WEBSITE)]];if(RECEPTION_TELEGRAM)rows.unshift([Markup.button.url('💬 Telegram Reception',RECEPTION_TELEGRAM)]);ctx.reply(`📞 ${RECEPTION_PHONE}`,Markup.inlineKeyboard(rows))});
bot.action('location',async ctx=>{await ctx.answerCbQuery();ctx.reply('📍 Maline Exclusive Serviced Apartments, Phnom Penh',GOOGLE_MAPS_URL?Markup.inlineKeyboard([[Markup.button.url('Open Google Maps',GOOGLE_MAPS_URL)]]):undefined)});
bot.action('language_help',async ctx=>{await ctx.answerCbQuery();ctx.reply('Mini App: English, Khmer and Chinese. Group translation: use /language en zh-CN')});
bot.action(/^inq:(contacted|completed|cancelled):(.+)$/,async ctx=>{if(!isAdmin(ctx))return ctx.answerCbQuery('Admin only',{show_alert:true});const[,status,id]=ctx.match;const q=data.inquiries.find(x=>x.id===id);if(!q)return ctx.answerCbQuery('Inquiry not found',{show_alert:true});q.status=status;q.updatedAt=new Date().toISOString();saveData();await ctx.answerCbQuery(`Marked ${status}`);ctx.editMessageText(`${ctx.callbackQuery.message.text}\n\nStatus: ${status.toUpperCase()}`)});
const welcomeCache=new Map();async function welcomeMember(ctx,m){if(!m||m.is_bot)return;const cid=String(ctx.chat.id);if(data.welcomeEnabled[cid]===false)return;const key=`${cid}:${m.id}`;if(Date.now()-(welcomeCache.get(key)||0)<120000)return;welcomeCache.set(key,Date.now());const rows=[];if(PUBLIC_URL)rows.push([Markup.button.webApp('🌸 Open Maline Mini App',`${PUBLIC_URL}/app`)]);if(RECEPTION_TELEGRAM)rows.push([Markup.button.url('💬 Contact Us',RECEPTION_TELEGRAM)]);await ctx.reply(`🌸 Welcome, ${m.first_name||'Guest'}!\n\nWelcome to Maline Exclusive Serviced Apartments.\n${contactBlock()}`,Markup.inlineKeyboard(rows));data.stats.welcomes++;saveData()}
bot.on('new_chat_members',async ctx=>{for(const m of ctx.message.new_chat_members||[])await welcomeMember(ctx,m)});
bot.on('chat_member',async ctx=>{const u=ctx.update.chat_member,o=u.old_chat_member?.status,n=u.new_chat_member?.status;if(['left','kicked'].includes(o)&&['member','administrator','creator','restricted'].includes(n))await welcomeMember(ctx,u.new_chat_member?.user)});
bot.on('text',async(ctx,next)=>{const text=ctx.message.text.trim();if(text.startsWith('/'))return next();if(isGroup(ctx)){const pair=data.translationPairs[String(ctx.chat.id)];if(pair&&!ctx.from.is_bot&&GOOGLE_TRANSLATE_API_KEY)try{const first=await translateText(text,pair.a);const d=String(first.detected||'').toLowerCase(),a=pair.a.toLowerCase().split('-')[0],b=pair.b.toLowerCase().split('-')[0];let out='';if(d.startsWith(a))out=(await translateText(text,pair.b,pair.a)).text;else if(d.startsWith(b))out=first.text;if(out&&out.toLowerCase()!==text.toLowerCase()){data.stats.translations++;saveData();return ctx.reply(`🌐 ${out}`,{reply_parameters:{message_id:ctx.message.message_id}})}}catch(e){console.error(e.message)}if(data.autoReplyEnabled[String(ctx.chat.id)]!==false&&!ctx.from.is_bot){const r=matchAutoReply(text);if(r){data.stats.autoReplies++;saveData();return ctx.reply(r,{reply_parameters:{message_id:ctx.message.message_id}})}}}return next()});
bot.catch(e=>console.error('Bot error:',e));

function sendJson(res,status,body){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*','Cache-Control':'no-store'});res.end(JSON.stringify(body))}
function readBody(req){return new Promise((resolve,reject)=>{let b='';req.on('data',c=>{b+=c;if(b.length>1e6)reject(new Error('Too large'))});req.on('end',()=>resolve(b));req.on('error',reject)})}
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{const requestPath=decodeURIComponent((req.url||'/').split('?')[0]);if(requestPath==='/'||requestPath==='/health'){res.writeHead(200,{'Content-Type':'text/plain'});return res.end('Maline Smart Assistant V3 is running')}if(requestPath==='/api/config')return sendJson(res,200,{phone:RECEPTION_PHONE,telegram:RECEPTION_TELEGRAM,website:WEBSITE,maps:GOOGLE_MAPS_URL,serviceIncluded:SERVICE_INCLUDED,serviceExcluded:SERVICE_EXCLUDED,apartments:Object.entries(apartments).map(([key,a])=>({key,...a,images:galleryFor(a.folder),price:data.prices[key]||'Contact us for price',availability:data.availability[key]||'Contact reception'}))});if(requestPath==='/api/open'&&req.method==='POST'){data.stats.miniAppOpens++;saveData();return sendJson(res,200,{success:true})}if(requestPath==='/api/inquiry'&&req.method==='POST')try{const b=JSON.parse(await readBody(req));for(const f of['name','phone','apartment','checkIn','stay'])if(!String(b[f]||'').trim())return sendJson(res,400,{success:false,message:'Please complete all required fields.'});const q={id:crypto.randomBytes(4).toString('hex').toUpperCase(),...b,status:'new',createdAt:new Date().toISOString()};data.inquiries.unshift(q);data.inquiries=data.inquiries.slice(0,500);data.stats.inquiries++;saveData();await sendInquiryToStaff(q);return sendJson(res,200,{success:true,inquiryId:q.id})}catch(e){return sendJson(res,500,{success:false,message:'Unable to send inquiry.'})}if(requestPath==='/app'||requestPath==='/app/')return fs.createReadStream(path.join(__dirname,'web','index.html')).pipe((res.writeHead(200,{'Content-Type':MIME['.html'],'Cache-Control':'no-cache'}),res));if(requestPath.startsWith('/web/')){const rel=path.normalize(requestPath.replace(/^\/web\//,'')).replace(/^(\.\.(\/|\\|$))+/,'');const base=path.join(__dirname,'web'),f=path.join(base,rel);if(!f.startsWith(base)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':MIME[path.extname(f).toLowerCase()]||'application/octet-stream'});return fs.createReadStream(f).pipe(res)}res.writeHead(404);res.end('Not found')});
server.listen(PORT,'0.0.0.0',()=>console.log(`✅ Web server on ${PORT}`));bot.launch({allowedUpdates:['message','callback_query','chat_member','my_chat_member']}).then(()=>console.log('✅ Bot V3 running')).catch(console.error);
process.once('SIGINT',()=>{bot.stop('SIGINT');server.close()});process.once('SIGTERM',()=>{bot.stop('SIGTERM');server.close()});
