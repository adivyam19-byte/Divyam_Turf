// main.js — Homepage logic

function getStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function renderCard(v, delay = 0) {
  const discountBadge = v.discount ? `<span class="badge badge-discount">% ${v.discount}% OFF</span>` : '';
  const exclusiveBadge = v.exclusive ? `<span class="badge badge-exclusive">★ Exclusive</span>` : '';
  const sportTags = v.sports.slice(0, 2).map(s => `<span class="sport-tag">${v.sportEmojis[v.sports.indexOf(s)]} ${s}</span>`).join('');
  const extraSports = v.sports.length > 2 ? `<span class="sport-tag">+${v.sports.length-2}</span>` : '';

  return `
  <div class="venue-card" style="animation-delay:${delay}ms" onclick="window.location='venue.html?id=${v.id}'">
    <div class="card-img-wrap">
      <img src="${v.image}" alt="${v.name}" loading="lazy">
      <div class="card-badges">${discountBadge}${exclusiveBadge}</div>
      <button class="card-share" onclick="event.stopPropagation();navigator.share?navigator.share({title:'${v.name}',url:window.location.href}):alert('Link copied!')" title="Share">🔗</button>
    </div>
    <div class="card-body">
      <div class="card-title">${v.name}</div>
      <div class="card-location"><span>📍</span>${v.location}</div>
      <div class="card-rating">
        <div class="stars">${getStars(v.rating)}</div>
        <span class="rating-score">${v.rating}</span>
        <span class="rating-count">(${v.reviews} reviews)</span>
      </div>
      <div class="card-sports">${sportTags}${extraSports}</div>
      <div class="card-footer">
        <div class="card-price">₹${v.price.toLocaleString()} <span>/ hr onwards</span></div>
        <button class="card-book-btn" onclick="event.stopPropagation();window.location='venue.html?id=${v.id}'">Book Now →</button>
      </div>
    </div>
  </div>`;
}

function renderSkeletons(count = 6) {
  return Array.from({length: count}, () => `
  <div class="skeleton-card">
    <div class="skeleton skeleton-img"></div>
    <div class="skeleton-body">
      <div class="skeleton skeleton-line" style="width:80%"></div>
      <div class="skeleton skeleton-line" style="width:50%"></div>
      <div class="skeleton skeleton-line" style="width:65%"></div>
    </div>
  </div>`).join('');
}

function updateCount(count, filter) {
  const el = document.getElementById('results-count');
  if (el) el.innerHTML = `Showing <strong>${count}</strong> venue${count !== 1 ? 's' : ''} in Mumbai${filter !== 'All' ? ` · ${filter}` : ''}`;
}

window.initListings = function() {
  const grid = document.getElementById('cards-grid');
  if (!grid) return;

  // Show skeletons first
  grid.innerHTML = renderSkeletons(6);

  setTimeout(() => {
    let currentFilter = 'All';
    let currentSort = 'relevance';

    function render() {
      let venues = [...window.VENUES];

      // Filter
      if (currentFilter !== 'All') {
        venues = venues.filter(v => v.sports.includes(currentFilter));
      }

      // Sort
      if (currentSort === 'price-asc') venues.sort((a, b) => a.price - b.price);
      else if (currentSort === 'price-desc') venues.sort((a, b) => b.price - a.price);
      else if (currentSort === 'rating') venues.sort((a, b) => b.rating - a.rating);

      updateCount(venues.length, currentFilter);

      if (venues.length === 0) {
        grid.innerHTML = `<div class="empty-state">
          <div class="emoji">🏟️</div>
          <h3>No venues found</h3>
          <p>Try a different sport or location</p>
        </div>`;
        return;
      }

      grid.innerHTML = venues.map((v, i) => renderCard(v, i * 60)).join('');
    }

    render();

    // Filters
    document.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = pill.dataset.sport;
        render();
      });
    });

    // Sort
    const sortEl = document.getElementById('sort-select');
    if (sortEl) sortEl.addEventListener('change', e => { currentSort = e.target.value; render(); });
  }, 600);
};

// Search
window.handleSearch = function() {
  const location = document.getElementById('search-location')?.value;
  const sport = document.getElementById('search-sport')?.value;
  document.querySelector('.listings-section')?.scrollIntoView({ behavior: 'smooth' });
  if (sport && sport !== '') {
    document.querySelector(`.pill[data-sport="${sport}"]`)?.click();
  }
};