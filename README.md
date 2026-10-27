# Landing Page GEM+

Página de apresentação do produto GEM+ — plataforma de gestão musical para igrejas e congregações.

## Estrutura do projeto

```
├── index.html              ← Página principal
├── styles.css              ← Tokens CSS, animações, utilitários customizados
├── main.js                 ← Tema, menu mobile, scroll reveal, formulário
├── dist/tailwind.css       ← CSS gerado pelo Tailwind CLI (não editar manualmente)
├── tailwind.config.js      ← Configuração do Tailwind (cores, fontes, dark mode)
├── src/input.css           ← Arquivo de entrada do Tailwind CLI
├── package.json            ← Scripts de build e dependência tailwindcss
├── package-lock.json       ← Lockfile do npm
├── assets/
│   ├── logo.webp                    ← Logo (4KB)
│   ├── logo-fallback.png            ← Logo fallback (50KB)
│   ├── fernandocelo.webp            ← Foto do fundador (58KB)
│   ├── fernandocelo-fallback.jpg    ← Fundador fallback (92KB)
│   ├── metodo-ccp-violino.webp      ← Imagem do produto (47KB)
│   ├── metodo-ccp-violino-fallback.jpg ← Produto fallback (70KB)
│   ├── og-gemplus.png               ← Imagem social (515KB)
│   └── og-gemplus.svg               ← Fonte SVG da imagem social (apenas local, ignorado pelo git)
└── gem-plus-context.md              ← Referência de copy e design system (apenas local, ignorado pelo git)
```

## Como funciona o Tailwind

Este projeto usa **Tailwind CSS local gerado**, não o CDN. O CSS final está em `dist/tailwind.css` e é carregado diretamente pelo `index.html`.

### Quando regenerar o CSS

É obrigatório regenerar o CSS sempre que:

- Adicionar, remover ou alterar classes Tailwind no `index.html`
- Alterar `tailwind.config.js` (cores, fontes, breakpoints, dark mode)
- Alterar `src/input.css`

**Não** é necessário regenerar ao alterar apenas `styles.css` ou `main.js`.

### Comando de rebuild

```bash
npx tailwindcss@3.4.17 -i src/input.css -o dist/tailwind.css --minify
```

Ou, se tiver `node_modules` instalado:

```bash
npm run build:css
```

Para rebuild automático durante desenvolvimento:

```bash
npm run watch:css
```

## Como testar localmente

```bash
python -m http.server 8080
```

Depois abrir: http://localhost:8080

## Dependências externas

- **Google Fonts** (Montserrat + Open Sans) — carregado via `<link>` no `<head>` do `index.html` com `preconnect`. Se não houver internet, o fallback é `font-family: sans-serif`. O layout, cores e funcionalidades continuam intactos.

## Fases de melhoria realizadas

| Fase | Escopo |
|------|--------|
| Fase 1 | Textos (H1, CTAs, FAQ), seção "Prova visual" → "Módulos do produto", favicon, canonical, acessibilidade |
| Fase 1.1 | Transparência: badges "Prévia ilustrativa", canonical TODO, formulário sem endpoint |
| Fase 2 | Menu hamburger mobile, escala tipográfica fluida, cards fluidos, timeline mobile |
| Fase 2.1 | Blob hero limitado em 1024–1200px, stats mobile, H1 em 320px |
| Fase 2.1.1 | Blob hero restaurado em desktop (xl:max-w-none) |
| Fase 2.2 | Migração de Tailwind CDN para CSS local |
