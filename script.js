/* -----------------------------------------------------------------
   1. STICKY HEADER
   ----------------------------------------------------------------- */
const stickyHeader = document.getElementById('sticky-header');
const heroSection  = document.querySelector('.product-hero');

if (stickyHeader && heroSection) {
  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      stickyHeader.classList.toggle('visible', !entry.isIntersecting);
    },
    { threshold: 0 }
  );
  heroObserver.observe(heroSection);
}


/* -----------------------------------------------------------------
   2. HERO IMAGE CAROUSEL
   - Slides between multiple product images
   - Auto-plays every 3.5s, Arrow buttons, dot navigation, touch/swipe support
   ----------------------------------------------------------------- */
(function initHeroCarousel() {
  const track   = document.querySelector('.hero-track');
  const dots    = document.querySelectorAll('.hero-dot');
  const btnNext = document.getElementById('heroNext');
  const btnPrev = document.getElementById('heroPrev');

  if (!track) return;

  const slides = track.querySelectorAll('.hero-slide');
  if (!slides.length) return;

  let current   = 0;
  let autoTimer = null;

  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (btnNext) btnNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  if (btnPrev) btnPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });

  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 3500);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
      resetAuto();
    }
  });

  goTo(0);
  startAuto();
})();


/* -----------------------------------------------------------------
   3. APPLICATIONS CAROUSEL — Infinite loop
   - Clones first + last cards for seamless wrapping
   - Arrow buttons + touch/swipe support
   ----------------------------------------------------------------- */
(function initAppCarousel() {
  const track   = document.querySelector('.app-track');
  const btnNext = document.getElementById('appNext');
  const btnPrev = document.getElementById('appPrev');
  if (!track || !btnNext || !btnPrev) return;

  const originalCards = Array.from(track.querySelectorAll('.app-card'));
  if (!originalCards.length) return;

  const firstClone = originalCards[0].cloneNode(true);
  const lastClone  = originalCards[originalCards.length - 1].cloneNode(true);
  firstClone.setAttribute('aria-hidden', 'true');
  lastClone.setAttribute('aria-hidden', 'true');
  track.appendChild(firstClone);
  track.insertBefore(lastClone, originalCards[0]);

  let currentIndex    = 1;
  let isTransitioning = false;

  function getCardWidth() {
    const card = track.querySelector('.app-card');
    return card ? card.offsetWidth + 20 : 320;
  }

  function setPosition(animated) {
    track.style.transition = animated
      ? 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      : 'none';
    track.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
  }

  requestAnimationFrame(() => setPosition(false));

  function goTo(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex = index;
    setPosition(true);
  }

  track.addEventListener('transitionend', () => {
    const total = track.querySelectorAll('.app-card').length;
    if (currentIndex === 0) {
      currentIndex = total - 2;
      setPosition(false);
    } else if (currentIndex === total - 1) {
      currentIndex = 1;
      setPosition(false);
    }
    isTransitioning = false;
  });

  btnNext.addEventListener('click', () => goTo(currentIndex + 1));
  btnPrev.addEventListener('click', () => goTo(currentIndex - 1));

  [btnNext, btnPrev].forEach((btn) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn === btnNext ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
      }
    });
  });

  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
    }
  });

  window.addEventListener('resize', () => setPosition(false));
})();


/* -----------------------------------------------------------------
   4. FAQ ACCORDION
   - Click or Enter/Space to toggle
   - Arrow Up/Down to move between questions
   ----------------------------------------------------------------- */
(function initFAQ() {
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));

  faqItems.forEach((item, idx) => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.setAttribute('tabindex', '0');
    question.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');

    question.addEventListener('click', () => toggleFAQ(item));

    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQ(item);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        faqItems[idx + 1]?.querySelector('.faq-question')?.focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        faqItems[idx - 1]?.querySelector('.faq-question')?.focus();
      }
    });
  });

  function toggleFAQ(activeItem) {
    const isOpen = activeItem.classList.contains('active');
    faqItems.forEach((fi) => {
      fi.classList.remove('active');
      fi.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      activeItem.classList.add('active');
      activeItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'true');
    }
  }
})();


/* -----------------------------------------------------------------
   5. PROCESS TABS
   - Arrow Left/Right cycles through tabs
   ----------------------------------------------------------------- */
(function initProcessTabs() {
  const tabs = Array.from(document.querySelectorAll('.process-tabs .tab'));
  if (!tabs.length) return;

  const tabList = document.querySelector('.process-tabs');
  if (tabList) tabList.setAttribute('role', 'tablist');

  tabs.forEach((tab, i) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
    tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');

    tab.addEventListener('click', () => activateTab(i));
    tab.addEventListener('keydown', (e) => {
      let next = i;
      if (e.key === 'ArrowRight') { e.preventDefault(); next = (i + 1) % tabs.length; }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); next = (i - 1 + tabs.length) % tabs.length; }
      if (e.key === 'Home')       { e.preventDefault(); next = 0; }
      if (e.key === 'End')        { e.preventDefault(); next = tabs.length - 1; }
      if (next !== i) { activateTab(next); tabs[next].focus(); }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateTab(i); }
    });
  });

  function activateTab(index) {
    tabs.forEach((t, i) => {
      const active = i === index;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
      t.setAttribute('tabindex', active ? '0' : '-1');
    });
  }
})();


/* -----------------------------------------------------------------
   6. LAZY LOAD IMAGES — IntersectionObserver
   ----------------------------------------------------------------- */
(function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (!lazyImages.length) return;

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.removeAttribute('data-src');
        img.classList.add('img-loaded');
        observer.unobserve(img);
      });
    },
    { rootMargin: '200px 0px', threshold: 0 }
  );

  lazyImages.forEach((img) => imageObserver.observe(img));
})();


/* -----------------------------------------------------------------
   7. SMOOTH NAV SCROLL
   - Custom easing — no CSS scroll-behavior needed
   - Accounts for sticky navbar height automatically
   ----------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = document.querySelector('.main-header')?.offsetHeight || 70;
    const startTop  = window.scrollY;
    const targetTop = target.getBoundingClientRect().top + startTop - navHeight;
    const distance  = targetTop - startTop;
    const duration  = 800;
    let startTime   = null;

    function easeInOutCubic(t) {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startTop + distance * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  });
});


/* -----------------------------------------------------------------
   8. DARK MODE TOGGLE
   - Saves preference to localStorage
   - Respects system preference on first visit
   ----------------------------------------------------------------- */
(function initDarkMode() {
  const btn  = document.getElementById('themeToggle');
  const root = document.documentElement;

  // Check saved preference, then system preference
  const saved  = localStorage.getItem('theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const initial = saved || system;

  root.setAttribute('data-theme', initial);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
})();