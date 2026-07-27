const tg=window.Telegram?.WebApp;
if(tg){tg.ready();tg.expand();try{tg.setHeaderColor('#d92f85');tg.setBackgroundColor('#fff8fb')}catch{}}
let rooms=[],active=null,index=0;
const category=k=>k.startsWith('studio')?'studio':k.startsWith('one')?'one':k.startsWith('two')?'two':k.startsWith('three')?'three':'penthouse';
function fallback(img){img.addEventListener('error',()=>{img.src='/web/images/building.jpg'},{once:true})}
function render(filter='all'){
 const box=document.getElementById('rooms');box.innerHTML='';
 rooms.filter(r=>filter==='all'||category(r.key)===filter).forEach(r=>{
  const el=document.createElement('article');el.className='room';
  el.innerHTML=`<img src="${r.images[0]}" alt="${r.title}"><div class="room-body"><h3>${r.title}</h3><div class="room-meta"><span>${r.size}</span><span>${r.availability}</span></div><p>${r.price}</p><button type="button">View Gallery</button></div>`;
  fallback(el.querySelector('img'));el.querySelector('button').addEventListener('click',()=>openRoom(r));box.appendChild(el);
 });
}
function openRoom(r){active=r;index=0;document.getElementById('modalTitle').textContent=r.title;document.getElementById('modalMeta').textContent=`${r.size} • ${r.price} • ${r.availability}`;show();document.getElementById('modal').hidden=false}
function show(){const img=document.getElementById('galleryImg');img.src=active.images[index];fallback(img);document.getElementById('counter').textContent=`${index+1} / ${active.images.length}`}
function move(d){index=(index+d+active.images.length)%active.images.length;show()}
async function init(){
 try{
  const c=await (await fetch('/api/config')).json();rooms=c.apartments||[];
  document.getElementById('included').innerHTML=(c.serviceIncluded||[]).map(x=>`<li>${x}</li>`).join('');
  document.getElementById('excluded').innerHTML=(c.serviceExcluded||[]).map(x=>`<li>${x}</li>`).join('');
  const s=document.getElementById('roomSelect');rooms.forEach(r=>s.insertAdjacentHTML('beforeend',`<option>${r.title} • ${r.size}</option>`));
  render();const key=new URLSearchParams(location.search).get('room');const found=rooms.find(r=>r.key===key);if(found)openRoom(found);
  fetch('/api/open',{method:'POST'}).catch(()=>{});
 }catch(e){document.getElementById('rooms').innerHTML='<p>Unable to load apartments.</p>'}
 setTimeout(()=>document.getElementById('splash').classList.add('hide'),700);
}
document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.filter)}));
document.getElementById('prev').addEventListener('click',()=>move(-1));document.getElementById('next').addEventListener('click',()=>move(1));
document.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',()=>document.getElementById('modal').hidden=true));
document.getElementById('choose').addEventListener('click',()=>{document.getElementById('roomSelect').value=`${active.title} • ${active.size}`;document.getElementById('modal').hidden=true;document.getElementById('booking').scrollIntoView({behavior:'smooth'})});
document.getElementById('form').addEventListener('submit',async e=>{e.preventDefault();const status=document.getElementById('status');status.textContent='Sending...';try{const r=await fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(e.currentTarget)))});const j=await r.json();if(!r.ok)throw new Error(j.message);status.textContent=`✅ Inquiry sent. ID: ${j.inquiryId}`;e.currentTarget.reset();tg?.HapticFeedback?.notificationOccurred('success')}catch(err){status.textContent=`❌ ${err.message||'Unable to send inquiry'}`}});
document.getElementById('lang').addEventListener('click',()=>alert('V3 interface supports English. Khmer and Chinese labels can be added in app.js.'));
init();
