# Checklist de publicação — Landing Page GEM+

Antes de publicar, verificar cada item abaixo.

## Arquivos que DEVEM ir para publicação

- `index.html`
- `styles.css`
- `main.js`
- `dist/tailwind.css`
- `assets/logo.webp` (4KB — versão principal)
- `assets/logo-fallback.png` (50KB — fallback)
- `assets/og-gemplus.png` (imagem social 1200×630)
- `assets/fernandocelo.webp` (58KB — versão principal)
- `assets/fernandocelo-fallback.jpg` (92KB — fallback)
- `assets/metodo-ccp-violino.webp` (47KB — versão principal)
- `assets/metodo-ccp-violino-fallback.jpg` (70KB — fallback)
- `assets/maestro/` (8 clipes `.mp4` + `maestro-frente.webp`, ~950KB — hero interativo)

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
- `assets/og-gemplus.svg` (fonte editável, não necessária em produção)

## Antes de publicar

### Já configurados

- [x] `<link rel="canonical">` = `https://gemplus.app`
- [x] `og:url` = `https://gemplus.app`
- [x] OG image = `https://gemplus.app/assets/og-gemplus.png` (1200×630)
- [x] Twitter Card = `https://gemplus.app/assets/og-gemplus.png`
- [x] Endpoint do formulário = n8n webhook (`data-endpoint` no `#waitlist-form`)
- [x] Imagens otimizadas em WebP (logo, fundador, produto)
- [x] Endpoint n8n verificado ativo (responde 200 com `{"success":true}`)

### Obrigatório (restante)

- [ ] Rodar `npx tailwindcss@3.4.17 -i src/input.css -o dist/tailwind.css --minify` se qualquer classe Tailwind foi alterada

### Recomendado

- [ ] Testar em 360px, 768px, 1024px e 1440px antes de publicar
- [ ] Verificar dark mode (toggle no canto superior direito)
- [ ] Verificar menu mobile (abaixo de 1024px)
- [ ] Verificar que todos os links âncora funcionam
- [ ] Verificar scroll reveal (animações ao rolar)
- [ ] Testar envio do formulário e confirmar recebimento no n8n
- [ ] Verificar OG image em https://www.opengraph.xyz/url/https://gemplus.app
