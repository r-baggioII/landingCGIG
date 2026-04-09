/* ============================================
   CGIC — Centro de Gestión Integral de Crisis
   v2 — Multi-page Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Preloader ──
  const preloader = document.querySelector('.preloader');
  const dismiss = () => setTimeout(() => preloader?.classList.add('hidden'), 300);
  window.addEventListener('load', dismiss);
  if (document.readyState === 'complete') dismiss();

  // ── Navbar scroll ──
  const navbar = document.getElementById('navbar');
  // On sub-pages the navbar starts with .scrolled; on index it toggles
  const isIndex = !navbar?.classList.contains('scrolled');

  function handleScroll() {
    if (!navbar || !isIndex) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ── Mobile menu ──
  const toggle  = document.getElementById('nav-toggle');
  const links   = document.getElementById('nav-links');
  const overlay = document.getElementById('mobile-overlay');

  function closeMenu() {
    toggle?.classList.remove('active');
    links?.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle?.addEventListener('click', () => {
    const open = links?.classList.toggle('active');
    toggle.classList.toggle('active', open);
    overlay?.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  overlay?.addEventListener('click', closeMenu);

  document.querySelectorAll('.navbar__link').forEach(a => {
    a.addEventListener('click', () => {
      if (links?.classList.contains('active')) closeMenu();
    });
  });

  // ── Smooth scroll (only for in-page anchors) ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        closeMenu();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ── Scroll-reveal (IntersectionObserver) ──
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children');

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => revealObs.observe(el));

  // ── Animated counters ──
  const counts = document.querySelectorAll('.count-up');

  function animate(el) {
    const raw    = el.dataset.target;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const target = parseFloat(raw);
    const dur    = 1600;
    const start  = performance.now();

    (function step(now) {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = prefix + Math.round(ease * target).toLocaleString('es-AR') + suffix;
      if (t < 1) requestAnimationFrame(step);
    })(start);
  }

  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animate(e.target); cntObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });

  counts.forEach(el => cntObs.observe(el));

  // ── Back to top ──
  const btt = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    btt?.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── Hero parallax (index only) ──
  const mesh = document.querySelector('.hero__mesh');
  if (mesh) {
    window.addEventListener('mousemove', e => {
      const x = (e.clientX / innerWidth - .5) * 18;
      const y = (e.clientY / innerHeight - .5) * 18;
      mesh.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }

  // ── Contact form → mailto ──
  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form).entries());
    const subj = encodeURIComponent(`Contacto CGIC - ${d.type || 'General'}`);
    const body = encodeURIComponent(
      `Nombre: ${d.name}\nEmail: ${d.email}\nOrg: ${d.org || '-'}\nMotivo: ${d.type}\n\n${d.message}`
    );
    window.location.href = `mailto:cgic.argentina@gmail.com?subject=${subj}&body=${body}`;
  });

  // ── ESC closes mobile menu ──
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // ── Hero Slider ──
  const slides  = document.querySelectorAll('.hero__slide');
  const dots    = document.querySelectorAll('.hero__slider-dot');
  const btnPrev = document.getElementById('slider-prev');
  const btnNext = document.getElementById('slider-next');

  if (slides.length > 1) {
    let current = 0;
    let timer   = null;
    const DELAY = 5000;

    function goTo(idx) {
      slides[current].classList.remove('hero__slide--active');
      dots[current]?.classList.remove('hero__slider-dot--active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('hero__slide--active');
      dots[current]?.classList.add('hero__slider-dot--active');
    }

    function start() {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), DELAY);
    }

    function pause() { clearInterval(timer); }

    btnNext?.addEventListener('click', () => { goTo(current + 1); start(); });
    btnPrev?.addEventListener('click', () => { goTo(current - 1); start(); });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goTo(Number(dot.dataset.index));
        start();
      });
    });

    // Pausa al hover sobre el slider
    const sliderEl = document.getElementById('hero-slider');
    sliderEl?.addEventListener('mouseenter', pause);
    sliderEl?.addEventListener('mouseleave', start);

    // Swipe táctil
    let touchX = 0;
    sliderEl?.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    sliderEl?.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) { goTo(dx < 0 ? current + 1 : current - 1); start(); }
    }, { passive: true });

    start();
  }

  // ── Lightbox ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox__close');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.timeline__gallery img').forEach(img => {
      img.addEventListener('click', () => {
        lightbox.classList.add('show');
        lightboxImg.src = img.src;
      });
    });

    lightboxClose?.addEventListener('click', () => {
      lightbox.classList.remove('show');
      setTimeout(() => { lightboxImg.src = ''; }, 300); // clear after animation
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target !== lightboxImg) {
        lightbox.classList.remove('show');
        setTimeout(() => { lightboxImg.src = ''; }, 300);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('show')) {
        lightbox.classList.remove('show');
        setTimeout(() => { lightboxImg.src = ''; }, 300);
      }
    });
  }

});

