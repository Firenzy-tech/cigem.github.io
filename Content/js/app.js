/* =========================================================
   CIGEM · Interacciones del sitio principal (index.html)
   - Desplazamiento suave en enlaces internos (comportamiento original)
   - Menú móvil (#navToggle / #navMenu)
   - Carrusel del hero (función global changeSlide usada por onclick)
   ========================================================= */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  /* ---------- Menú de navegación móvil ---------- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  var header = document.querySelector('.main-header');

  function setMenu(open) {
    if (!navToggle || !navMenu) return;
    navMenu.classList.toggle('active', open);
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('nav-open', open);
  }

  function closeMenu() {
    if (navMenu && navMenu.classList.contains('active')) setMenu(false);
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      setMenu(!navMenu.classList.contains('active'));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        setMenu(false);
        navToggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!navMenu.classList.contains('active')) return;
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) setMenu(false);
    });

    var desktopQuery = window.matchMedia('(min-width: 1024px)');
    var onDesktopChange = function (mq) { if (mq.matches) setMenu(false); };
    if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', onDesktopChange);
    else if (desktopQuery.addListener) desktopQuery.addListener(onDesktopChange);

    // Cierra el menú al navegar a otra página (p. ej. "Certificado")
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---------- Sombra del header al hacer scroll ---------- */
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Pequeña animación suave al hacer clic en los enlaces del menú ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var hash = this.getAttribute('href');
      if (!hash || hash === '#') return;
      var target;
      try { target = document.querySelector(hash); } catch (err) { target = null; }
      if (!target) return; // Sin destino: se conserva el comportamiento nativo
      e.preventDefault();
      closeMenu();
      target.scrollIntoView({
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
      });
      if (history.replaceState) history.replaceState(null, '', hash);
    });
  });

  /* ---------- Carrusel del hero ---------- */
  var carousel = document.querySelector('.hero .carousel');
  var slides = carousel ? Array.prototype.slice.call(carousel.querySelectorAll('.carousel-slide')) : [];
  var current = Math.max(0, slides.findIndex(function (s) { return s.classList.contains('active'); }));
  var AUTOPLAY_MS = 6500;
  var timer = null;
  var userPaused = false;
  var hoverPaused = false;
  var dots = [];
  var dotsWrap = null;
  var pauseBtn = null;

  function isUsable(slide) {
    return !slide.classList.contains('is-broken');
  }

  function usableCount() {
    return slides.filter(isUsable).length;
  }

  function render() {
    slides.forEach(function (slide, i) {
      var active = i === current;
      slide.classList.toggle('active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    dots.forEach(function (dot, i) {
      var active = i === current;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  function goTo(index) {
    if (!slides.length || !usableCount()) return;
    var n = slides.length;
    current = ((index % n) + n) % n;
    render();
  }

  function step(direction) {
    if (!slides.length || !usableCount()) return;
    var n = slides.length;
    var next = current;
    for (var i = 0; i < n; i++) {
      next = ((next + direction) % n + n) % n;
      if (isUsable(slides[next])) break;
    }
    goTo(next);
  }

  function stopAutoplay() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function startAutoplay() {
    stopAutoplay();
    if (userPaused || hoverPaused || prefersReducedMotion.matches || usableCount() < 2) return;
    timer = setInterval(function () { step(1); }, AUTOPLAY_MS);
  }

  // API global usada por los botones con onclick="changeSlide(±1)"
  window.changeSlide = function (direction) {
    step(Number(direction) || 1);
    startAutoplay();
  };

  function syncDotVisibility() {
    dots.forEach(function (dot, i) { dot.hidden = !isUsable(slides[i]); });
    if (dotsWrap) dotsWrap.hidden = usableCount() < 2;
    if (pauseBtn) pauseBtn.hidden = usableCount() < 2 || prefersReducedMotion.matches;
  }

  function markBroken(slide) {
    if (slide.classList.contains('is-broken')) return;
    slide.classList.add('is-broken');
    syncDotVisibility();
    if (slides[current] === slide) step(1);
  }

  if (carousel && slides.length) {
    // Indicadores
    dotsWrap = document.createElement('div');
    dotsWrap.className = 'carousel-dots';
    dotsWrap.setAttribute('role', 'group');
    dotsWrap.setAttribute('aria-label', 'Seleccionar imagen');
    slides.forEach(function (slide, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Ir a la imagen ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); startAutoplay(); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
    carousel.appendChild(dotsWrap);

    // Pausa / reproducción (WCAG 2.2.2)
    pauseBtn = document.createElement('button');
    pauseBtn.type = 'button';
    pauseBtn.className = 'carousel-pause';
    pauseBtn.setAttribute('aria-label', 'Pausar carrusel');
    pauseBtn.innerHTML = '<i class="bi bi-pause-fill" aria-hidden="true"></i>';
    pauseBtn.addEventListener('click', function () {
      userPaused = !userPaused;
      pauseBtn.setAttribute('aria-label', userPaused ? 'Reanudar carrusel' : 'Pausar carrusel');
      pauseBtn.innerHTML = userPaused
        ? '<i class="bi bi-play-fill" aria-hidden="true"></i>'
        : '<i class="bi bi-pause-fill" aria-hidden="true"></i>';
      if (userPaused) stopAutoplay(); else startAutoplay();
    });
    carousel.appendChild(pauseBtn);

    // Las diapositivas cuya imagen no carga se omiten de la rotación
    slides.forEach(function (slide) {
      var img = slide.querySelector('img');
      if (!img) return;
      img.addEventListener('error', function () { markBroken(slide); });
      img.addEventListener('load', function () {
        if (slide.classList.contains('is-broken')) {
          slide.classList.remove('is-broken');
          syncDotVisibility();
        }
      });
      if (img.complete && img.naturalWidth === 0 && img.currentSrc) markBroken(slide);
    });

    // Pausa al interactuar
    carousel.addEventListener('mouseenter', function () { hoverPaused = true; stopAutoplay(); });
    carousel.addEventListener('mouseleave', function () { hoverPaused = false; startAutoplay(); });
    carousel.addEventListener('focusin', function () { hoverPaused = true; stopAutoplay(); });
    carousel.addEventListener('focusout', function (e) {
      if (!carousel.contains(e.relatedTarget)) { hoverPaused = false; startAutoplay(); }
    });

    // Gestos táctiles (deslizar)
    var touchX = null;
    carousel.addEventListener('touchstart', function (e) {
      touchX = e.touches[0].clientX;
    }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 45) window.changeSlide(dx < 0 ? 1 : -1);
    }, { passive: true });

    // Flechas del teclado cuando el foco está en el carrusel
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); window.changeSlide(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); window.changeSlide(1); }
    });

    // Detiene la rotación cuando la pestaña no está visible
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopAutoplay(); else startAutoplay();
    });

    var onMotionChange = function () { syncDotVisibility(); startAutoplay(); };
    if (prefersReducedMotion.addEventListener) prefersReducedMotion.addEventListener('change', onMotionChange);
    else if (prefersReducedMotion.addListener) prefersReducedMotion.addListener(onMotionChange);

    render();
    syncDotVisibility();
    startAutoplay();
  }

  /* ---------- Revelado suave de secciones ---------- */
  var revealTargets = document.querySelectorAll('.section-header, .card, .about-image, .about-content, .contact-form');
  if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealTargets.forEach(function (el) { io.observe(el); });
  }
})();
