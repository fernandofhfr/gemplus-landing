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

  // Giros de cabeca (centro <-> canto) e loops de regencia de cada pose.
  const clips = {};
  const idles = {};
  stage.querySelectorAll('video[data-clip]').forEach((video) => {
    clips[video.dataset.clip] = video;
  });
  stage.querySelectorAll('video[data-idle]').forEach((video) => {
    idles[video.dataset.idle] = video;
  });

  const TURN_SPEED = 2.8;
  const FADE_MS = 200;
  const TARGET_DELAY_MS = 150;
  const FRAME = 1 / 24;
  const touchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const lookAroundOrder = ['ul', 'ur', 'dr', 'dl'];

  let pose = 'c';
  let target = 'c';
  let pendingTarget = 'c';
  let transit = null;
  let token = 0;
  let visible = true;
  let current = null;
  let wanted = null;
  let zIndex = 1;
  let targetTimer = null;
  let busyTimer = null;
  let lastInteraction = 0;
  let mouseSeen = false;
  let lookAroundIndex = 0;

  // Mostra o video por cima (fade-in) e so depois esconde o anterior: sem buracos no meio.
  function show(video) {
    if (current === video) {
      return;
    }

    const previous = current;
    video.style.zIndex = String(++zIndex);
    video.classList.add('is-active');
    stage.classList.add('is-playing');
    current = video;

    if (previous) {
      window.setTimeout(() => {
        if (current !== previous) {
          previous.classList.remove('is-active');
          previous.pause();
        }
      }, FADE_MS + 60);
    }
  }

  // Aparece assim que o video comeca a tocar. (requestVideoFrameCallback nao serve aqui:
  // um video com opacity 0 nao e composto e nunca dispara o callback.)
  function reveal(video, played) {
    wanted = video;

    // So mostra se ainda for o video pretendido (evita reexibir um clipe ja trocado).
    const showIfWanted = () => {
      if (wanted === video) {
        show(video);
      }
    };

    if (played && typeof played.then === 'function') {
      played.then(showIfWanted).catch(() => {});
    }

    window.setTimeout(showIfWanted, 250);
  }

  // Loop de regencia da pose atual (aparece quando nao ha giro em andamento).
  function showIdle() {
    const video = idles[pose];

    if (!video || video.readyState < 3 || current === video) {
      return;
    }

    video.loop = true;
    video.currentTime = 0;
    reveal(video, video.play());
  }

  // O retorno ao centro e o mesmo clipe de ida tocado ao contrario (arquivo invertido),
  // entao o quadro da posicao "t" na ida e o quadro "duracao - t" na volta.
  function startClip(name, offset = 0) {
    const video = clips[name];

    if (!video || video.readyState < 3) {
      return false;
    }

    const id = ++token;
    window.clearTimeout(busyTimer);

    if (transit && transit.video !== video) {
      transit.video.pause();
    }

    transit = { name, video, id };
    video.playbackRate = TURN_SPEED;

    const finish = () => {
      if (!transit || transit.id !== id) {
        return;
      }

      window.clearTimeout(busyTimer);
      pose = name.split('-')[1];
      transit = null;
      plan();
    };

    const go = () => {
      if (!transit || transit.id !== id) {
        return;
      }

      const played = video.play();
      reveal(video, played);

      if (played && typeof played.catch === 'function') {
        // Autoplay bloqueado (ex.: economia de bateria no iOS): mantem a pose estatica.
        played.catch(() => {
          if (transit && transit.id === id) {
            transit = null;
            target = pose;
            pendingTarget = pose;
          }
        });
      }
    };

    video.addEventListener('ended', finish, { once: true });
    // Rede de seguranca: se o navegador nao disparar 'ended', nao trava a animacao.
    busyTimer = window.setTimeout(finish, ((video.duration || 4) / TURN_SPEED) * 1000 + 1500);

    if (offset > 0.02) {
      video.addEventListener('seeked', go, { once: true });
      video.currentTime = offset;
    } else {
      video.currentTime = 0;
      go();
    }

    return true;
  }

  // Sem giro em andamento: segue para o destino (sempre passando pelo centro).
  function plan() {
    if (transit || !visible) {
      return;
    }

    if (pose === target) {
      showIdle();
      return;
    }

    const name = pose === 'c' ? `c-${target}` : `${pose}-c`;
    const video = clips[name];

    if (!video) {
      return;
    }

    // Clipe ainda nao baixou: tenta de novo quando estiver pronto.
    if (video.readyState < 3) {
      video.addEventListener('canplay', plan, { once: true });
      return;
    }

    startClip(name);
  }

  // O destino mudou no meio de um giro: inverte na hora, no mesmo quadro, sem tranco.
  function retarget() {
    if (!transit) {
      plan();
      return;
    }

    const [from, to] = transit.name.split('-');
    const video = transit.video;
    const offset = Math.max(0, (video.duration || 4) - video.currentTime - FRAME);

    if (from === 'c' && target !== to) {
      startClip(`${to}-c`, offset);
    } else if (to === 'c' && target === from) {
      startClip(`c-${from}`, offset);
    }
  }

  // Debounce curto: so vale o destino em que o cursor ficou por um instante.
  function setTarget(next) {
    if (next === pendingTarget) {
      return;
    }

    pendingTarget = next;
    window.clearTimeout(targetTimer);
    targetTimer = window.setTimeout(() => {
      target = pendingTarget;
      retarget();
    }, TARGET_DELAY_MS);
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

    // Perto da linha central so mantem o lado atual se ele ja estiver olhando para um canto;
    // vindo do centro, vale o lado real do cursor (sem memoria de um movimento antigo).
    let vertical = dy < 0 ? 'u' : 'd';
    let side = dx < 0 ? 'l' : 'r';

    if (pendingTarget !== 'c') {
      if (Math.abs(dy) < rect.height * 0.08) {
        vertical = pendingTarget[0];
      }

      if (Math.abs(dx) < rect.width * 0.12) {
        side = pendingTarget[1];
      }
    }

    return `${vertical}${side}`;
  }

  function onPointer(event) {
    lastInteraction = Date.now();

    // Qualquer movimento de mouse desliga a varredura automatica do olhar.
    if (event.pointerType === 'mouse') {
      mouseSeen = true;
    }

    setTarget(targetFromPoint(event.clientX, event.clientY));
  }

  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('pointerdown', onPointer, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => setTarget('c'));

  // Sem mouse: o maestro varre o olhar sozinho, a menos que a pessoa toque na tela.
  if (touchOnly) {
    window.setInterval(() => {
      if (mouseSeen || Date.now() - lastInteraction < 8000) {
        return;
      }

      lookAroundIndex = (lookAroundIndex + 1) % (lookAroundOrder.length + 1);
      setTarget(lookAroundOrder[lookAroundIndex] || 'c');
    }, 5000);
  }

  // Se algo atrasar um clipe, retoma sozinho quando o destino ainda nao foi alcancado.
  window.setInterval(() => {
    if (!transit) {
      plan();
    }
  }, 1000);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;

      // Fora da tela so o loop de regencia para; um giro em andamento termina normalmente.
      if (!visible && current?.loop) {
        current.pause();
        return;
      }

      if (visible && current?.loop) {
        current.play().catch(() => {});
      }

      plan();
    }, { threshold: 0.1 }).observe(stage);
  }

  // Carrega depois da pagina: primeiro o loop do centro, depois os giros que saem do centro.
  function loadVideos() {
    const order = [
      idles.c,
      ...Object.keys(clips).filter((name) => name.startsWith('c-')).map((name) => clips[name]),
      ...Object.keys(clips).filter((name) => !name.startsWith('c-')).map((name) => clips[name]),
      ...Object.keys(idles).filter((name) => name !== 'c').map((name) => idles[name]),
    ].filter(Boolean);

    order.forEach((video, index) => {
      window.setTimeout(() => {
        video.src = video.dataset.src;
        video.load();

        if (video === idles.c) {
          video.addEventListener('canplay', plan, { once: true });
        }
      }, index * 200);
    });
  }

  if (document.readyState === 'complete') {
    loadVideos();
  } else {
    window.addEventListener('load', () => window.setTimeout(loadVideos, 300), { once: true });
  }
}
