/* ============================================
   Usinagem360 — Theme Toggle
   ============================================ */

(function() {
  'use strict';

  const STORAGE_KEY = 'usinagem360-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    updateToggleIcon(next);
  }

  function updateToggleIcon(theme) {
    const icon = document.getElementById('theme-toggle-icon');
    if (!icon) return;
    icon.innerHTML = theme === 'dark'
      ? '<i class="fi-rr-sun" style="font-size:1.2rem;line-height:1"></i>'
      : '<i class="fi-rr-moon" style="font-size:1.2rem;line-height:1"></i>';
  }

  // Init
  const theme = getPreferredTheme();
  setTheme(theme);

  // Listen for system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
      updateToggleIcon(e.matches ? 'dark' : 'light');
    }
  });

  // Expose
  window.toggleTheme = toggleTheme;
})();
