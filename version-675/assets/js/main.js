(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mainNav = document.querySelector('[data-main-nav]');

  if (menuButton && mainNav) {
    menuButton.addEventListener('click', function () {
      mainNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero-parallax]');
  if (hero) {
    window.addEventListener('scroll', function () {
      var offset = Math.min(window.scrollY * 0.22, 90);
      hero.style.backgroundPosition = 'center calc(50% + ' + offset + 'px)';
    }, { passive: true });
  }

  var params = new URLSearchParams(window.location.search);
  var query = params.get('q');
  var filterInput = document.querySelector('[data-filter-input]');
  if (query && filterInput) {
    filterInput.value = query;
  }

  var filterAreas = document.querySelectorAll('[data-filter-area]');
  filterAreas.forEach(function (area) {
    var input = area.querySelector('[data-filter-input]');
    var category = area.querySelector('[data-filter-category]');
    var year = area.querySelector('[data-filter-year]');
    var region = area.querySelector('[data-filter-region]');
    var section = area.closest('.content-section');
    var cards = section ? Array.prototype.slice.call(section.querySelectorAll('.movie-card')) : [];
    var empty = section ? section.querySelector('[data-no-result]') : null;

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilter() {
      var keyword = normalize(input ? input.value : '');
      var categoryValue = category ? category.value : '';
      var yearValue = year ? year.value : '';
      var regionValue = region ? region.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-title'));
        var cardCategory = card.getAttribute('data-category') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var cardRegion = card.getAttribute('data-region') || '';
        var matched = true;

        if (keyword && haystack.indexOf(keyword) === -1) {
          matched = false;
        }
        if (categoryValue && cardCategory !== categoryValue) {
          matched = false;
        }
        if (yearValue && cardYear !== yearValue) {
          matched = false;
        }
        if (regionValue && cardRegion !== regionValue) {
          matched = false;
        }

        card.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    [input, category, year, region].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  });

  document.querySelectorAll('.js-player').forEach(function (player) {
    var video = player.querySelector('video');
    var cover = player.querySelector('.play-cover');
    var src = player.getAttribute('data-video-src');
    var loaded = false;

    function start() {
      if (!video || !src) {
        return;
      }
      if (cover) {
        cover.classList.add('is-hidden');
      }
      if (!loaded) {
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
        } else {
          video.src = src;
        }
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener('click', start);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!loaded) {
          start();
        }
      });
    }
  });
})();
