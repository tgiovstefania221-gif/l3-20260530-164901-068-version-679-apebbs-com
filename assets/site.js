(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function setSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function startTimer() {
            clearInterval(timer);
            timer = setInterval(function () {
                setSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                setSlide(index);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                setSlide(current - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                setSlide(current + 1);
                startTimer();
            });
        }

        setSlide(0);
        startTimer();
    }

    var filterInput = document.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
    var regionFilter = document.querySelector('[data-region-filter]');
    var yearFilter = document.querySelector('[data-year-filter]');
    var genreFilter = document.querySelector('[data-genre-filter]');

    function uniqueValues(name) {
        var values = [];
        cards.forEach(function (card) {
            var raw = card.getAttribute(name) || '';
            raw.split(/[，,、/|\s]+/).forEach(function (part) {
                var value = part.trim();
                if (value && values.indexOf(value) === -1) {
                    values.push(value);
                }
            });
        });
        return values.slice(0, 80).sort();
    }

    function fillSelect(select, values) {
        if (!select) {
            return;
        }
        values.forEach(function (value) {
            var option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    }

    fillSelect(regionFilter, uniqueValues('data-region'));
    fillSelect(yearFilter, uniqueValues('data-year'));
    fillSelect(genreFilter, uniqueValues('data-genre'));

    function paramsQuery() {
        try {
            return new URLSearchParams(window.location.search).get('q') || '';
        } catch (error) {
            return '';
        }
    }

    if (filterInput && paramsQuery()) {
        filterInput.value = paramsQuery();
    }

    function applyFilter() {
        if (!cards.length) {
            return;
        }
        var query = filterInput ? filterInput.value.trim().toLowerCase() : '';
        var region = regionFilter ? regionFilter.value : '';
        var year = yearFilter ? yearFilter.value : '';
        var genre = genreFilter ? genreFilter.value : '';

        cards.forEach(function (card) {
            var haystack = [
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-tags'),
                card.getAttribute('data-category')
            ].join(' ').toLowerCase();
            var matchedQuery = !query || haystack.indexOf(query) !== -1;
            var matchedRegion = !region || (card.getAttribute('data-region') || '').indexOf(region) !== -1;
            var matchedYear = !year || (card.getAttribute('data-year') || '').indexOf(year) !== -1;
            var matchedGenre = !genre || (card.getAttribute('data-genre') || '').indexOf(genre) !== -1;
            card.classList.toggle('is-hidden', !(matchedQuery && matchedRegion && matchedYear && matchedGenre));
        });
    }

    [filterInput, regionFilter, yearFilter, genreFilter].forEach(function (element) {
        if (element) {
            element.addEventListener('input', applyFilter);
            element.addEventListener('change', applyFilter);
        }
    });
    applyFilter();

    var video = document.querySelector('[data-player]');
    var overlay = document.querySelector('[data-play-overlay]');
    var playerStarted = false;
    var hlsInstance = null;

    function startPlayer() {
        if (!video) {
            return;
        }
        var stream = video.getAttribute('data-stream');
        if (!stream) {
            return;
        }
        if (!playerStarted) {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
            } else {
                video.src = stream;
            }
            playerStarted = true;
        }
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {});
        }
    }

    if (overlay) {
        overlay.addEventListener('click', startPlayer);
    }

    if (video) {
        video.addEventListener('click', function () {
            if (!playerStarted || video.paused) {
                startPlayer();
            }
        });
        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }
})();
