/* ============================================
   Usinagem360 — Article Page Engine
   ============================================ */

(function() {
  'use strict';

  const POSTS_URL = 'content/posts/posts.json';
  const U = window.U360;

  const container = document.getElementById('article-container');
  const relatedContainer = document.getElementById('related-posts');

  function getSlug() {
    // Primeiro tenta query param (?slug=meu-slug) — usado pelo 404.html redirect
    const params = new URLSearchParams(window.location.search);
    const slugParam = params.get('slug');
    if (slugParam) return slugParam;
    // Fallback: pathname (quando acessa com URL limpa /artigo/meu-slug/)
    const match = window.location.pathname.match(/\/artigo\/([^/]+)\/?/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function renderArticle(post) {
    if (!post) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon"><i class="fi-rr-cubes"></i></div>
          <p class="empty-state__text">Artigo não encontrado.</p>
          <p class="empty-state__hint"><a href="/">← Voltar ao início</a></p>
        </div>
      `;
      return;
    }

    // Meta/SEO
    document.title = `${post.title} — Usinagem360`;
    document.getElementById('meta-description').content = post.excerpt || '';
    document.getElementById('og-title').content = post.title;
    document.getElementById('og-description').content = post.excerpt || '';
    document.getElementById('og-url').content = window.location.href;

    // Breadcrumb
    const cat = U.getCategory(post.category);
    const bcCat = document.getElementById('breadcrumb-category');
    bcCat.textContent = cat.label;
    bcCat.href = `/categoria/${encodeURIComponent(post.category)}/`;
    document.getElementById('breadcrumb-title').textContent = post.title;

    const imgHtml = post.image
      ? `<img class="article-featured-image" src="${U.escapeHtml(post.image)}" alt="${U.escapeHtml(post.title)}">`
      : '';

    const contentHtml = post.content
      ? post.content.split('\n\n').map(p => `<p>${U.escapeHtml(p.trim())}</p>`).join('')
      : '';

    const sourceLink = post.sourceUrl
      ? `<a href="${U.escapeHtml(post.sourceUrl)}" target="_blank" rel="noopener">${U.escapeHtml(post.source || 'Link original')}</a>`
      : U.escapeHtml(post.source || '');

    container.innerHTML = `
      <header class="article-header">
        ${U.categoryBadge(post.category)}
        <h1 class="article-title">${U.escapeHtml(post.title)}</h1>
        <div class="article-meta">
          <span class="article-meta__author">
            <span class="article-meta__avatar">U</span>
            ${U.escapeHtml(post.author || 'Usinagem360')}
          </span>
          <span>${U.formatDate(post.date)}</span>
          ${post.source ? `<span>Fonte: ${sourceLink}</span>` : ''}
        </div>
      </header>

      ${imgHtml}

      <div class="article-content">
        ${contentHtml}
      </div>

      ${post.sourceUrl ? `
      <div class="article-source">
        <i class="fi-rr-link"></i> <strong>Fonte original:</strong> <a href="${U.escapeHtml(post.sourceUrl)}" target="_blank" rel="nofollow noopener">${U.escapeHtml(post.source || 'Link original')}</a>
      </div>` : ''}

      <div class="article-tags">
        <a href="/categoria/${encodeURIComponent(post.category)}/" class="article-tag">#${U.escapeHtml(cat.label)}</a>
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
      const section = document.getElementById('related-section');
      if (section) section.style.display = 'none';
      return;
    }

    relatedContainer.innerHTML = sameCategory.map(p => `
      <a href="/artigo/${encodeURIComponent(p.slug)}/" class="post-card">
        ${p.image
          ? `<img class="post-card__image" src="${U.escapeHtml(p.image)}" alt="${U.escapeHtml(p.title)}" loading="lazy">`
          : `<div class="post-card__image-placeholder">${U.iconHtml(U.getCategory(p.category).icon)}</div>`}
        <div class="post-card__body">
          <div class="post-card__meta">
            ${U.categoryBadge(p.category)}
            <span>${U.formatDateShort(p.date)}</span>
          </div>
          <h3 class="post-card__title">${U.escapeHtml(p.title)}</h3>
          <p class="post-card__excerpt">${U.escapeHtml(p.excerpt || '')}</p>
        </div>
      </a>
    `).join('');
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
      renderArticle(null);
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
        container.innerHTML = '<div class="empty-state"><p class="empty-state__text">Erro ao carregar o artigo.</p></div>';
      });
  }

  init();
})();
