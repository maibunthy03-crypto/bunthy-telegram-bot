const tg=window.Telegram?.WebApp;
if(tg){tg.ready();tg.expand();tg.setHeaderColor('#d92f85');tg.setBackgroundColor('#fff8fb')}

const translations={
 en:{eyebrow:'EXCLUSIVE SERVICED APARTMENTS',heroTitle:'Luxury Living<br>in Phnom Penh',heroText:'Spacious homes, premium facilities and attentive service in the heart of the city.',explore:'Explore Apartments',bookViewing:'Book a Viewing',scroll:'Scroll to discover',sizes:'sqm residences',security:'Security & reception',languages:'App languages',residences:'OUR RESIDENCES',chooseApartment:'Choose your apartment',galleryNote:'Open any room to view its photo gallery, price and availability.',premiumComfort:'PREMIUM COMFORT',privateHome:'Your private home above the city',showcaseText:'Enjoy generous living space, thoughtful service and convenient access to central Phnom Penh.',propertyDetail:'PROPERTY DETAIL',serviceIncluded:'Service Included',pleaseNote:'PLEASE NOTE',serviceExcluded:'Service Excluded',lifestyle:'LIFESTYLE',facilitiesTitle:'Premium facilities',facilitiesText:'Everything you need for wellness, relaxation and family living.',schedule:'SCHEDULE A VIEWING',sendInquiry:'Send your inquiry',staffReceive:'Our staff group will receive your request immediately.',fullName:'Full name *',phone:'Phone number *',apartment:'Apartment *',checkIn:'Check-in date *',stay:'Length of stay *',budget:'Monthly budget',request:'Special request',submit:'Send Inquiry',contactTitle:'Schedule your private viewing'},
 km:{eyebrow:'អាផាតមិនសេវាកម្មប្រណីត',heroTitle:'ការរស់នៅប្រណីត<br>នៅភ្នំពេញ',heroText:'លំនៅដ្ឋានធំទូលាយ បរិក្ខារល្អ និងសេវាកម្មយកចិត្តទុកដាក់នៅកណ្តាលទីក្រុង។',explore:'មើលអាផាតមិន',bookViewing:'កក់ពេលមើលបន្ទប់',scroll:'អូសចុះដើម្បីមើល',sizes:'ទំហំអាផាតមិន',security:'សន្តិសុខ និងទទួលភ្ញៀវ',languages:'ភាសាកម្មវិធី',residences:'លំនៅដ្ឋានរបស់យើង',chooseApartment:'ជ្រើសរើសអាផាតមិន',galleryNote:'បើកបន្ទប់ណាមួយដើម្បីមើលរូបភាព តម្លៃ និងបន្ទប់ទំនេរ។',premiumComfort:'ផាសុកភាពប្រណីត',privateHome:'ផ្ទះឯកជនរបស់អ្នកលើទីក្រុង',showcaseText:'ទទួលបានទីធ្លាធំទូលាយ សេវាកម្មយកចិត្តទុកដាក់ និងទីតាំងងាយស្រួល។',propertyDetail:'ព័ត៌មានអចលនទ្រព្យ',serviceIncluded:'សេវាកម្មរួមបញ្ចូល',pleaseNote:'សូមចំណាំ',serviceExcluded:'សេវាកម្មមិនរួមបញ្ចូល',lifestyle:'របៀបរស់នៅ',facilitiesTitle:'បរិក្ខារប្រណីត',facilitiesText:'អ្វីៗគ្រប់យ៉ាងសម្រាប់សុខភាព ការសម្រាក និងគ្រួសារ។',schedule:'កក់ពេលមើលបន្ទប់',sendInquiry:'ផ្ញើសំណើរបស់អ្នក',staffReceive:'ក្រុមការងារនឹងទទួលសំណើរបស់អ្នកភ្លាមៗ។',fullName:'ឈ្មោះពេញ *',phone:'លេខទូរស័ព្ទ *',apartment:'ប្រភេទអាផាតមិន *',checkIn:'ថ្ងៃចូលស្នាក់នៅ *',stay:'រយៈពេលស្នាក់នៅ *',budget:'ថវិកាប្រចាំខែ',request:'សំណើពិសេស',submit:'ផ្ញើសំណើ',contactTitle:'កក់ពេលមើលបន្ទប់ឯកជន'},
 zh:{eyebrow:'豪华服务式公寓',heroTitle:'金边<br>奢华生活',heroText:'位于市中心的宽敞住宅、优质设施和贴心服务。',explore:'浏览公寓',bookViewing:'预约看房',scroll:'向下滑动探索',sizes:'公寓面积',security:'安保与前台',languages:'应用语言',residences:'我们的住宅',chooseApartment:'选择您的公寓',galleryNote:'打开任意房型查看图片、价格和房源情况。',premiumComfort:'高品质舒适',privateHome:'城市之上的私人住宅',showcaseText:'享受宽敞空间、贴心服务和便捷的市中心位置。',propertyDetail:'房源详情',serviceIncluded:'包含服务',pleaseNote:'请注意',serviceExcluded:'不包含服务',lifestyle:'生活方式',facilitiesTitle:'优质设施',facilitiesText:'满足健康、休闲和家庭生活的一切需求。',schedule:'预约看房',sendInquiry:'发送咨询',staffReceive:'工作人员将立即收到您的请求。',fullName:'姓名 *',phone:'电话号码 *',apartment:'公寓类型 *',checkIn:'入住日期 *',stay:'入住时长 *',budget:'每月预算',request:'特别要求',submit:'发送咨询',contactTitle:'预约私人看房'}
};
let currentLang='en',rooms=[],active=null,index=0,touchStartX=0;

const roomCategory=key=>key.startsWith('studio')?'studio':key.startsWith('one')?'one':key.startsWith('two')?'two':'penthouse';

function applyLanguage(){
 const t=translations[currentLang];
 document.documentElement.lang=currentLang;
 document.querySelectorAll('[data-i18n]').forEach(el=>{const value=t[el.dataset.i18n];if(value!==undefined)el.innerHTML=value});
 document.querySelector('#langBtn span').textContent=currentLang.toUpperCase();
}

function imageFallback(img){
 img.addEventListener('error',()=>{
   img.onerror=null;
   img.src='/web/images/building.jpg';
 });
}

function renderRooms(filter='all'){
 const grid=document.getElementById('rooms');
 grid.innerHTML='';
 rooms.filter(r=>filter==='all'||roomCategory(r.key)===filter).forEach((r,position)=>{
   const card=document.createElement('article');
   card.className='room reveal';
   card.style.transitionDelay=`${Math.min(position*55,260)}ms`;
   card.innerHTML=`<div class="room-media">
     <img src="${r.images[0]}" alt="${r.title}">
     <span class="room-chip">${r.size}</span>
     <span class="photo-count"><svg viewBox="0 0 24 24"><path d="M4 5h16v14H4zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-4 6 5-4 4 3 3-2 4 3"/></svg>${r.images.length} photos</span>
   </div><div class="room-body"><h3>${r.title}</h3><div class="room-meta"><span>${r.price}</span><span>${r.availability}</span></div>
   <button class="room-view" type="button"><svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/></svg>View Gallery</button></div>`;
   imageFallback(card.querySelector('img'));
   card.querySelector('button').addEventListener('click',()=>openRoom(r));
   grid.appendChild(card);
 });
 observeReveals();
}

function populateSelect(){
 const select=document.getElementById('roomSelect');
 rooms.forEach(r=>select.insertAdjacentHTML('beforeend',`<option>${r.title} • ${r.size}</option>`));
}

function openRoom(room){
 active=room;index=0;
 document.getElementById('modalTitle').textContent=room.title;
 document.getElementById('modalSize').textContent=room.size;
 document.getElementById('modalMeta').textContent=`${room.price} • ${room.availability}`;
 renderGallery();
 document.getElementById('modal').hidden=false;
 document.body.style.overflow='hidden';
}

function renderGallery(){
 const img=document.getElementById('galleryImg');
 img.src=active.images[index];img.alt=`${active.title} photo ${index+1}`;
 imageFallback(img);
 document.getElementById('counter').textContent=`${index+1} / ${active.images.length}`;
 document.getElementById('dots').innerHTML=active.images.map((_,i)=>`<i class="${i===index?'active':''}"></i>`).join('');
}

function moveGallery(direction){
 index=(index+direction+active.images.length)%active.images.length;
 renderGallery();
 tg?.HapticFeedback?.selectionChanged();
}

function closeModal(){
 document.getElementById('modal').hidden=true;
 document.body.style.overflow='';
}

async function init(){
 try{
   const response=await fetch('/api/config');
   const config=await response.json();
   rooms=config.apartments||[];
   document.getElementById('included').innerHTML=(config.serviceIncluded||[]).map(x=>`<li>${x}</li>`).join('');
   document.getElementById('excluded').innerHTML=(config.serviceExcluded||[]).map(x=>`<li>${x}</li>`).join('');
   renderRooms();populateSelect();
   const key=new URLSearchParams(location.search).get('room');
   const requested=rooms.find(r=>r.key===key);
   if(requested)openRoom(requested);
 }catch(error){
   document.getElementById('rooms').innerHTML='<p>Unable to load apartments. Please try again.</p>';
 }
 setTimeout(()=>document.getElementById('splash').classList.add('hide'),900);
}

document.getElementById('langBtn').addEventListener('click',()=>{
 currentLang=currentLang==='en'?'km':currentLang==='km'?'zh':'en';
 applyLanguage();tg?.HapticFeedback?.selectionChanged();
});

document.querySelectorAll('.room-filters button').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('.room-filters button').forEach(x=>x.classList.remove('active'));
 button.classList.add('active');renderRooms(button.dataset.filter);
}));

document.getElementById('prev').addEventListener('click',()=>moveGallery(-1));
document.getElementById('next').addEventListener('click',()=>moveGallery(1));
document.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',closeModal));
document.getElementById('choose').addEventListener('click',()=>{
 document.getElementById('roomSelect').value=`${active.title} • ${active.size}`;
 closeModal();document.getElementById('booking').scrollIntoView({behavior:'smooth'});
});

const gallery=document.getElementById('gallery');
gallery.addEventListener('touchstart',e=>touchStartX=e.changedTouches[0].clientX,{passive:true});
gallery.addEventListener('touchend',e=>{
 const distance=e.changedTouches[0].clientX-touchStartX;
 if(Math.abs(distance)>45)moveGallery(distance>0?-1:1);
},{passive:true});

document.getElementById('form').addEventListener('submit',async e=>{
 e.preventDefault();
 const button=e.currentTarget.querySelector('.submit-btn');
 const loader=button.querySelector('.loader');
 const status=document.getElementById('status');
 button.disabled=true;loader.hidden=false;status.textContent='Sending...';
 try{
   const response=await fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(e.currentTarget)))});
   const result=await response.json();
   if(!response.ok)throw new Error(result.message||'Unable to send inquiry');
   status.textContent=`✅ Inquiry sent successfully. ID: ${result.inquiryId}`;
   e.currentTarget.reset();tg?.HapticFeedback?.notificationOccurred('success');
 }catch(error){
   status.textContent=`❌ ${error.message}`;tg?.HapticFeedback?.notificationOccurred('error');
 }finally{button.disabled=false;loader.hidden=true}
});

function observeReveals(){
 const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})
 },{threshold:.12});
 document.querySelectorAll('.reveal:not(.visible)').forEach(el=>observer.observe(el));
}

const sections=['home','apartments','facilities','booking'];
const navLinks=[...document.querySelectorAll('.bottom-nav a')];
const navObserver=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{
   if(entry.isIntersecting){
     navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${entry.target.id}`));
   }
 });
},{threshold:.45});
sections.forEach(id=>{const el=document.getElementById(id);if(el)navObserver.observe(el)});

applyLanguage();observeReveals();init();fetch('/api/open',{method:'POST'}).catch(()=>{});
