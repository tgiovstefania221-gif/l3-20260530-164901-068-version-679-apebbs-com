(function () {
  const toggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const next = hero.querySelector('[data-hero-next]');
    const prev = hero.querySelector('[data-hero-prev]');
    let index = 0;
    let timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const target = Number(dot.getAttribute('data-hero-dot'));
        showSlide(target);
        startTimer();
      });
    });

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    startTimer();
  }

  const localGrid = document.querySelector('[data-local-grid]');

  if (localGrid) {
    const searchInput = document.querySelector('[data-local-search]');
    const genreSelect = document.querySelector('[data-local-genre]');
    const yearSelect = document.querySelector('[data-local-year]');
    const cards = Array.from(localGrid.querySelectorAll('.movie-card'));

    function filterLocalCards() {
      const keyword = (searchInput && searchInput.value || '').trim().toLowerCase();
      const genre = (genreSelect && genreSelect.value || '').trim();
      const year = (yearSelect && yearSelect.value || '').trim();

      cards.forEach(function (card) {
        const haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year')
        ].join(' ').toLowerCase();
        const matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        const matchesGenre = !genre || (card.getAttribute('data-genre') || '') === genre;
        const matchesYear = !year || (card.getAttribute('data-year') || '') === year;
        card.style.display = matchesKeyword && matchesGenre && matchesYear ? '' : 'none';
      });
    }

    [searchInput, genreSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', filterLocalCards);
        control.addEventListener('change', filterLocalCards);
      }
    });
  }

  const searchApp = document.getElementById('search-app');

  if (searchApp) {
    const keywordInput = document.getElementById('search-keyword');
    const regionSelect = document.getElementById('search-region');
    const genreSelect = document.getElementById('search-genre');
    const yearSelect = document.getElementById('search-year');
    const results = document.getElementById('search-results');
    const status = document.getElementById('search-status');
    let movies = [];

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function movieCard(movie) {
      const tags = (movie.tags || []).slice(0, 3).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');
      const image = escapeHtml(movie.image) + '.jpg';

      return [
        '<article class="movie-card">',
        '  <a class="poster-link" href="' + escapeHtml(movie.url) + '" aria-label="观看 ' + escapeHtml(movie.title) + '">',
        '    <span class="poster-fallback">' + escapeHtml(String(movie.title || '').slice(0, 4)) + '</span>',
        '    <img src="' + image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" onerror="this.style.display=\'none\';">',
        '    <span class="year-badge">' + escapeHtml(movie.year) + '</span>',
        '    <span class="poster-shade"></span>',
        '    <span class="play-dot">▶</span>',
        '  </a>',
        '  <div class="movie-info">',
        '    <h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
        '    <p class="meta-line">' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.type) + ' · ' + escapeHtml(movie.genre) + '</p>',
        '    <p class="one-line">' + escapeHtml(movie.oneLine) + '</p>',
        '    <div class="tag-row">' + tags + '</div>',
        '  </div>',
        '</article>'
      ].join('\n');
    }

    function render() {
      const keyword = (keywordInput.value || '').trim().toLowerCase();
      const region = regionSelect.value;
      const genre = genreSelect.value;
      const year = yearSelect.value;

      const filtered = movies.filter(function (movie) {
        const haystack = [
          movie.title,
          movie.region,
          movie.type,
          movie.genre,
          movie.year,
          movie.oneLine,
          (movie.tags || []).join(' ')
        ].join(' ').toLowerCase();

        return (!keyword || haystack.indexOf(keyword) !== -1) &&
          (!region || movie.region === region) &&
          (!genre || String(movie.genre).indexOf(genre) !== -1 || (movie.tags || []).indexOf(genre) !== -1) &&
          (!year || String(movie.year) === year);
      });

      status.textContent = '共找到 ' + filtered.length + ' 部影片，当前显示前 ' + Math.min(filtered.length, 120) + ' 部。';
      results.innerHTML = filtered.slice(0, 120).map(movieCard).join('\n');
    }

    fetch('assets/movies.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        movies = data;
        render();
      })
      .catch(function () {
        status.textContent = '影片数据载入失败，请确认 assets/movies.json 存在。';
      });

    [keywordInput, regionSelect, genreSelect, yearSelect].forEach(function (control) {
      control.addEventListener('input', render);
      control.addEventListener('change', render);
    });
  }
})();
