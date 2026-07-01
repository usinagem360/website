# Usinagem360 — Website

Portal de notícias sobre usinagem, ferramentas de corte, máquinas CNC, automação industrial e Indústria 4.0.

## 🚀 Stack

- **Site:** HTML/CSS/JS puro (estático, ultra-rápido)
- **CMS:** Decap CMS (editor visual com Git)
- **Deploy:** GitHub Pages
- **Conteúdo:** Markdown/JSON no repositório

## 📁 Estrutura

```
/
├── index.html              # Homepage
├── artigo.html             # Página de artigo
├── categoria.html          # Página de categoria
├── sobre.html              # Sobre
├── contato.html            # Contato
├── admin/
│   ├── index.html          # Decap CMS admin
│   └── config.yml          # Configuração do CMS
├── public/
│   ├── css/style.css       # Design System
│   └── js/
│       ├── theme.js        # Controle de tema
│       ├── main.js         # Funções principais
│       ├── posts.js        # Engine de posts (home)
│       ├── article.js      # Engine de artigo
│       └── category.js     # Engine de categorias
└── content/
    └── posts/
        └── posts.json      # Banco de posts
```

## 🧪 Desenvolvimento Local

```bash
# Servir localmente com Python
python3 -m http.server 3000

# Ou com Node
npx serve .
```

Acesse `http://localhost:3000`

## 🤖 Automação

O repositório é compartilhado entre:
- **Agente Mac:** Desenvolvimento e manutenção
- **Agente VPS:** Pipeline automático de curadoria e publicação

## 📝 Licença

© 2025 Usinagem360. Todos os direitos reservados.
