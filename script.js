/* -----------------------------------------------------------------
   1. STICKY HEADER
   Watches when the hero section leaves the viewport and shows a
   sticky bar — hides it again when the user scrolls back up
   ----------------------------------------------------------------- */
const stickyHeader = document.getElementById('sticky-header');
const heroSection  = document.querySelector('.product-hero');

if (stickyHeader && heroSection) {
  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      // entry.isIntersecting is true when hero is visible, false when scrolled past
      stickyHeader.classList.toggle('visible', !entry.isIntersecting);
    },
    { threshold: 0 }
  );
  heroObserver.observe(heroSection);
}


/* -----------------------------------------------------------------
   2. HERO IMAGE CAROUSEL
   Slides between product images using translateX on the track.
   Auto-plays every 3.5s — resets the timer if the user clicks an arrow.
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
    // Wrap around at both ends
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    current = index;

    // Each slide is 100% wide, so multiplying by 100% shifts exactly one slide
    track.style.transform = `translateX(-${current * 100}%)`;

    // Keep dots in sync with the active slide
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (btnNext) btnNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  if (btnPrev) btnPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });

  // Clicking a dot jumps straight to that slide
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 3500);
  }
  function resetAuto() {
    // Clear and restart so manual interaction doesn't fight the auto-play timer
    clearInterval(autoTimer);
    startAuto();
  }

  // Swipe support — only fires if the horizontal drag is more than 50px
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
   Clones the first and last cards and inserts them at opposite ends.
   When the track lands on a clone, it silently jumps to the real card
   so the loop feels seamless with no visible snap.
   ----------------------------------------------------------------- */
(function initAppCarousel() {
  const track   = document.querySelector('.app-track');
  const btnNext = document.getElementById('appNext');
  const btnPrev = document.getElementById('appPrev');
  if (!track || !btnNext || !btnPrev) return;

  const originalCards = Array.from(track.querySelectorAll('.app-card'));
  if (!originalCards.length) return;

  // Clone first → append to end, clone last → prepend to start
  const firstClone = originalCards[0].cloneNode(true);
  const lastClone  = originalCards[originalCards.length - 1].cloneNode(true);
  firstClone.setAttribute('aria-hidden', 'true'); // hide clones from screen readers
  lastClone.setAttribute('aria-hidden', 'true');
  track.appendChild(firstClone);
  track.insertBefore(lastClone, originalCards[0]);

  // Layout: [lastClone] [card1] [card2] ... [cardN] [firstClone]
  // Start at index 1 so we're on the first real card
  let currentIndex    = 1;
  let isTransitioning = false;

  function getCardWidth() {
    // Measure live — accounts for gap and window resize
    const card = track.querySelector('.app-card');
    return card ? card.offsetWidth + 20 : 320;
  }

  function setPosition(animated) {
    track.style.transition = animated
      ? 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      : 'none'; // skip animation when silently jumping between real/clone cards
    track.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
  }

  // Drop into position on first paint with no animation
  requestAnimationFrame(() => setPosition(false));

  function goTo(index) {
    if (isTransitioning) return; // block rapid clicking mid-transition
    isTransitioning = true;
    currentIndex = index;
    setPosition(true);
  }

  // Once the CSS transition finishes, check if we landed on a clone
  // and silently jump to the matching real card
  track.addEventListener('transitionend', () => {
    const total = track.querySelectorAll('.app-card').length;
    if (currentIndex === 0) {
      currentIndex = total - 2; // was on lastClone, jump to real last
      setPosition(false);
    } else if (currentIndex === total - 1) {
      currentIndex = 1; // was on firstClone, jump to real first
      setPosition(false);
    }
    isTransitioning = false;
  });

  btnNext.addEventListener('click', () => goTo(currentIndex + 1));
  btnPrev.addEventListener('click', () => goTo(currentIndex - 1));

  // Keyboard support on the arrow buttons
  [btnNext, btnPrev].forEach((btn) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn === btnNext ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
      }
    });
  });

  // Swipe support
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

  // Recalculate card widths after a window resize so position stays accurate
  window.addEventListener('resize', () => setPosition(false));
})();


/* -----------------------------------------------------------------
   4. FAQ ACCORDION
   Closes any open item before opening the clicked one.
   Keyboard: Enter/Space toggles, Up/Down arrows move focus between questions.
   ----------------------------------------------------------------- */
(function initFAQ() {
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));

  faqItems.forEach((item, idx) => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.setAttribute('tabindex', '0');
    // Reflect the initial open/closed state in the ARIA attribute
    question.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');

    question.addEventListener('click', () => toggleFAQ(item));

    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQ(item);
      }
      // Arrow keys move focus — makes the FAQ keyboard-navigable without a mouse
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
    // Close everything first so only one item can be open at a time
    faqItems.forEach((fi) => {
      fi.classList.remove('active');
      fi.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
    });
    // Re-open only if it wasn't already open (clicking an open item closes it)
    if (!isOpen) {
      activeItem.classList.add('active');
      activeItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'true');
    }
  }
})();


/* -----------------------------------------------------------------
   5. PROCESS TABS
   Clicking a tab marks it active and hides the rest.
   Arrow keys cycle through tabs — standard ARIA tablist pattern.
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
      // Only the active tab is reachable via Tab key
      t.setAttribute('tabindex', active ? '0' : '-1');
    });
  }
})();


/* -----------------------------------------------------------------
   6. LAZY LOAD IMAGES
   Images using data-src are only fetched once they're near the viewport.
   The 200px root margin starts loading them just before they'd be visible.
   ----------------------------------------------------------------- */
(function initLazyLoad() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (!lazyImages.length) return;

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        img.src = img.dataset.src; // swap data-src into real src to trigger the network fetch
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.removeAttribute('data-src');
        img.classList.add('img-loaded'); // CSS uses this to fade the image in
        observer.unobserve(img); // stop watching once it's loaded
      });
    },
    { rootMargin: '200px 0px', threshold: 0 }
  );

  lazyImages.forEach((img) => imageObserver.observe(img));
})();


/* -----------------------------------------------------------------
   7. SMOOTH NAV SCROLL
   Uses requestAnimationFrame with custom easing instead of
   CSS scroll-behavior: smooth — that global property causes a
   noticeable lag when the user tries to scroll manually.
   This only kicks in on anchor link clicks, so normal scrolling stays instant.
   ----------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return; // skip the logo link

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    // Read the actual navbar height so the section isn't hidden under the sticky bar
    const navHeight = document.querySelector('.main-header')?.offsetHeight || 70;
    const startTop  = window.scrollY;
    const targetTop = target.getBoundingClientRect().top + startTop - navHeight;
    const distance  = targetTop - startTop;
    const duration  = 800; // ms — tweak if it feels too fast or too slow
    let startTime   = null;

    function easeInOutCubic(t) {
      // Starts slow, speeds up in the middle, slows again at the end
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
   On first visit checks the OS-level dark mode preference.
   After that, remembers the user's manual choice in localStorage.
   ----------------------------------------------------------------- */
(function initDarkMode() {
  const btn  = document.getElementById('themeToggle');
  const root = document.documentElement;

  const saved  = localStorage.getItem('theme');
  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const initial = saved || system; // saved choice always wins over system default

  // data-theme on <html> lets all the [data-theme="dark"] CSS selectors take over
  root.setAttribute('data-theme', initial);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next); // persist so the choice survives a page reload
    });
  }
})();