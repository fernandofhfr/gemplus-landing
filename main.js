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
  initializeMaestro();

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

function initializeMaestro() {
  const stage = document.querySelector('[data-maestro]');

  if (!stage) {
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;

  // Sem movimento (ou economia de dados): fica a pose frontal estatica.
  if (reducedMotion || saveData) {
    return;
  }

  const clips = {};
  stage.querySelectorAll('video[data-clip]').forEach((video) => {
    clips[video.dataset.clip] = video;
  });

  const touchOnly = window.matchMedia('(hover: none)').matches;
  const lookAroundOrder = ['ul', 'ur', 'dr', 'dl'];

  let pose = 'c';
  let target = 'c';
  let pendingTarget = 'c';
  let busy = false;
  let visible = true;
  let activeClip = null;
  let targetTimer = null;
  let busyTimer = null;
  let side = 'r';
  let vertical = 'u';
  let lastInteraction = 0;
  let lookAroundIndex = 0;

  // A pose e sempre alcancada por um clipe inteiro: do centro para o canto e de volta.
  function nextClipName() {
    if (pose === target) {
      return null;
    }

    return pose === 'c' ? `c-${target}` : `${pose}-c`;
  }

  function pump() {
    if (busy || !visible) {
      return;
    }

    const name = nextClipName();
    const video = name && clips[name];

    if (!video) {
      return;
    }

    // Clipe ainda nao baixou: tenta de novo quando estiver pronto.
    if (video.readyState < 3) {
      video.addEventListener('canplay', pump, { once: true });
      return;
    }

    busy = true;
    video.currentTime = 0;

    const reveal = () => {
      if (activeClip && activeClip !== video) {
        activeClip.classList.remove('is-active');
        activeClip.pause();
        activeClip.currentTime = 0;
      }

      video.classList.add('is-active');
      stage.classList.add('is-playing');
      activeClip = video;
    };

    const played = video.play();

    if (video.requestVideoFrameCallback) {
      video.requestVideoFrameCallback(reveal);
    } else {
      video.addEventListener('playing', reveal, { once: true });
    }

    let finished = false;
    const finish = () => {
      if (finished) {
        return;
      }

      finished = true;
      window.clearTimeout(busyTimer);
      pose = name.split('-')[1];
      busy = false;
      pump();
    };

    video.addEventListener('ended', finish, { once: true });
    // Rede de seguranca: se o navegador nao disparar 'ended', nao trava a animacao.
    busyTimer = window.setTimeout(finish, 6000);

    if (played && typeof played.catch === 'function') {
      // Autoplay bloqueado (ex.: economia de bateria no iOS): mantem a pose estatica.
      played.catch(() => {
        finished = true;
        window.clearTimeout(busyTimer);
        busy = false;
        target = pose;
        pendingTarget = pose;
      });
    }
  }

  // Debounce: so vale o destino em que o cursor ficou por 150 ms.
  function setTarget(next) {
    if (next === pendingTarget) {
      return;
    }

    pendingTarget = next;
    window.clearTimeout(targetTimer);
    targetTimer = window.setTimeout(() => {
      target = pendingTarget;
      pump();
    }, 150);
  }

  // Direcao do olhar relativa ao rosto do maestro, nao ao centro da tela.
  function targetFromPoint(x, y) {
    const rect = stage.getBoundingClientRect();
    const dx = x - (rect.left + rect.width * 0.5);
    const dy = y - (rect.top + rect.height * 0.28);

    const overStage = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    // Mouse em cima dele ou perto do rosto: olha de frente para quem esta navegando.
    if (overStage || (Math.abs(dx) < rect.width * 0.35 && Math.abs(dy) < rect.height * 0.12)) {
      return 'c';
    }

    if (Math.abs(dx) > rect.width * 0.12) {
      side = dx < 0 ? 'l' : 'r';
    }

    if (Math.abs(dy) > rect.height * 0.08) {
      vertical = dy < 0 ? 'u' : 'd';
    }

    return `${vertical}${side}`;
  }

  function onPointer(event) {
    lastInteraction = Date.now();
    setTarget(targetFromPoint(event.clientX, event.clientY));
  }

  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('pointerdown', onPointer, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => setTarget('c'));

  // Sem mouse: o maestro varre o olhar sozinho, a menos que a pessoa toque na tela.
  if (touchOnly) {
    window.setInterval(() => {
      if (Date.now() - lastInteraction < 8000) {
        return;
      }

      lookAroundIndex = (lookAroundIndex + 1) % (lookAroundOrder.length + 1);
      setTarget(lookAroundOrder[lookAroundIndex] || 'c');
    }, 4500);
  }

  // Se algo atrasar um clipe, retoma sozinho quando o destino ainda nao foi alcancado.
  window.setInterval(pump, 1000);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;

      if (visible) {
        pump();
      }
    }, { threshold: 0.1 }).observe(stage);
  }

  // Carrega os clipes depois da pagina: primeiro os que saem do centro.
  function loadClips() {
    const names = Object.keys(clips).sort((a, b) => Number(b.startsWith('c-')) - Number(a.startsWith('c-')));

    names.forEach((name, index) => {
      window.setTimeout(() => {
        const video = clips[name];
        video.src = video.dataset.src;
        video.load();
      }, index * 250);
    });
  }

  if (document.readyState === 'complete') {
    loadClips();
  } else {
    window.addEventListener('load', () => window.setTimeout(loadClips, 300), { once: true });
  }
}
