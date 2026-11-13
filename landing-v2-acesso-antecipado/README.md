# GEM+ Landing — Versão de Acesso Antecipado

Cópia da `landing-v2/` para a fase de testes com um grupo restrito. Diferenças em relação à V2:

- CTA principal leva à **lista de espera** (`#lista`), um formulário que envia nome, e-mail e perfil para o mesmo webhook n8n da V1 (`gemplus-interesse`), com `versao: "lista-de-espera"` no payload.
- Botões **Testadores** / **Sou testador** levam a `https://app.gemplus.app`, que pede a senha de acesso antecipado.
- Selo do topo "Acesso antecipado", aviso curto sob os botões e pergunta "O que é o acesso antecipado?" no FAQ.
- Build do CSS: `npm run build:antecipado`.

Quando o app for lançado para todos, publique a `landing-v2/` no lugar desta.

---

# GEM+ Landing Page — Versão 2 (Lançamento Oficial)

Esta é a proposta completa da **Landing Page de Lançamento** para o GEM+ (Gestão do Ensino Musical), construída de forma 100% isolada e independente da versão original de pré-lançamento.

---

## 🎯 Objetivo e Mudanças Estratégicas da V2

1. **De Pré-lançamento para Lançamento:**
   - Remoção de qualquer menção a "lista de espera" ou formulários de interesse.
   - Chamadas de ação (CTAs) diretas para **`https://app.gemplus.app`**.
2. **Prints Reais do Aplicativo no Celular:**
   - 12 telas reais do aplicativo em smartphones (PWA), capturadas da demonstração autêntica com nomes brasileiros, métodos do MSA e instrumentos da orquestra e órgão.
3. **Vitrine Interativa por Papéis:**
   - Abas interativas alternáveis em tempo real para:
     - **Gestor / Encarregado** (painel geral, naipes da orquestra).
     - **Instrutor** (registro rápido de aula, grade de lições do MSA).
     - **Aluno / Organista** (próxima lição, evolução no método).
4. **Comparativo "O Fim do Papel Amassado":**
   - Contraste visual entre a rotina antiga com fichas/cadernos e a nova rotina no celular.
5. **Destaque da Tecnologia PWA:**
   - Demonstração de como adicionar à tela de início do Android (Chrome) e iPhone (Safari) sem ocupar memória do aparelho.
6. **A História de Origem (Fernando Ribeiro):**
   - Reposicionada estrategicamente após a apresentação da solução, com nota clara de independência e respeito institucional.
7. **FAQ de Lançamento:**
   - 6 perguntas fundamentais esclarecendo gratuidade, segurança multi-tenant, PWA e escopo do app.

---

## 🛠️ Como Testar Localmente

Acesse o diretório raiz do projeto e inicie um servidor HTTP local:

```bash
python -m http.server 8080
```

Em seguida, abra no seu navegador:
* **Versão 2 (Lançamento):** [http://localhost:8080/landing-v2/](http://localhost:8080/landing-v2/)
* **Versão 1 (Original intacta):** [http://localhost:8080/](http://localhost:8080/)

---

## 🎨 Como Recompilar o Tailwind da V2

Se alterar classes Tailwind no `landing-v2/index.html`:

```bash
npm run build:v2
```

Ou para recompilação automática durante edições:

```bash
npm run watch:v2
```
