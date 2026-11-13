document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const fadeElements = document.querySelectorAll('.fade-in-section');

  initializeTheme(root);
  initializeMobileMenu();
  initializeRoleTabs();
  initializeScrollReveal(fadeElements);
  initializePhoneScroll();
  initializeWaitlistForm();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.classList.toggle('dark');
      localStorage.theme = isDark ? 'dark' : 'light';
      updateThemeIcon(isDark);
    });
  }
});

function initializeTheme(root) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && prefersDark);

  root.classList.toggle('dark', isDark);
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const iconSpan = document.getElementById('theme-icon');
  if (!iconSpan) return;

  iconSpan.innerHTML = isDark
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
}

function initializeMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');

  if (!toggle || !menu) return;

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

  // Fecha o menu ao clicar fora dele
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target) && !menu.classList.contains('hidden')) {
      menu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
    }
  });
}

function initializeRoleTabs() {
  const tabButtons = document.querySelectorAll('[data-role-tab]');
  const tabPanes = document.querySelectorAll('[data-role-pane]');

  if (tabButtons.length === 0 || tabPanes.length === 0) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetRole = btn.dataset.roleTab;

      // Atualiza botões
      tabButtons.forEach((b) => {
        b.classList.remove('is-active', 'bg-primary', 'text-primary-foreground', 'shadow-sm', 'shadow-lg');
        b.classList.add('text-foreground/70', 'hover:text-foreground');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('is-active', 'bg-primary', 'text-primary-foreground', 'shadow-sm');
      btn.classList.remove('text-foreground/70', 'hover:text-foreground');
      btn.setAttribute('aria-selected', 'true');

      // Atualiza painel visível
      tabPanes.forEach((pane) => {
        if (pane.dataset.rolePane === targetRole) {
          pane.classList.remove('hidden');
          setTimeout(() => pane.classList.add('is-active'), 10);
        } else {
          pane.classList.remove('is-active');
          pane.classList.add('hidden');
        }
      });
    });
  });
}

function initializeScrollReveal(elements) {
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  elements.forEach((el) => observer.observe(el));
}

function initializePhoneScroll() {
  const phoneScreens = document.querySelectorAll('.android-app-body, .android-content-area');
  phoneScreens.forEach((container) => {
    const device = container.closest('.android-device');
    let isDown = false;
    let startY = 0;
    let scrollTop = 0;
    let scrollTimer = null;

    // Detecta rolagem por roda do mouse ou trackpad
    container.addEventListener('scroll', () => {
      if (device) {
        device.classList.add('is-interacting');
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          device.classList.remove('is-interacting');
        }, 600);
      }
    }, { passive: true });

    // Arraste com clique do mouse
    container.addEventListener('mousedown', (e) => {
      isDown = true;
      startY = e.pageY - container.offsetTop;
      scrollTop = container.scrollTop;
      if (device) device.classList.add('is-interacting');
    });

    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      if (device) device.classList.remove('is-interacting');
    };

    window.addEventListener('mouseup', endDrag);
    container.addEventListener('mouseleave', endDrag);

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const y = e.pageY - container.offsetTop;
      const walk = (y - startY) * 1.5;
      container.scrollTop = scrollTop - walk;
    });

    // Interação por toque em celulares e tablets
    container.addEventListener('touchstart', () => {
      if (device) device.classList.add('is-interacting');
    }, { passive: true });

    container.addEventListener('touchend', () => {
      if (device) {
        setTimeout(() => {
          device.classList.remove('is-interacting');
        }, 500);
      }
    }, { passive: true });
  });
}

// Lista de espera: envia para o mesmo webhook n8n usado na landing de pré-lançamento (V1)
function initializeWaitlistForm() {
  const form = document.getElementById('waitlist-form');
  const errorBox = document.getElementById('form-error');
  const status = document.getElementById('form-status');
  const statusTitle = document.getElementById('form-status-title');
  const statusText = document.getElementById('form-status-text');
  if (!form || !status || !statusTitle || !statusText) return;

  const startTime = Date.now();
  const submitButton = form.querySelector('button[type="submit"]');

  const showError = (message) => {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
  };

  const showSuccess = () => {
    form.classList.add('hidden');
    statusTitle.textContent = 'Você está na lista!';
    statusText.textContent = 'Assim que o acesso ao GEM+ for liberado, avisaremos você por e-mail.';
    status.classList.remove('hidden');
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (errorBox) errorBox.classList.add('hidden');

    const data = new FormData(form);
    const nome = String(data.get('nome') || '').trim();
    const email = String(data.get('email') || '').trim();
    const profile = String(data.get('profile') || '');

    if (!nome || !email || !profile) {
      showError('Preencha nome, e-mail e perfil para entrar na lista.');
      return;
    }
    if (!form.querySelector('#waitlist-email').checkValidity()) {
      showError('Confira o e-mail digitado.');
      return;
    }

    // Honeypot: robôs preenchem o campo escondido; fingimos sucesso sem enviar nada
    if (String(data.get('website') || '').trim()) {
      showSuccess();
      return;
    }

    const endpoint = form.dataset.endpoint?.trim();
    if (!endpoint) {
      showError('O cadastro está temporariamente indisponível. Tente novamente mais tarde.');
      return;
    }

    const payload = {
      nome,
      email,
      profile,
      website: '',
      tempoPreenchimentoMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      source: 'landing-gemplus',
      versao: 'lista-de-espera',
      page: window.location.href,
      userAgent: navigator.userAgent,
    };

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Enviando...';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      form.reset();
      showSuccess();
    } catch (error) {
      console.error('Falha ao enviar para a lista de espera:', error);
      showError('Não foi possível enviar agora. Tente novamente em alguns minutos.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Entrar na lista';
      }
    }
  });
}
