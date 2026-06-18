(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (!hero) {
        return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
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

    function restart() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
            show(current + 1);
        }, 5200);
    }

    if (prev) {
        prev.addEventListener('click', function () {
            show(current - 1);
            restart();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            show(current + 1);
            restart();
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            show(Number(dot.getAttribute('data-hero-dot')));
            restart();
        });
    });

    restart();
})();
