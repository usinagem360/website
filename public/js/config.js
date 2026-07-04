// Usinagem360 — Site Configuration
(function() {
  'use strict';

  // Detecta se o site está em subdiretório (GitHub Pages project site).
  // Primeiros segmentos que pertencem ao PRÓPRIO site nunca são subdiretório —
  // lista alinhada com o roteador do 404.html.
  var OWN_SEGMENTS = [
    'artigo', 'categoria', 'sobre', 'contato', 'anuncie',
    'politica-de-privacidade', 'feed', 'admin', 'public', 'content', 'docs'
  ];

  var path = window.location.pathname;
  var match = path.match(/^\/([^/]+)/);
  var first = match ? match[1] : '';

  // É subdiretório apenas se o primeiro segmento não for página/pasta do site
  // e não for um arquivo (ex: index.html, artigo.html, sobre.html).
  var isOwn = OWN_SEGMENTS.indexOf(first) !== -1 || first.indexOf('.') !== -1;
  window.SITE_BASE = (first && !isOwn) ? '/' + first : '';
  var base = window.SITE_BASE;

  if (!base) return; // Nada a corrigir se estiver na raiz do domínio

  // --- Prefixa links absolutos com SITE_BASE ---
  // Em subdiretório (ex: /website/), href="/sobre/" iria para a raiz do domínio.
  // Correção: /sobre/ → /website/sobre/

  function fixLink(a) {
    var href = a.getAttribute('href');
    if (!href) return;
    // Pular links externos, âncoras, protocolos
    if (href.indexOf('//') === 0 || href.indexOf('#') === 0 ||
        href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
    // Pular se já tem o prefixo
    if (href.indexOf(base + '/') === 0 || href === base) return;
    // Pular URLs absolutas
    if (href.match(/^https?:\/\//i)) return;
    // Pular links relativos
    if (href.indexOf('/') !== 0) return;
    a.setAttribute('href', base + href);
  }

  function fixAllLinks() {
    document.querySelectorAll('a[href^="/"]').forEach(fixLink);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixAllLinks);
  } else {
    fixAllLinks();
  }

  // Observa links adicionados dinamicamente (posts, categorias, etc.)
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) {
          if (node.tagName === 'A') fixLink(node);
          node.querySelectorAll && node.querySelectorAll('a[href^="/"]').forEach(fixLink);
        }
      });
    });
  });
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });

  window.fixLinks = fixAllLinks;
})();
