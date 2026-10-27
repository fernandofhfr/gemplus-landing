document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const fadeElements = document.querySelectorAll('.fade-in-section');
  const waitlistForm = document.getElementById('waitlist-form');
  const formStatus = document.getElementById('form-status');
  const formStatusTitle = document.getElementById('form-status-title');
  const formStatusText = document.getElementById('form-status-text');
  const officialContact = document.getElementById('official-contact');
  const officialContactLink = document.getElementById('official-contact-link');

  initializeTheme(root);
  initializeMobileMenu();
  initializeOfficialContact(officialContact, officialContactLink);

  let startTime = Date.now();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.classList.toggle('dark');
      localStorage.theme = isDark ? 'dark' : 'light';
      updateThemeIcon(isDark);
    });
  }

  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    fadeElements.forEach((element) => fadeObserver.observe(element));
  }

  if (waitlistForm && formStatus && formStatusTitle && formStatusText) {
    waitlistForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const endpoint = waitlistForm.dataset.endpoint?.trim();
      const formDisabled = waitlistForm.dataset.formDisabled === 'true';
      const formData = new FormData(waitlistForm);
      const website = String(formData.get('website') || '').trim();
      const tempoPreenchimentoMs = Date.now() - startTime;

      // Honeypot check - aborta silenciosamente mostrando sucesso se for bot
      if (website) {
        console.warn('Honeypot preenchido. Abortando envio.');
        waitlistForm.reset();
        startTime = Date.now();
        showFormStatus(
          formStatus,
          formStatusTitle,
          formStatusText,
          'Interesse registrado com sucesso',
          'Recebemos seus dados. Assim que a abertura inicial do GEMplus estiver disponível, entraremos em contato.',
        );
        return;
      }

      const payload = {
        ...Object.fromEntries(formData.entries()),
        website: '',
        tempoPreenchimentoMs,
        timestamp: new Date().toISOString(),
        source: 'landing-gemplus',
        page: window.location.href,
        userAgent: navigator.userAgent,
      };

      if (formDisabled || !endpoint) {
        showFormStatus(
          formStatus,
          formStatusTitle,
          formStatusText,
          'Formulário temporariamente indisponível',
          officialContact?.dataset.contactHref
            ? 'O envio automático está desabilitado no momento. Use o contato oficial abaixo para saber mais sobre o lançamento.'
            : 'O envio automático está temporariamente desabilitado. Nenhum dado foi enviado a serviços externos nesta etapa de teste.',
        );
        return;
      }

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        waitlistForm.reset();
        startTime = Date.now();
        showFormStatus(
          formStatus,
          formStatusTitle,
          formStatusText,
          'Interesse registrado com sucesso',
          'Recebemos seus dados. Assim que a abertura inicial do GEMplus estiver disponível, entraremos em contato.',
        );
      } catch (error) {
        console.error('Form submission failed:', error);
        showFormStatus(
          formStatus,
          formStatusTitle,
          formStatusText,
          officialContact?.dataset.contactHref
            ? 'No momento, prefira falar com a equipe'
            : 'No momento, o envio não pôde ser concluído',
          officialContact?.dataset.contactHref
            ? 'Houve uma instabilidade no envio automático. Use o contato oficial abaixo para continuar a conversa.'
            : 'Houve uma instabilidade temporária no envio. Tente novamente mais tarde ou acompanhe os próximos avisos nesta página.',
        );
      }
    });
  }
});

function initializeMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', String(!isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
    });
  });
}

function initializeTheme(root) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && prefersDark);

  root.classList.toggle('dark', isDark);
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const iconSpan = document.getElementById('theme-icon');

  if (!iconSpan) {
    return;
  }

  iconSpan.innerHTML = isDark
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
}

function initializeOfficialContact(container, linkElement) {
  if (!container || !linkElement) {
    return;
  }

  const href = container.dataset.contactHref?.trim();
  const label = container.dataset.contactLabel?.trim();

  if (!href || !label) {
    return;
  }

  linkElement.href = href;
  linkElement.textContent = label;
  container.classList.remove('hidden');
}

function showFormStatus(container, titleElement, textElement, title, text) {
  titleElement.textContent = title;
  textElement.textContent = text;
  container.classList.remove('hidden');
}
