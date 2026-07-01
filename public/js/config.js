// Usinagem360 — Site Configuration
// Altere SITE_BASE conforme o ambiente
(function() {
  // Detecta automaticamente se está em subdiretório (GitHub Pages) ou raiz (domínio próprio / local)
  const path = window.location.pathname;
  // Se estamos em /website/... então base = '/website'
  // Se estamos em / (raiz), base = ''
  const match = path.match(/^(\/[^/]+)/);
  // Se o primeiro segmento parece um caminho de repositório (como /website), usa ele
  window.SITE_BASE = (match && match[1] !== '/artigo' && match[1] !== '/categoria') ? match[1] : '';
})();
