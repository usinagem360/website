/* ============================================
   Usinagem360 — Main Application
   ============================================ */

(function() {
  'use strict';

  // ---- Mobile Menu ----
  const mobileToggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('nav');
  const overlay = document.getElementById('mobile-overlay');

  if (mobileToggle && nav) {
    function toggleMobile() {
      nav.classList.toggle('header__nav--open');
      if (overlay) overlay.classList.toggle('header__mobile-overlay--open');
      mobileToggle.textContent = nav.classList.contains('header__nav--open') ? '✕' : '☰';
    }
    mobileToggle.addEventListener('click', toggleMobile);
    if (overlay) overlay.addEventListener('click', toggleMobile);

    // Close on link click
    nav.querySelectorAll('.header__nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('header__nav--open');
        if (overlay) overlay.classList.remove('header__mobile-overlay--open');
        mobileToggle.textContent = '☰';
      });
    });
  }

  // ---- Smooth scroll for "Ver Mais" ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- Current year in footer ----
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
