/* ============================================
   Usinagem360 — Article Page Engine
   ============================================ */

(function() {
  'use strict';

  const POSTS_URL = 'content/posts/posts.json';
  const container = document.getElementById('article-container');
  const relatedContainer = document.getElementById('related-posts');

  function getSlug() {
    // Primeiro tenta query param (?slug=meu-slug) — usado pelo 404.html redirect
    const params = new URLSearchParams(window.location.search);
    const slugParam = params.get('slug');
    if (slugParam) return slugParam;
    // Fallback: pathname (quando acessa artigo.html diretamente com URL limpa)
    const path = window.location.pathname;
    const match = path.match(/\/artigo\/([^/]+)\/?/);
    return match ? match[1] : null;
  }

  function renderArticle(post) {
    if (!post) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🔍</div>
          <p class="empty-state__text">Artigo não encontrado.</p>
          <a href="/" style="color:var(--color-primary);margin-top:16px;display:inline-block">← Voltar ao início</a>
        </div>
      `;
      return;
    }

    // Update meta/SEO
    document.title = `${post.title} — Usinagem360`;
    document.getElementById('meta-description').content = post.excerpt || '';
    document.getElementById('og-title').content = post.title;
    document.getElementById('og-description').content = post.excerpt || '';
    document.getElementById('og-url').content = window.location.href;

    // Breadcrumb
    document.getElementById('breadcrumb-category').textContent = post.category;
    document.getElementById('breadcrumb-category').href = `/categoria/${post.category}/`;
    document.getElementById('breadcrumb-title').textContent = post.title;

    const imgHtml = post.image
      ? `<img class="article-featured-image" src="${post.image}" alt="${post.title}">`
      : '';

    const contentHtml = post.content
      ? post.content.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('')
      : '';

    container.innerHTML = `
      <header class="article-header">
        <span class="article-category" style="background:var(--cat-${post.category})">${post.category}</span>
        <h1 class="article-title">${post.title}</h1>
        <div class="article-meta">
          <span class="article-meta__author">
            <span class="article-meta__avatar">U</span>
            ${post.author || 'Usinagem360'}
          </span>
          <span>${formatDate(post.date)}</span>
          ${post.source ? `<span>Fonte: <a href="${post.sourceUrl || '#'}" target="_blank" rel="noopener">${post.source}</a></span>` : ''}
        </div>
      </header>

      ${imgHtml}

      <div class="article-content">
        ${contentHtml}
      </div>

      ${post.sourceUrl ? `
      <div class="article-source">
        📰 <strong>Fonte original:</strong> <a href="${post.sourceUrl}" target="_blank" rel="nofollow noopener">${post.source || 'Link original'}</a>
      </div>` : ''}

      <div class="article-tags">
        <a href="/categoria/${post.category}/" class="article-tag">#${post.category}</a>
      </div>
    `;
  }

  function renderRelated(currentPost, allPosts) {
    if (!relatedContainer) return;
    const sameCategory = allPosts.filter(p =>
      p.category === currentPost.category && p.slug !== currentPost.slug
    ).slice(0, 3);

    if (sameCategory.length === 0) {
      relatedContainer.innerHTML = '';
      return;
    }

    relatedContainer.innerHTML = sameCategory.map(p => `
      <a href="/artigo/${p.slug}/" class="post-card">
        ${p.image
          ? `<img class="post-card__image" src="${p.image}" alt="${p.title}" loading="lazy">`
          : `<div class="post-card__image-placeholder">📰</div>`}
        <div class="post-card__body">
          <div class="post-card__meta">
            <span class="post-card__category" data-category="${p.category}">${p.category}</span>
            <span>${formatDateShort(p.date)}</span>
          </div>
          <h3 class="post-card__title">${p.title}</h3>
          <p class="post-card__excerpt">${p.excerpt || ''}</p>
        </div>
      </a>
    `).join('');
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('pt-BR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  function formatDateShort(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('pt-BR', {
      day: 'numeric', month: 'short'
    });
  }

  function init() {
    const slug = getSlug();
    if (!slug) {
      const fallback = window.__ARTICLE_DATA;
      if (fallback) {
        renderArticle(fallback);
        fetch(POSTS_URL)
          .then(r => r.json())
          .then(posts => renderRelated(fallback, posts))
          .catch(() => {});
        return;
      }
      container.innerHTML = '<div class="empty-state"><p>Artigo não encontrado.</p></div>';
      return;
    }

    fetch(POSTS_URL)
      .then(r => r.json())
      .then(posts => {
        const post = posts.find(p => p.slug === slug);
        renderArticle(post);
        if (post) renderRelated(post, posts);
      })
      .catch(err => {
        console.error('Erro ao carregar artigo:', err);
        container.innerHTML = '<div class="empty-state"><p>Erro ao carregar o artigo.</p></div>';
      });
  }

  init();
})();
