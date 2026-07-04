/* ============================================
   Usinagem360 — Theme Toggle
   O data-theme inicial é definido por um script
   inline no <head> (evita flash de tema errado).
   Aqui fica o toggle e a sincronização do ícone.
   ============================================ */

(function() {
  'use strict';

  const STORAGE_KEY = 'usinagem360-theme';

  function getPreferredTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) { /* localStorage indisponível */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignora */ }
    }
    updateToggleIcon(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    setTheme(current === 'dark' ? 'light' : 'dark', true);
  }

  function updateToggleIcon(theme) {
    const icon = document.getElementById('theme-toggle-icon');
    if (!icon) return;
    // Mostra o tema para o qual o clique vai levar
    icon.innerHTML = theme === 'dark'
      ? '<i class="fi-rr-sun"></i>'
      : '<i class="fi-rr-moon"></i>';
  }

  // Init: garante data-theme e ícone coerentes
  setTheme(document.documentElement.getAttribute('data-theme') || getPreferredTheme(), false);

  // Acompanha mudanças do sistema enquanto o usuário não escolheu manualmente
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (err) { /* ignora */ }
    if (!stored) setTheme(e.matches ? 'dark' : 'light', false);
  });

  window.toggleTheme = toggleTheme;
})();
