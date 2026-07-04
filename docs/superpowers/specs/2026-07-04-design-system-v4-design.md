# Usinagem360 — Design System v4 "Aço & Cobre" + Bug Fixes

**Data:** 2026-07-04 · **Status:** aprovado pelo Alexandre

## Objetivo

Refinar a identidade "aço & cobre" existente num design system sóbrio (tecnologia,
Indústria 4.0, raízes de chão de fábrica), aplicá-lo de forma consistente nas 5
páginas + 404, e corrigir todos os bugs encontrados no bug hunt.

## Decisões aprovadas

1. **Direção visual:** refinar aço & cobre (não recomeçar). Base monocromática de
   cinzas de aço; cobre como acento único; azul-aço rebaixado a cor de apoio.
2. **Tema padrão:** segue o sistema (`prefers-color-scheme`); toggle manual persiste
   em localStorage.
3. **Tipografia:** títulos em **Archivo** (sans industrial), corpo **Inter**, dados
   técnicos (datas, meta, contadores, tags) em **JetBrains Mono**. Remover DM Serif
   (importada e sem uso).
4. **Escopo de bugs:** corrigir tudo (visual + lógica + refactor de dados de categoria).

## Fundações (tokens)

- **Dark:** fundos `#0C0E11 → #14171C → #1A1E24`, texto `#E8EAED`, cobre `#C98A4B`.
- **Light:** fundos `#F5F4F1 → #FFFFFF`, texto `#17191D`, cobre `#A6672C`.
- Cores de categoria dessaturadas ~15%, definidas uma única vez.
- Radius reto: 2/4/8px (+ `--radius-full` para os poucos círculos). Sem gradiente em
  botão/badge; no máximo 2 usos cirúrgicos (logo, filete do hero).
- Badges de categoria: etiqueta retangular com barra lateral colorida (via
  `[data-category]` + custom property `--cat`), não mais pill colorido.
- Filete de cobre 3px no topo do site; textura de chapa sutil no hero; sombras
  mínimas, bordas 1px.

## Bugs a corrigir

1. `--radius-full` usado e nunca definido → pills quadrados.
2. `var(--cat-industria4.0)` inválido (ponto) em posts.js/article.js → usar
   `[data-category]` no CSS.
3. `config.js` marca `/sobre` etc. como subdiretório em domínio raiz → lista de
   primeiros segmentos conhecidos (alinhada ao 404.html).
4. `--font-size-sm` usado e nunca definido.
5. Script inline morto (`--site-base`) no index.html.
6. Ícone do toggle de tema não sincroniza no load; mover set de tema para inline no
   `<head>` (evita FOUC) e sincronizar ícone no init do theme.js.
7. "As mais lidas" é shuffle aleatório → vira "Mais notícias" determinístico
   (posts 4–8 por data, sem repetir os 3 destaques).
8. Contadores de categoria da sidebar do index nunca preenchidos → preencher via JS
   usando `data-category`.
9. Footer linka `/anuncie/`, `/politica-de-privacidade/`, `/feed/` (não existem) →
   remover até existirem; placeholders `#` de Parceiros apontam para `/contato/`.
10. Form de contato com Formspree placeholder → submit abre `mailto:` prefilled
    (sem backend); newsletter mostra mensagem inline "em breve" em vez de `alert()`.
11. Badges mostram slug cru → sempre label (`Indústria 4.0`, `IA na Indústria`).
12. `sidebar__category--active` sem CSS → estilizar.
13. Título/excerpt/source injetados sem escape → `escapeHtml` compartilhado.
14. Dados de categoria duplicados em 3 JS → novo `public/js/categories.js` expõe
    `window.U360` (CATEGORIES: slug → label/ícone/descrição; helpers `formatDate`,
    `formatDateShort`, `escapeHtml`, `iconHtml`).
15. Estilos inline nos HTMLs/templates JS → classes do design system (breadcrumb,
    cards da página "todas as categorias", estados vazios).

## Consistência entre páginas

Header/footer idênticos (com aria-labels) nas 5 páginas + 404; breadcrumb como
componente único; página de categorias com cards reais; bump de cache `?v3` nos
scripts; 404.html alinhado à paleta.

## Verificação

Servidor local + preview: 5 páginas, tema claro/escuro, mobile 375px, console sem
erros, links de navegação e artigos funcionando.
