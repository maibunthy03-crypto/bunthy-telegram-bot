const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor('#d63384');
  tg.setBackgroundColor('#fff9fc');
}

const translations = {
  en: {
    eyebrow:'Exclusive Serviced Apartments',heroTitle:'Luxury Living in Phnom Penh',heroText:'Spacious homes, premium facilities and attentive service in the heart of the city.',explore:'Explore Apartments',book:'Book a Viewing',scroll:'Scroll to discover',sqmRange:'sqm apartment range',security:'Security & reception',languages:'App languages',residences:'Our Residences',findHome:'Find your ideal home',priceNote:'Contact us for the latest price and availability.',all:'All',premium:'Premium comfort',cityHome:'Your private home above the city',lifestyle:'Lifestyle',facilitiesTitle:'Facilities for everyday wellbeing',poolText:'Relax with a beautiful city view.',gymText:'Modern equipment for your daily workout.',saunaText:'Unwind and recharge after a busy day.',receptionText:'Friendly support and 24-hour security.',inquiry:'Inquiry',bookViewing:'Book a viewing',staffReply:'Our staff group will receive your request immediately.',fullName:'Full name *',phone:'Phone number *',apartmentType:'Apartment type *',checkIn:'Check-in date *',stay:'Length of stay *',budget:'Monthly budget',message:'Message',sendInquiry:'Send Inquiry',contactTitle:'Ready to visit Maline?',bookNow:'Book Now',bookThis:'Book this apartment'
  },
  km: {
    eyebrow:'អាផាតមិនសេវាកម្មប្រណីត',heroTitle:'ការរស់នៅប្រណីតនៅភ្នំពេញ',heroText:'បន្ទប់ធំទូលាយ បរិក្ខារល្អ និងសេវាកម្មយកចិត្តទុកដាក់នៅកណ្តាលទីក្រុង។',explore:'មើលអាផាតមិន',book:'កក់ពេលមើលបន្ទប់',scroll:'អូសចុះដើម្បីមើល',sqmRange:'ទំហំអាផាតមិន',security:'សន្តិសុខ និងទទួលភ្ញៀវ',languages:'ភាសាក្នុងកម្មវិធី',residences:'លំនៅដ្ឋានរបស់យើង',findHome:'ស្វែងរកផ្ទះសមរម្យ',priceNote:'សូមទាក់ទងសម្រាប់តម្លៃ និងបន្ទប់ទំនេរថ្មីបំផុត។',all:'ទាំងអស់',premium:'ផាសុកភាពប្រណីត',cityHome:'ផ្ទះឯកជនរបស់អ្នកលើទីក្រុង',lifestyle:'របៀបរស់នៅ',facilitiesTitle:'បរិក្ខារសម្រាប់សុខុមាលភាពប្រចាំថ្ងៃ',poolText:'សម្រាកជាមួយទេសភាពទីក្រុងដ៏ស្រស់ស្អាត។',gymText:'ឧបករណ៍ទំនើបសម្រាប់ហាត់ប្រាណ។',saunaText:'សម្រាក និងបង្កើនថាមពលឡើងវិញ។',receptionText:'សេវាកម្មរួសរាយ និងសន្តិសុខ 24 ម៉ោង។',inquiry:'សំណើ',bookViewing:'កក់ពេលមើលបន្ទប់',staffReply:'ក្រុមការងារនឹងទទួលសំណើរបស់អ្នកភ្លាមៗ។',fullName:'ឈ្មោះពេញ *',phone:'លេខទូរស័ព្ទ *',apartmentType:'ប្រភេទអាផាតមិន *',checkIn:'ថ្ងៃចូលស្នាក់នៅ *',stay:'រយៈពេលស្នាក់នៅ *',budget:'ថវិកាប្រចាំខែ',message:'សារ',sendInquiry:'ផ្ញើសំណើ',contactTitle:'ត្រៀមមកទស្សនា Maline?',bookNow:'កក់ឥឡូវ',bookThis:'កក់អាផាតមិននេះ'
  },
  zh: {
    eyebrow:'豪华服务式公寓',heroTitle:'金边奢华生活',heroText:'位于市中心的宽敞住宅、优质设施和贴心服务。',explore:'浏览公寓',book:'预约看房',scroll:'向下滑动探索',sqmRange:'公寓面积范围',security:'安保与前台',languages:'应用语言',residences:'我们的住宅',findHome:'找到理想的家',priceNote:'请联系我们获取最新价格和房源。',all:'全部',premium:'高品质舒适',cityHome:'城市之上的私人住宅',lifestyle:'生活方式',facilitiesTitle:'日常健康生活设施',poolText:'欣赏城市美景，轻松休息。',gymText:'现代化设备满足日常健身。',saunaText:'忙碌一天后放松身心。',receptionText:'友好的服务和24小时安保。',inquiry:'咨询',bookViewing:'预约看房',staffReply:'工作人员将立即收到您的申请。',fullName:'姓名 *',phone:'电话号码 *',apartmentType:'公寓类型 *',checkIn:'入住日期 *',stay:'入住时长 *',budget:'每月预算',message:'留言',sendInquiry:'发送咨询',contactTitle:'准备参观 Maline？',bookNow:'立即预约',bookThis:'预约此公寓'
  }
};

let currentLang = 'en';
let apartments = [];
let selectedRoom = null;

const fallbackApartments = [
  ['studio50','Studio Apartment','50 sqm','studio','/web/images/studio.jpg'],
  ['one84','1 Bedroom Apartment','84 sqm','one','/web/images/one-bedroom-84.jpg'],
  ['one91','1 Bedroom Apartment','91 sqm','one','/web/images/one-bedroom-91.jpg'],
  ['two130','2 Bedroom Apartment','130 sqm','two','/web/images/two-bedroom-130.jpg'],
  ['two138','2 Bedroom Apartment','138 sqm','two','/web/images/two-bedroom-138.jpg'],
  ['two148','2 Bedroom Apartment','148 sqm','two','/web/images/two-bedroom-148.jpg'],
  ['two150','2 Bedroom Apartment','150 sqm','two','/web/images/two-bedroom-150.jpg'],
  ['pha551','Penthouse A (PHA)','551 sqm','penthouse','/web/images/pha.jpg'],
  ['phb465','Penthouse B (PHB)','465 sqm','penthouse','/web/images/phb.jpg'],
  ['phc435','Penthouse C (PHC)','435 sqm','penthouse','/web/images/phc.jpg']
].map(([key,title,size,category,image])=>({key,title,size,category,image,price:'Contact us for price',availability:'Contact reception'}));

function categoryFor(key) {
  if (key.startsWith('studio')) return 'studio';
  if (key.startsWith('one')) return 'one';
  if (key.startsWith('two')) return 'two';
  return 'penthouse';
}

function applyLanguage() {
  const t = translations[currentLang];
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) el.textContent = t[key];
  });
  document.getElementById('langButton').textContent = currentLang.toUpperCase();
}

function renderApartments(filter='all') {
  const grid = document.getElementById('apartmentGrid');
  grid.innerHTML = '';
  apartments.filter(a => filter === 'all' || categoryFor(a.key) === filter).forEach((a,index) => {
    const card = document.createElement('article');
    card.className = 'room-card';
    card.style.transitionDelay = `${Math.min(index*60,300)}ms`;
    card.innerHTML = `
      <div class="room-image">
        <img src="${a.image}" alt="${a.title} ${a.size}" loading="lazy">
        <span class="room-badge">${a.size}</span>
      </div>
      <div class="room-body">
        <h3>${a.title}</h3>
        <div class="room-meta"><span>${a.price}</span><span>${a.availability}</span></div>
        <button type="button">View Details →</button>
      </div>`;
    card.querySelector('button').addEventListener('click',()=>openRoom(a));
    grid.appendChild(card);
  });
}

function populateSelect() {
  const select = document.getElementById('apartment');
  select.innerHTML = '<option value="">Select an apartment</option>';
  apartments.forEach(a => {
    const option = document.createElement('option');
    option.value = `${a.title} • ${a.size}`;
    option.textContent = `${a.title} • ${a.size}`;
    select.appendChild(option);
  });
}

function openRoom(a) {
  selectedRoom = a;
  document.getElementById('modalImage').src = a.image;
  document.getElementById('modalImage').alt = `${a.title} ${a.size}`;
  document.getElementById('modalSize').textContent = a.size;
  document.getElementById('modalTitle').textContent = a.title;
  document.getElementById('modalPrice').textContent = `💰 ${a.price}`;
  document.getElementById('modalAvailability').textContent = `🟢 ${a.availability}`;
  document.getElementById('roomModal').hidden = false;
  document.body.style.overflow='hidden';
}

function closeModal() {
  document.getElementById('roomModal').hidden = true;
  document.body.style.overflow='';
}

async function loadConfig() {
  try {
    const response = await fetch('/api/config');
    const config = await response.json();
    apartments = (config.apartments || []).map(a=>({...a,category:categoryFor(a.key)}));
    document.getElementById('phoneLink').href = `tel:${config.phone}`;
    document.getElementById('websiteLink').href = config.website;
    if (config.telegram) {
      document.getElementById('telegramLink').href = config.telegram;
      document.getElementById('telegramLink').hidden = false;
    }
    if (config.maps) {
      document.getElementById('mapsLink').href = config.maps;
      document.getElementById('mapsLink').hidden = false;
    }
  } catch {
    apartments = fallbackApartments;
  }
  renderApartments();
  populateSelect();

  const params = new URLSearchParams(location.search);
  const roomKey = params.get('room');
  if (roomKey) {
    const room = apartments.find(a=>a.key===roomKey);
    if (room) document.getElementById('apartment').value = `${room.title} • ${room.size}`;
  }
}

document.getElementById('langButton').addEventListener('click',()=>{
  currentLang = currentLang === 'en' ? 'km' : currentLang === 'km' ? 'zh' : 'en';
  applyLanguage();
});

document.querySelectorAll('.filter').forEach(button=>{
  button.addEventListener('click',()=>{
    document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
    button.classList.add('active');
    renderApartments(button.dataset.filter);
  });
});

document.getElementById('floatingBook').addEventListener('click',()=>{
  document.getElementById('booking').scrollIntoView({behavior:'smooth'});
});

document.querySelectorAll('[data-close-modal]').forEach(el=>el.addEventListener('click',closeModal));
document.querySelector('.modal-book').addEventListener('click',()=>{
  if (selectedRoom) document.getElementById('apartment').value = `${selectedRoom.title} • ${selectedRoom.size}`;
  closeModal();
  document.getElementById('booking').scrollIntoView({behavior:'smooth'});
});

document.getElementById('inquiryForm').addEventListener('submit',async event=>{
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('.submit-button');
  const spinner = form.querySelector('.spinner');
  const status = document.getElementById('formStatus');
  button.disabled = true;
  spinner.hidden = false;
  status.textContent = '';
  try {
    const payload = Object.fromEntries(new FormData(form).entries());
    const response = await fetch('/api/inquiry',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Unable to send.');
    status.textContent = `✅ Inquiry sent successfully. ID: ${result.inquiryId}`;
    form.reset();
    tg?.HapticFeedback?.notificationOccurred('success');
  } catch(error) {
    status.textContent = `❌ ${error.message}`;
    tg?.HapticFeedback?.notificationOccurred('error');
  } finally {
    button.disabled = false;
    spinner.hidden = true;
  }
});

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('img').forEach(img=>{
  img.addEventListener('error',()=>{
    img.style.background='linear-gradient(135deg,#f8dbe9,#fff)';
    img.alt += ' (photo placeholder)';
  });
});

applyLanguage();
loadConfig();
fetch('/api/open',{method:'POST'}).catch(()=>{});
