// Shared HTML components
window.getNavbarHTML = function(activePage) {
  return `
  <nav class="navbar" id="navbar">
    <div class="nav-inner">
      <a href="index.html" class="nav-logo">⚽ Divyam <span>Turf</span></a>
      <div class="nav-links">
        <a href="index.html" class="${activePage==='home'?'active':''}">Home</a>
        <a href="index.html" class="${activePage==='venues'?'active':''}">Venues</a>
        <a href="#" class="">Sports</a>
        <a href="#" class="">About</a>
        <a href="#" class="">Contact</a>
      </div>
      <div class="nav-actions">
        <button class="btn btn-outline">Login</button>
        <button class="btn btn-primary">Sign Up</button>
      </div>
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="mobile-nav" id="mobile-nav">
      <a href="index.html">🏠 Home</a>
      <a href="index.html">🏟️ Venues</a>
      <a href="#">⚽ Sports</a>
      <a href="#">ℹ️ About</a>
      <a href="#">📞 Contact</a>
      <div class="mobile-nav-actions">
        <button class="btn btn-outline-dark">Login</button>
        <button class="btn btn-primary">Sign Up</button>
      </div>
    </div>
  </nav>`;
};

window.getFooterHTML = function() {
  return `
  <footer class="footer">
    <div class="footer-grid">
      <div>
        <div class="footer-logo">⚽ Divyam <span>Turf</span></div>
        <p class="footer-tagline">Mumbai's most trusted turf booking platform. Find, compare, and book the best football and sports grounds near you.</p>
        <div class="social-links">
          <a class="social-btn" href="#" title="Facebook">📘</a>
          <a class="social-btn" href="#" title="Instagram">📷</a>
          <a class="social-btn" href="#" title="Twitter">🐦</a>
          <a class="social-btn" href="#" title="YouTube">▶️</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="index.html">Venues</a></li>
          <li><a href="#">Sports</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Sports</h4>
        <ul>
          <li><a href="#">⚽ Football</a></li>
          <li><a href="#">🏏 Cricket</a></li>
          <li><a href="#">🏸 Badminton</a></li>
          <li><a href="#">🏀 Basketball</a></li>
          <li><a href="#">🏓 Pickleball</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact Us</h4>
        <div class="contact-item"><span class="icon">📍</span> Mumbai, Maharashtra, India</div>
        <div class="contact-item"><span class="icon">📞</span> +91 98765 43210</div>
        <div class="contact-item"><span class="icon">✉️</span> info@divyamturf.com</div>
        <div class="contact-item"><span class="icon">🕐</span> Open 6AM – 11PM Daily</div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2024 Divyam Turf Booking. All rights reserved.</span>
      <span><a href="#">Privacy Policy</a> · <a href="#">Terms of Use</a></span>
    </div>
  </footer>
  <button id="back-to-top" title="Back to top">↑</button>`;
};

window.initNavbar = function() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const navbar = document.getElementById('navbar');
  if (hamburger) hamburger.addEventListener('click', () => mobileNav.classList.toggle('open'));
  if (navbar) window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });
  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 400));
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
};