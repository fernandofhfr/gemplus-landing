# Checklist de publicação — Landing Page GEM+

Antes de publicar, verificar cada item abaixo.

## Arquivos que DEVEM ir para publicação

- `index.html`
- `styles.css`
- `main.js`
- `dist/tailwind.css`
- `assets/logo.png`

## Arquivos que NÃO devem ir para publicação

- `index.backup.html`
- `index.pre-tailwind-backup.html`
- `styles.backup.css`
- `styles.pre-tailwind-backup.css`
- `main.backup.js`
- `tailwind.config.js` (só serve para rebuilds)
- `src/input.css` (só serve para rebuilds)
- `package.json` / `package-lock.json` (só servem para rebuilds)
- `node_modules/`
- `qa-*` / `qa-section-screenshots/`
- `mphhaxqn-image.png`
- `.agents/` / `.od/` / `skills-lock.json`
- `gem-plus-context.md` (referência interna)

## Antes de publicar

### Obrigatório

- [ ] Ajustar `<link rel="canonical">` para o domínio real (linha ~20 do `index.html`)
- [ ] Definir o domínio real no `og:url` (linha ~16 do `index.html`)
- [ ] Criar e substituir a OG image (1200×630px) — atualmente aponta para `assets/logo.png`
- [ ] Configurar endpoint real no formulário (`data-endpoint` no `#waitlist-form`, linha ~574 do `index.html`)
- [ ] Rodar `npx tailwindcss@3.4.17 -i src/input.css -o dist/tailwind.css --minify` se qualquer classe Tailwind foi alterada

### Recomendado

- [ ] Testar em 360px, 768px, 1024px e 1440px antes de publicar
- [ ] Verificar dark mode (toggle no canto superior direito)
- [ ] Verificar menu mobile (abaixo de 1024px)
- [ ] Verificar que todos os links âncora funcionam
- [ ] Verificar scroll reveal (animações ao rolar)
- [ ] Criar favicon real (atualmente é SVG inline — funcional, mas não cacheado separadamente)
