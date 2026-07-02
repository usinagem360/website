// Usinagem360 — Site Configuration
(function() {
  'use strict';

  // Detecta automaticamente se está em subdiretório (GitHub Pages) ou raiz
  var path = window.location.pathname;
  var match = path.match(/^(\/[^/]+)/);
  window.SITE_BASE = (match && match[1] !== '/artigo' && match[1] !== '/categoria') ? match[1] : '';
  var base = window.SITE_BASE;

  if (!base) return; // Nada a corrigir se estiver na raiz

  // --- CORREÇÃO: prefixar links absolutos com SITE_BASE ---
  // Quando o site está em subdiretório (ex: /website/), links como href="/sobre/"
  // vão para a raiz do domínio em vez do subdiretório. Ex:
  //   /sobre/ → /website/sobre/
  //   /artigo/meu-slug/ → /website/artigo/meu-slug/
  //   /categoria/ → /website/categoria/

  function fixLink(a) {
    var href = a.getAttribute('href');
    if (!href) return;
    // Pular links externos, âncoras, protocolos
    if (href.indexOf('//') === 0 || href.indexOf('#') === 0 ||
        href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
    // Pular se já tem o prefixo
    if (href.indexOf(base) === 0) return;
    // Pular URLs absolutas
    if (href.match(/^https?:\/\//i)) return;
    // Pular se não começa com / (links relativos)
    if (href.indexOf('/') !== 0) return;
    // Adicionar o prefixo
    a.setAttribute('href', base + href);
  }

  function fixAllLinks() {
    document.querySelectorAll('a[href^="/"]').forEach(fixLink);
  }

  // Corrige links existentes assim que o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixAllLinks);
  } else {
    fixAllLinks();
  }

  // Observa novos links adicionados dinamicamente (artigos, categorias, etc.)
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // Element node
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

  // Expõe função para reaplicar manualmente se necessário
  window.fixLinks = fixAllLinks;
})();
