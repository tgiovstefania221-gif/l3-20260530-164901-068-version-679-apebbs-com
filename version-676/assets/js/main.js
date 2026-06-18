(function () {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let activeSlide = 0;
  let heroTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeSlide);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeSlide);
    });
  }

  function scheduleHero() {
    if (heroTimer) {
      window.clearInterval(heroTimer);
    }

    if (slides.length > 1) {
      heroTimer = window.setInterval(function () {
        showSlide(activeSlide + 1);
      }, 5200);
    }
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
      scheduleHero();
    });
  });

  showSlide(0);
  scheduleHero();

  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', function () {
      const offset = Math.min(window.scrollY * 0.18, 90);
      hero.style.setProperty('--hero-shift', offset + 'px');
    }, { passive: true });
  }

  const searchForms = Array.from(document.querySelectorAll('[data-search-form]'));
  searchForms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      const input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
      }
    });
  });

  const filterInput = document.querySelector('[data-filter-input]');
  const cards = Array.from(document.querySelectorAll('[data-movie-card]'));
  const empty = document.querySelector('[data-no-results]');

  function applyFilter() {
    if (!filterInput || !cards.length) {
      return;
    }

    const value = filterInput.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach(function (card) {
      const text = (card.getAttribute('data-index') || card.textContent || '').toLowerCase();
      const matched = !value || text.indexOf(value) !== -1;
      card.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  }

  if (filterInput) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query) {
      filterInput.value = query;
    }
    filterInput.addEventListener('input', applyFilter);
    applyFilter();
  }
})();
