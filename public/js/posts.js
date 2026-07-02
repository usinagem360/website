/* ============================================
   Usinagem360 — Posts Engine
   Carrega posts do posts.json e renderiza
   ============================================ */

(function() {
  'use strict';

  const POSTS_URL = 'content/posts/posts.json';
  let allPosts = [];
  let currentPage = 1;
  const PER_PAGE = 10;
  const RECENT_COUNT = 5;

  const CATEGORY_ICONS = {
    'usinagem': 'fi-rr-gears',
    'ferramentas': 'fi-rr-wrench-alt',
    'maquinas': 'fi-rr-cubes',
    'automacao': 'fi-rr-robotic-arm',
    'industria4.0': 'fi-rr-chart-network',
    'ia': 'fi-rr-brain',
    'negocios': 'fi-rr-chart-line-up',
    'eventos': 'fi-rr-calendar'
  };

  function getCategoryIcon(cat) {
    return CATEGORY_ICONS[cat] || 'fi-rr-cubes';
  }

  function iconHtml(iconClass) {
    return '<i class="' + iconClass + '" style="font-size:1.2em;vertical-align:middle"></i>';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function formatDateShort(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short'
    });
  }

  function getImageHtml(post) {
    if (post.image) {
      return `<img class="post-card__image" src="${post.image}" alt="${post.title}" loading="lazy">`;
    }
    return `<div class="post-card__image-placeholder">${iconHtml(getCategoryIcon(post.category))}</div>`;
  }

  function getFeatureImageHtml(post) {
    if (post.image) {
      return `<img class="hero__featured-image" src="${post.image}" alt="${post.title}" loading="lazy">`;
    }
    return `<div class="hero__featured-image-placeholder">${iconHtml(getCategoryIcon(post.category))}</div>`;
  }

  function renderPostCard(post) {
    return `
      <a href="/artigo/${post.slug}/" class="post-card">
        ${getImageHtml(post)}
        <div class="post-card__body">
          <div class="post-card__meta">
            <span class="post-card__category" data-category="${post.category}">${post.category}</span>
            <span>${formatDateShort(post.date)}</span>
          </div>
          <h3 class="post-card__title">${post.title}</h3>
          <p class="post-card__excerpt">${post.excerpt || ''}</p>
          <span class="post-card__source">Fonte: ${post.source || 'Usinagem360'}</span>
        </div>
      </a>
    `;
  }

  function renderSidebarPost(post) {
    const img = post.image
      ? `<img class="sidebar__post-image" src="${post.image}" alt="" loading="lazy">`
      : `<div class="sidebar__post-image" style="background:var(--color-surface-alt);display:flex;align-items:center;justify-content:center;font-size:1.5rem">${iconHtml(getCategoryIcon(post.category))}</div>`;
    return `
      <a href="/artigo/${post.slug}/" class="sidebar__post">
        ${img}
        <div class="sidebar__post-body">
          <span class="sidebar__post-title">${post.title}</span>
          <span class="sidebar__post-date">${formatDateShort(post.date)}</span>
        </div>
      </a>
    `;
  }

  function renderFeaturedCard(post, isMain) {
    const cls = isMain ? 'hero__featured-card hero__featured-card--main' : 'hero__featured-card';
    return `
      <a href="/artigo/${post.slug}/" class="${cls}">
        ${getFeatureImageHtml(post)}
        <div class="hero__featured-body">
          <span class="hero__featured-category" style="background:var(--cat-${post.category})">${post.category}</span>
          <h2 class="hero__featured-title">${post.title}</h2>
          <p class="hero__featured-excerpt">${post.excerpt || ''}</p>
          <div class="hero__featured-meta">
            <span>${formatDate(post.date)}</span>
            <span>Fonte: ${post.source || 'Usinagem360'}</span>
          </div>
        </div>
      </a>
    `;
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

        // Sort by date descending
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Featured: top 3
        if (featured) {
          const top3 = allPosts.slice(0, 3);
          featured.innerHTML = top3.map((p, i) => renderFeaturedCard(p, i === 0)).join('');
        }

        // Sidebar "As mais lidas" — mostra posts em ordem diferente
        // pra não repetir a mesma ordem da grid principal
        if (recent) {
          // Embaralha uma cópia e pega os primeiros
          var shuffled = allPosts.slice().sort(function() { return 0.5 - Math.random(); });
          var sidebarPosts = shuffled.slice(0, RECENT_COUNT);
          recent.innerHTML = sidebarPosts.map(renderSidebarPost).join('');
        }

        // Render page
        renderPage(currentPage);
      })
      .catch(err => {
        console.error('Erro ao carregar posts:', err);
        if (list) {
          list.innerHTML = `
            <div class="empty-state">
              <div class="empty-state__icon"><i class="fi-rr-cubes" style="font-size:2rem"></i></div>
              <p class="empty-state__text">Nenhuma notícia disponível no momento.</p>
              <p style="font-size:var(--font-size-sm);color:var(--color-text-muted);margin-top:8px">
                As notícias aparecerão aqui assim que o pipeline de conteúdo for ativado.
              </p>
            </div>
          `;
        }
        if (featured) {
          featured.innerHTML = `
            <div class="hero__featured-card hero__featured-card--main">
              <div class="hero__featured-image-placeholder"><i class="fi-rr-gears" style="font-size:2rem"></i></div>
              <div class="hero__featured-body">
                <span class="hero__featured-title">Bem-vindo ao Usinagem360</span>
                <p class="hero__featured-excerpt" style="color:var(--color-text-secondary)">
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
          recent.innerHTML = '<p style="font-size:var(--font-size-sm);color:var(--color-text-muted)">Nenhum post ainda.</p>';
        }
      });
  }

  function renderPage(page) {
    const list = document.getElementById('posts-list');
    if (!list) return;

    const start = (page - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    const pagePosts = allPosts.slice(start, end);

    if (pagePosts.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon"><i class="fi-rr-cubes" style="font-size:2rem"></i></div>
          <p class="empty-state__text">Você já viu tudo por aqui.</p>
          <p style="font-size:var(--font-size-sm);color:var(--color-text-muted)">Volte mais tarde para mais notícias.</p>
        </div>
      `;
    } else {
      list.innerHTML = pagePosts.map(renderPostCard).join('');
    }

    // Update pagination buttons
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
