/* ============================================
   Usinagem360 — Main Application
   ============================================ */

(function() {
  'use strict';

  // ---- Menu mobile ----
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

    nav.querySelectorAll('.header__nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('header__nav--open');
        if (overlay) overlay.classList.remove('header__mobile-overlay--open');
        mobileToggle.textContent = '☰';
      });
    });
  }

  // ---- Scroll suave para âncoras ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- Ano corrente no footer ----
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Newsletter (sem backend ainda): mensagem inline ----
  const newsletterForm = document.querySelector('.js-newsletter');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let msg = newsletterForm.querySelector('.newsletter-form__message');
      if (!msg) {
        msg = document.createElement('p');
        msg.className = 'newsletter-form__message';
        newsletterForm.appendChild(msg);
      }
      msg.textContent = 'Newsletter em breve — obrigado pelo interesse!';
      newsletterForm.reset();
    });
  }

  // ---- Formulário de contato (sem backend): abre o cliente de email ----
  const contactForm = document.querySelector('.js-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const data = new FormData(contactForm);
      const subjectMap = {
        pauta: 'Sugestão de pauta',
        fonte: 'Indicação de fonte',
        anuncio: 'Anunciar no site',
        parceria: 'Proposta de parceria',
        feedback: 'Feedback',
        outro: 'Contato'
      };
      const subject = '[Usinagem360] ' + (subjectMap[data.get('subject')] || 'Contato');
      const body = 'Nome: ' + (data.get('name') || '') + '\n'
        + 'Email: ' + (data.get('email') || '') + '\n\n'
        + (data.get('message') || '');
      window.location.href = 'mailto:uppertools@hbr.ind.br'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);
    });
  }

})();
