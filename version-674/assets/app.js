(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobileMenu = document.querySelector("[data-mobile-menu]");

    if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", function () {
        mobileMenu.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));

    if (slides.length > 1) {
      var current = 0;
      var showSlide = function (index) {
        current = index % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      };

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          showSlide(index);
        });
      });

      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    var filterInput = document.querySelector("[data-filter-input]");
    var filterList = document.querySelector("[data-filter-list]");

    if (filterInput && filterList) {
      var cards = Array.prototype.slice.call(filterList.querySelectorAll("[data-card]"));
      filterInput.addEventListener("input", function () {
        var keyword = filterInput.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = card.textContent.toLowerCase();
          card.classList.toggle("is-filtered-out", keyword && text.indexOf(keyword) === -1);
        });
      });
    }

    var video = document.querySelector("video[data-video]");
    var playButton = document.querySelector("[data-play-button]");

    if (video) {
      var streamUrl = video.getAttribute("data-video");
      var initialized = false;

      var loadStream = function () {
        if (initialized || !streamUrl) {
          return;
        }

        initialized = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
        } else {
          video.src = streamUrl;
        }
      };

      var startPlay = function () {
        loadStream();
        if (playButton) {
          playButton.classList.add("is-hidden");
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {});
        }
      };

      if (playButton) {
        playButton.addEventListener("click", startPlay);
      }

      video.addEventListener("click", function () {
        if (video.paused) {
          startPlay();
        }
      });

      video.addEventListener("play", function () {
        if (playButton) {
          playButton.classList.add("is-hidden");
        }
      });
    }
  });
})();
