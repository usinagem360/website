/* ============================================
   Usinagem360 — Category Page Engine
   ============================================ */

(function() {
  'use strict';

  const POSTS_URL = 'content/posts/posts.json';

  const CATEGORIES = {
    'usinagem': { icon: 'fi-rr-gears', label: 'Usinagem', desc: 'Notícias sobre processos de usinagem, torneamento, fresamento, furação, retificação e tecnologias de remoção de cavacos.' },
    'ferramentas': { icon: 'fi-rr-wrench-alt', label: 'Ferramentas', desc: 'Tudo sobre ferramentas de corte, pastilhas, brocas, fresas, revestimentos e tecnologias de ferramentaria.' },
    'maquinas': { icon: 'fi-rr-cubes', label: 'Máquinas', desc: 'Centros de usinagem, tornos CNC, retificadoras, máquinas híbridas e equipamentos para manufatura.' },
    'automacao': { icon: 'fi-rr-robotic-arm', label: 'Automação', desc: 'Robótica, células flexíveis, integração máquina-robô, paletizadores e soluções de automação industrial.' },
    'industria4.0': { icon: 'fi-rr-chart-network', label: 'Indústria 4.0', desc: 'IoT industrial, Digital Twin, manufatura digital, sistemas ciber-físicos e fábricas inteligentes.' },
    'ia': { icon: 'fi-rr-brain', label: 'IA na Indústria', desc: 'Inteligência artificial aplicada à manufatura: machine learning, visão computacional, manutenção preditiva e otimização de processos.' },
    'negocios': { icon: 'fi-rr-chart-line-up', label: 'Negócios', desc: 'Mercado de ferramentas de corte, economia industrial, fusões e aquisições, investimentos e tendências de mercado.' },
    'eventos': { icon: 'fi-rr-calendar', label: 'Eventos', desc: 'Feiras, congressos, workshops e cursos do setor de usinagem e manufatura no Brasil e no mundo.' }
  };

  function iconHtml(iconClass) {
    return '<i class="' + iconClass + '" style="font-size:1.2em;vertical-align:middle"></i>';
  }

  function getCategoryFromPath() {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    if (catParam) return catParam;
    const match = window.location.pathname.match(/\/categoria\/([^/]+)/);
    return match ? match[1] : null;
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
      // Show all categories
      document.title = 'Categorias — Usinagem360';
      if (title) title.textContent = 'Todas as Categorias';
      if (desc) desc.textContent = 'Navegue por todas as categorias de notícias do Usinagem360.';
      if (breadcrumb) breadcrumb.textContent = 'Todas as Categorias';
      if (icon) icon.innerHTML = iconHtml('fi-rr-cubes');

      const grouped = {};
      posts.forEach(p => {
        if (!grouped[p.category]) grouped[p.category] = [];
        grouped[p.category].push(p);
      });

      if (list) {
        list.innerHTML = Object.entries(CATEGORIES).map(([key, val]) => {
          const count = grouped[key] ? grouped[key].length : 0;
          return `
            <div style="margin-bottom:24px">
              <h3 style="font-size:1.25rem;font-weight:700;margin-bottom:8px">
                <a href="/categoria/${key}/" style="color:var(--color-text);text-decoration:none">
                  ${iconHtml(val.icon)} ${val.label}
                  <span style="font-weight:400;color:var(--color-text-muted);font-size:0.875rem">(${count} posts)</span>
                </a>
              </h3>
              <p style="font-size:0.875rem;color:var(--color-text-secondary);margin-bottom:8px">${val.desc}</p>
              ${count > 0 ? '<a href="/categoria/' + key + '/" style="font-size:0.875rem;font-weight:500">Ver notícias →</a>' : '<span style="font-size:0.875rem;color:var(--color-text-muted)">Nenhum post ainda</span>'}
            </div>
          `;
        }).join('');
      }

      // Sidebar
      if (sidebar) {
        sidebar.innerHTML = Object.entries(CATEGORIES).map(([key, val]) => `
          <a href="/categoria/${key}/" class="sidebar__category">
            <span>${iconHtml(val.icon)} ${val.label}</span>
            <span class="sidebar__category-count">${grouped[key] ? grouped[key].length : 0}</span>
          </a>
        `).join('');
      }
      return;
    }

    // Individual category
    document.title = cat.label + ' — Usinagem360';
    if (icon) icon.innerHTML = iconHtml(cat.icon);
    if (title) title.textContent = cat.label;
    if (desc) desc.textContent = cat.desc;
    if (breadcrumb) breadcrumb.textContent = cat.label;

    const filtered = posts.filter(p => p.category === category);

    if (list) {
      if (filtered.length === 0) {
        list.innerHTML = '<div class="empty-state"><p>Nenhuma notícia nesta categoria ainda.</p></div>';
      } else {
        list.innerHTML = filtered.map(p => {
          var imageHtml = p.image
            ? '<img class="post-card__image" src="' + p.image + '" alt="' + p.title + '" loading="lazy">'
            : '<div class="post-card__image-placeholder">' + iconHtml(cat.icon) + '</div>';
          return `
          <a href="/artigo/${p.slug}/" class="post-card">
            ${imageHtml}
            <div class="post-card__body">
              <div class="post-card__meta">
                <span class="post-card__category" data-category="${p.category}">${iconHtml(cat.icon)} ${p.category}</span>
                <span>${formatDateShort(p.date)}</span>
              </div>
              <h3 class="post-card__title">${p.title}</h3>
              <p class="post-card__excerpt">${p.excerpt || ''}</p>
            </div>
          </a>`;
        }).join('');
      }
    }

    // Sidebar
    if (sidebar) {
      sidebar.innerHTML = Object.entries(CATEGORIES).map(([key, val]) => {
        var activeClass = key === category ? ' sidebar__category--active' : '';
        return '<a href="/categoria/' + key + '/" class="sidebar__category' + activeClass + '">'
          + '<span>' + iconHtml(val.icon) + ' ' + val.label + '</span>'
          + '<span class="sidebar__category-count">' + posts.filter(function(p) { return p.category === key; }).length + '</span>'
          + '</a>';
      }).join('');
    }
  }

  function formatDateShort(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  }

  fetch(POSTS_URL)
    .then(function(r) { return r.json(); })
    .then(function(posts) {
      var category = getCategoryFromPath();
      renderPage(category, posts);
    })
    .catch(function(err) {
      console.error('Erro:', err);
      var el = document.getElementById('cat-posts');
      if (el) el.innerHTML = '<div class="empty-state"><p>Erro ao carregar categorias.</p></div>';
    });

})();
