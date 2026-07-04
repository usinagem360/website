/* ============================================
   Usinagem360 — Category Page Engine
   ============================================ */

(function() {
  'use strict';

  const POSTS_URL = 'content/posts/posts.json';
  const U = window.U360;
  const CATEGORIES = U.CATEGORIES;

  function getCategoryFromPath() {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    if (catParam) return catParam;
    const match = window.location.pathname.match(/\/categoria\/([^/]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function renderSidebar(sidebar, posts, activeCategory) {
    if (!sidebar) return;
    sidebar.innerHTML = Object.entries(CATEGORIES).map(([key, val]) => {
      const count = posts.filter(p => p.category === key).length;
      const activeClass = key === activeCategory ? ' sidebar__category--active' : '';
      return `
        <a href="/categoria/${encodeURIComponent(key)}/" class="sidebar__category${activeClass}" data-category="${U.escapeHtml(key)}">
          <span>${U.iconHtml(val.icon)} ${U.escapeHtml(val.label)}</span>
          <span class="sidebar__category-count">${count}</span>
        </a>
      `;
    }).join('');
  }

  function renderPage(category, posts) {
    const cat = CATEGORIES[category];
    const icon = document.getElementById('cat-icon');
    const title = document.getElementById('cat-title');
    const desc = document.getElementById('cat-description');
    const list = document.getElementById('cat-posts');
    const breadcrumb = document.getElementById('cat-breadcrumb');
    const sidebar = document.getElementById('cat-sidebar');

    if (!cat) {
      // Índice de todas as categorias
      document.title = 'Categorias — Usinagem360';
      if (title) title.textContent = 'Todas as Categorias';
      if (desc) desc.textContent = 'Navegue por todas as categorias de notícias do Usinagem360.';
      if (breadcrumb) breadcrumb.textContent = 'Todas as Categorias';
      if (icon) icon.innerHTML = U.iconHtml('fi-rr-cubes');

      const counts = {};
      posts.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });

      if (list) {
        list.innerHTML = Object.entries(CATEGORIES).map(([key, val]) => {
          const count = counts[key] || 0;
          return `
            <a href="/categoria/${encodeURIComponent(key)}/" class="category-index-card" data-category="${U.escapeHtml(key)}">
              <div class="category-index-card__head">
                ${U.iconHtml(val.icon)}
                <span class="category-index-card__title">${U.escapeHtml(val.label)}</span>
                <span class="category-index-card__count">${count} ${count === 1 ? 'post' : 'posts'}</span>
              </div>
              <p class="category-index-card__desc">${U.escapeHtml(val.desc)}</p>
            </a>
          `;
        }).join('');
      }

      renderSidebar(sidebar, posts, null);
      return;
    }

    // Categoria individual
    document.title = cat.label + ' — Usinagem360';
    if (icon) icon.innerHTML = U.iconHtml(cat.icon);
    if (title) title.textContent = cat.label;
    if (desc) desc.textContent = cat.desc;
    if (breadcrumb) breadcrumb.textContent = cat.label;

    const filtered = posts.filter(p => p.category === category);

    if (list) {
      if (filtered.length === 0) {
        list.innerHTML = '<div class="empty-state"><p class="empty-state__text">Nenhuma notícia nesta categoria ainda.</p></div>';
      } else {
        list.innerHTML = filtered.map(p => {
          const imageHtml = p.image
            ? `<img class="post-card__image" src="${U.escapeHtml(p.image)}" alt="${U.escapeHtml(p.title)}" loading="lazy">`
            : `<div class="post-card__image-placeholder">${U.iconHtml(cat.icon)}</div>`;
          return `
          <a href="/artigo/${encodeURIComponent(p.slug)}/" class="post-card">
            ${imageHtml}
            <div class="post-card__body">
              <div class="post-card__meta">
                ${U.categoryBadge(p.category)}
                <span>${U.formatDateShort(p.date)}</span>
              </div>
              <h3 class="post-card__title">${U.escapeHtml(p.title)}</h3>
              <p class="post-card__excerpt">${U.escapeHtml(p.excerpt || '')}</p>
            </div>
          </a>`;
        }).join('');
      }
    }

    renderSidebar(sidebar, posts, category);
  }

  fetch(POSTS_URL)
    .then(r => r.json())
    .then(posts => {
      // Mais recentes primeiro
      posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      renderPage(getCategoryFromPath(), posts);
    })
    .catch(err => {
      console.error('Erro:', err);
      const el = document.getElementById('cat-posts');
      if (el) el.innerHTML = '<div class="empty-state"><p class="empty-state__text">Erro ao carregar categorias.</p></div>';
    });

})();
