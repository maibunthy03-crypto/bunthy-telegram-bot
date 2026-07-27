const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.setHeaderColor('#8f1653');
}

const statusBox = document.getElementById('status');
const roomGrid = document.getElementById('rooms');
const included = document.getElementById('included');
const excluded = document.getElementById('excluded');
const apartmentSelect = document.getElementById('apartmentSelect');
const form = document.getElementById('bookingForm');
const formResult = document.getElementById('formResult');
const contactLinks = document.getElementById('contactLinks');

function roomCard(room) {
  const image = room.images?.[0]
    ? `<img class="room-photo" src="${room.images[0]}" alt="${room.title}">`
    : `<div class="room-placeholder">🏨</div>`;
  return `<article class="room-card" id="room-${room.key}">
    ${image}
    <div class="room-body">
      <h3 class="room-title">${room.title}</h3>
      <p class="room-size">${room.size}</p>
      <p class="price">${room.price}</p>
      <span class="availability">${room.availability}</span>
      <div class="room-actions">
        <button class="secondary-button book-room" type="button" data-room="${room.key}">Book viewing</button>
      </div>
    </div>
  </article>`;
}

async function loadConfig() {
  try {
    const response = await fetch('/api/config', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Server returned ${response.status}`);
    const config = await response.json();
    roomGrid.innerHTML = config.apartments.map(roomCard).join('');
    apartmentSelect.innerHTML = '<option value="">Select an apartment</option>' + config.apartments
      .map(room => `<option value="${room.key}">${room.title} — ${room.size}</option>`).join('');
    included.innerHTML = config.serviceIncluded.map(item => `<span class="chip">✓ ${item}</span>`).join('');
    excluded.innerHTML = config.serviceExcluded.map(item => `<span class="chip">• ${item}</span>`).join('');
    const links = [];
    if (config.phone) links.push(`<a href="tel:${config.phone.replace(/\s/g,'')}">${config.phone}</a>`);
    if (config.telegram) links.push(`<a href="${config.telegram}" target="_blank">Telegram</a>`);
    if (config.website) links.push(`<a href="${config.website}" target="_blank">Website</a>`);
    contactLinks.innerHTML = links.join(' · ');
    statusBox.textContent = 'Current price and availability loaded successfully.';

    document.querySelectorAll('.book-room').forEach(button => {
      button.addEventListener('click', () => {
        apartmentSelect.value = button.dataset.room;
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
      });
    });

    const queryRoom = new URLSearchParams(location.search).get('room');
    if (queryRoom && config.apartments.some(room => room.key === queryRoom)) {
      apartmentSelect.value = queryRoom;
    }

    fetch('/api/open', { method: 'POST' }).catch(() => {});
  } catch (error) {
    statusBox.textContent = `Unable to load Mini App data: ${error.message}`;
    statusBox.style.color = '#a00035';
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  formResult.textContent = 'Sending inquiry…';
  const payload = Object.fromEntries(new FormData(form).entries());
  try {
    const response = await fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || 'Unable to send inquiry');
    formResult.textContent = `✅ Inquiry sent successfully. Reference: ${result.inquiryId}`;
    form.reset();
    tg?.HapticFeedback?.notificationOccurred('success');
  } catch (error) {
    formResult.textContent = `❌ ${error.message}`;
    tg?.HapticFeedback?.notificationOccurred('error');
  }
});

loadConfig();
