/* ============================================
   Usinagem360 — Dados de categoria e helpers
   Fonte única consumida por posts.js,
   article.js e category.js
   ============================================ */

(function() {
  'use strict';

  var CATEGORIES = {
    'usinagem':     { label: 'Usinagem',       icon: 'fi-rr-gears',          desc: 'Notícias sobre processos de usinagem, torneamento, fresamento, furação, retificação e tecnologias de remoção de cavacos.' },
    'ferramentas':  { label: 'Ferramentas',    icon: 'fi-rr-wrench-alt',     desc: 'Tudo sobre ferramentas de corte, pastilhas, brocas, fresas, revestimentos e tecnologias de ferramentaria.' },
    'maquinas':     { label: 'Máquinas',       icon: 'fi-rr-cubes',          desc: 'Centros de usinagem, tornos CNC, retificadoras, máquinas híbridas e equipamentos para manufatura.' },
    'automacao':    { label: 'Automação',      icon: 'fi-rr-robotic-arm',    desc: 'Robótica, células flexíveis, integração máquina-robô, paletizadores e soluções de automação industrial.' },
    'industria4.0': { label: 'Indústria 4.0',  icon: 'fi-rr-chart-network',  desc: 'IoT industrial, Digital Twin, manufatura digital, sistemas ciber-físicos e fábricas inteligentes.' },
    'ia':           { label: 'IA na Indústria',icon: 'fi-rr-brain',          desc: 'Inteligência artificial aplicada à manufatura: machine learning, visão computacional, manutenção preditiva e otimização de processos.' },
    'negocios':     { label: 'Negócios',       icon: 'fi-rr-chart-line-up',  desc: 'Mercado de ferramentas de corte, economia industrial, fusões e aquisições, investimentos e tendências de mercado.' },
    'eventos':      { label: 'Eventos',        icon: 'fi-rr-calendar',       desc: 'Feiras, congressos, workshops e cursos do setor de usinagem e manufatura no Brasil e no mundo.' }
  };

  function getCategory(slug) {
    return CATEGORIES[slug] || { label: slug || 'Geral', icon: 'fi-rr-cubes', desc: '' };
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function iconHtml(iconClass) {
    return '<i class="' + escapeHtml(iconClass) + '"></i>';
  }

  function categoryBadge(slug) {
    var cat = getCategory(slug);
    return '<span class="category-badge" data-category="' + escapeHtml(slug) + '">'
      + iconHtml(cat.icon) + ' ' + escapeHtml(cat.label) + '</span>';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return escapeHtml(dateStr);
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function formatDateShort(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return escapeHtml(dateStr);
    return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  }

  window.U360 = {
    CATEGORIES: CATEGORIES,
    getCategory: getCategory,
    escapeHtml: escapeHtml,
    iconHtml: iconHtml,
    categoryBadge: categoryBadge,
    formatDate: formatDate,
    formatDateShort: formatDateShort
  };
})();
