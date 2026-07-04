/* ============================================
   Usinagem360 — Posts Engine
   Carrega posts do posts.json e renderiza
   ============================================ */

(function() {
  'use strict';

  const POSTS_URL = 'content/posts/posts.json';
  const U = window.U360;
  let allPosts = [];
  let currentPage = 1;
  const PER_PAGE = 10;
  const FEATURED_COUNT = 3;
  const SIDEBAR_COUNT = 5;

  function getImageHtml(post) {
    if (post.image) {
      return `<img class="post-card__image" src="${U.escapeHtml(post.image)}" alt="${U.escapeHtml(post.title)}" loading="lazy">`;
    }
    return `<div class="post-card__image-placeholder">${U.iconHtml(U.getCategory(post.category).icon)}</div>`;
  }

  function getFeatureImageHtml(post) {
    if (post.image) {
      return `<img class="hero__featured-image" src="${U.escapeHtml(post.image)}" alt="${U.escapeHtml(post.title)}" loading="lazy">`;
    }
    return `<div class="hero__featured-image-placeholder">${U.iconHtml(U.getCategory(post.category).icon)}</div>`;
  }

  function renderPostCard(post) {
    return `
      <a href="/artigo/${encodeURIComponent(post.slug)}/" class="post-card">
        ${getImageHtml(post)}
        <div class="post-card__body">
          <div class="post-card__meta">
            ${U.categoryBadge(post.category)}
            <span>${U.formatDateShort(post.date)}</span>
          </div>
          <h3 class="post-card__title">${U.escapeHtml(post.title)}</h3>
          <p class="post-card__excerpt">${U.escapeHtml(post.excerpt || '')}</p>
          <span class="post-card__source">Fonte: ${U.escapeHtml(post.source || 'Usinagem360')}</span>
        </div>
      </a>
    `;
  }

  function renderSidebarPost(post) {
    const img = post.image
      ? `<img class="sidebar__post-image" src="${U.escapeHtml(post.image)}" alt="" loading="lazy">`
      : `<div class="sidebar__post-image sidebar__post-image--placeholder">${U.iconHtml(U.getCategory(post.category).icon)}</div>`;
    return `
      <a href="/artigo/${encodeURIComponent(post.slug)}/" class="sidebar__post">
        ${img}
        <div class="sidebar__post-body">
          <span class="sidebar__post-title">${U.escapeHtml(post.title)}</span>
          <span class="sidebar__post-date">${U.formatDateShort(post.date)}</span>
        </div>
      </a>
    `;
  }

  function renderFeaturedCard(post, isMain) {
    const cls = isMain ? 'hero__featured-card hero__featured-card--main' : 'hero__featured-card';
    return `
      <a href="/artigo/${encodeURIComponent(post.slug)}/" class="${cls}">
        ${getFeatureImageHtml(post)}
        <div class="hero__featured-body">
          ${U.categoryBadge(post.category)}
          <h2 class="hero__featured-title">${U.escapeHtml(post.title)}</h2>
          <p class="hero__featured-excerpt">${U.escapeHtml(post.excerpt || '')}</p>
          <div class="hero__featured-meta">
            <span>${U.formatDate(post.date)}</span>
            <span>Fonte: ${U.escapeHtml(post.source || 'Usinagem360')}</span>
          </div>
        </div>
      </a>
    `;
  }

  function updateCategoryCounts() {
    const counts = {};
    allPosts.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    document.querySelectorAll('.sidebar__category[data-category]').forEach(el => {
      const badge = el.querySelector('.sidebar__category-count');
      if (badge) badge.textContent = counts[el.dataset.category] || 0;
    });
  }

  function loadPosts() {
    const list = document.getElementById('posts-list');
    const featured = document.getElementById('featured-posts');
    const recent = document.getElementById('sidebar-recent');

    fetch(POSTS_URL)
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(posts => {
        allPosts = posts;

        // Ordena por data decrescente
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Destaques: top 3
        if (featured) {
          const top = allPosts.slice(0, FEATURED_COUNT);
          featured.innerHTML = top.map((p, i) => renderFeaturedCard(p, i === 0)).join('');
        }

        // Sidebar "Mais notícias": os próximos após os destaques,
        // pra não repetir o que já está no topo da página
        if (recent) {
          const sidebarPosts = allPosts.slice(FEATURED_COUNT, FEATURED_COUNT + SIDEBAR_COUNT);
          recent.innerHTML = sidebarPosts.length
            ? sidebarPosts.map(renderSidebarPost).join('')
            : '<p class="empty-state__hint">Nenhum post ainda.</p>';
        }

        updateCategoryCounts();
        renderPage(currentPage);
      })
      .catch(err => {
        console.error('Erro ao carregar posts:', err);
        if (list) {
          list.innerHTML = `
            <div class="empty-state">
              <div class="empty-state__icon"><i class="fi-rr-cubes"></i></div>
              <p class="empty-state__text">Nenhuma notícia disponível no momento.</p>
              <p class="empty-state__hint">As notícias aparecerão aqui assim que o pipeline de conteúdo for ativado.</p>
            </div>
          `;
        }
        if (featured) {
          featured.innerHTML = `
            <div class="hero__featured-card hero__featured-card--main">
              <div class="hero__featured-image-placeholder"><i class="fi-rr-gears"></i></div>
              <div class="hero__featured-body">
                <span class="hero__featured-title">Bem-vindo ao Usinagem360</span>
                <p class="hero__featured-excerpt">
                  Em breve: as melhores notícias sobre usinagem, ferramentas, máquinas CNC,
                  automação e Indústria 4.0 do Brasil.
                </p>
                <div class="hero__featured-meta">
                  <span>Usinagem360</span>
                </div>
              </div>
            </div>
          `;
        }
        if (recent) {
          recent.innerHTML = '<p class="empty-state__hint">Nenhum post ainda.</p>';
        }
      });
  }

  function renderPage(page) {
    const list = document.getElementById('posts-list');
    if (!list) return;

    const start = (page - 1) * PER_PAGE;
    const pagePosts = allPosts.slice(start, start + PER_PAGE);

    if (pagePosts.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon"><i class="fi-rr-cubes"></i></div>
          <p class="empty-state__text">Você já viu tudo por aqui.</p>
          <p class="empty-state__hint">Volte mais tarde para mais notícias.</p>
        </div>
      `;
    } else {
      list.innerHTML = pagePosts.map(renderPostCard).join('');
    }

    updatePagination(page);
  }

  function updatePagination(page) {
    const totalPages = Math.ceil(allPosts.length / PER_PAGE) || 1;
    currentPage = page;

    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    if (prevBtn) {
      prevBtn.classList.toggle('pagination__btn--disabled', page <= 1);
      prevBtn.onclick = page > 1 ? () => renderPage(page - 1) : null;
    }
    if (nextBtn) {
      nextBtn.classList.toggle('pagination__btn--disabled', page >= totalPages);
      nextBtn.onclick = page < totalPages ? () => renderPage(page + 1) : null;
    }

    for (let i = 1; i <= 3; i++) {
      const btn = document.getElementById(`page-${i}`);
      if (!btn) continue;
      const btnPage = page - 2 + i;
      if (btnPage >= 1 && btnPage <= totalPages) {
        btn.textContent = btnPage;
        btn.style.display = '';
        btn.classList.toggle('pagination__btn--active', btnPage === page);
        btn.onclick = () => renderPage(btnPage);
      } else {
        btn.style.display = 'none';
      }
    }
  }

  // ---- Init ----
  if (document.querySelector('#posts-list, #featured-posts, #sidebar-recent')) {
    loadPosts();
  }

})();
