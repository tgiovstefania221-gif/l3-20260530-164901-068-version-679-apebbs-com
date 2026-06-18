(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var button = document.querySelector(".menu-toggle");
    if (!button) {
      return;
    }
    button.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    start();
  }

  function setupSearch() {
    var input = document.querySelector("[data-search-input]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-text]"));
    var filters = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));

    if (!input || !cards.length) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || input.value || "";
    input.value = query;

    function apply(value) {
      var keyword = String(value || "").trim().toLowerCase();
      cards.forEach(function (card) {
        var text = card.getAttribute("data-search-text") || "";
        card.classList.toggle("is-hidden", keyword && text.indexOf(keyword) === -1);
      });
    }

    input.addEventListener("input", function () {
      apply(input.value);
    });

    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        input.value = button.getAttribute("data-filter") || "";
        apply(input.value);
      });
    });

    apply(query);
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupSearch();
  });
})();
