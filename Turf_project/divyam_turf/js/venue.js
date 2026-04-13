// venue.js — Venue detail page logic

function getStars(r) {
  return '★'.repeat(Math.floor(r)) + (r%1>=0.5?'½':'') + '☆'.repeat(5-Math.floor(r)-(r%1>=0.5?1:0));
}

const AMENITY_ICONS = {
  'Changing Room': '🚿',
  'Floodlights': '💡',
  'Parking': '🅿️',
  'Drinking Water': '🚰',
  'Equipment': '👟',
  'Canteen': '☕'
};

window.initVenuePage = function() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const venue = window.VENUES.find(v => v.id === id);

  if (!venue) {
    document.getElementById('venue-content').innerHTML = `
      <div style="text-align:center;padding:80px 20px">
        <div style="font-size:60px">🏟️</div>
        <h2 style="font-family:var(--font-display);margin:16px 0 8px">Venue not found</h2>
        <p style="color:var(--text-muted)">The venue you're looking for doesn't exist.</p>
        <a href="index.html" class="btn btn-primary" style="margin-top:24px;display:inline-flex">← Back to listings</a>
      </div>`;
    return;
  }

  // Breadcrumb
  document.getElementById('bc-venue').textContent = venue.name;
  document.title = `${venue.name} — Divyam Turf`;

  // Gallery
  const mainImg = document.getElementById('gallery-main-img');
  mainImg.src = venue.gallery[0];
  mainImg.alt = venue.name;
  const thumbsEl = document.getElementById('gallery-thumbs');
  thumbsEl.innerHTML = venue.gallery.slice(0,3).map((img, i) =>
    `<div class="gallery-thumb ${i===0?'active':''}" data-img="${img}" onclick="switchImg(this,'${img}')">
      <img src="${img}" alt="Gallery ${i+1}" loading="lazy">
    </div>`
  ).join('');

  // Header
  document.getElementById('venue-name').textContent = venue.name;
  document.getElementById('venue-rating').innerHTML = `
    <span class="stars">${getStars(venue.rating)}</span>
    <span class="score">${venue.rating}</span>
    <span class="reviews">${venue.reviews} reviews</span>`;
  document.getElementById('venue-address').innerHTML = `📍 ${venue.location}`;
  document.getElementById('venue-sport-tags').innerHTML = venue.sports.map((s,i) =>
    `<span class="venue-sport-tag">${venue.sportEmojis[i]} ${s}</span>`).join('');

  // About
  document.getElementById('venue-about').textContent = venue.about;

  // Amenities
  document.getElementById('venue-amenities').innerHTML = venue.amenities.map(a =>
    `<div class="amenity-item"><span class="amenity-icon">${AMENITY_ICONS[a]||'✅'}</span>${a}</div>`).join('');

  // Rules
  document.getElementById('venue-rules').innerHTML = venue.rules.map(r => `<li>${r}</li>`).join('');

  // Booking widget
  document.getElementById('widget-rate').innerHTML = `₹${venue.ratePerHour.toLocaleString()} <span>/ hour</span>`;

  // Date default to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('booking-date').value = today;
  document.getElementById('booking-date').min = today;

  // Slots
  renderSlots(venue);
};

window.switchImg = function(el, src) {
  document.getElementById('gallery-main-img').src = src;
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
};

function renderSlots(venue) {
  const grid = document.getElementById('slots-grid');
  grid.innerHTML = venue.slots.map(s => `
    <button class="slot-btn ${s.available ? 'available' : 'booked'}"
      data-time="${s.time}" data-available="${s.available}"
      onclick="${s.available ? 'toggleSlot(this)' : ''}"
      ${!s.available ? 'disabled title="Already booked"' : ''}>
      ${s.time}
    </button>`).join('');
  updatePriceSummary(venue);
}

window.toggleSlot = function(btn) {
  if (btn.dataset.available !== 'true') return;
  btn.classList.toggle('selected');
  const id = parseInt(new URLSearchParams(window.location.search).get('id'));
  const venue = window.VENUES.find(v => v.id === id);
  updatePriceSummary(venue);
};

function getSelectedSlots() {
  return Array.from(document.querySelectorAll('.slot-btn.selected')).map(b => b.dataset.time);
}

function updatePriceSummary(venue) {
  const dur = parseFloat(document.querySelector('.dur-btn.active')?.dataset.dur || '1');
  const slots = getSelectedSlots();
  const count = slots.length;
  const total = count * dur * venue.ratePerHour;

  document.getElementById('summary-slots').textContent = count > 0
    ? `${count} slot(s) × ${dur}hr`
    : '—';
  document.getElementById('summary-duration').textContent = count > 0 ? `${(count * dur).toFixed(1)} hrs` : '—';
  document.getElementById('summary-total').textContent = count > 0 ? `₹${total.toLocaleString()}` : '₹0';
}

window.setDuration = function(btn, dur) {
  document.querySelectorAll('.dur-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const id = parseInt(new URLSearchParams(window.location.search).get('id'));
  const venue = window.VENUES.find(v => v.id === id);
  updatePriceSummary(venue);
};

window.proceedBooking = function() {
  const slots = getSelectedSlots();
  if (slots.length === 0) {
    alert('Please select at least one time slot!');
    return;
  }
  const id = parseInt(new URLSearchParams(window.location.search).get('id'));
  const venue = window.VENUES.find(v => v.id === id);
  const dur = parseFloat(document.querySelector('.dur-btn.active')?.dataset.dur || '1');
  const date = document.getElementById('booking-date').value;
  const total = slots.length * dur * venue.ratePerHour;
  const bookingId = 'DT-' + Date.now().toString().slice(-6);

  localStorage.setItem('divyam_booking', JSON.stringify({
    bookingId, venueName: venue.name, location: venue.location,
    date, slots, duration: dur * slots.length, total, ratePerHour: venue.ratePerHour
  }));
  window.location.href = 'booking-confirm.html';
};

window.callVenue = function() {
  alert('📞 Calling venue...\n+91 98765 43210\n\nIn a real app, this would initiate a call.');
};