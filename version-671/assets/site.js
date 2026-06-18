(function() {
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-main-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function() {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-dot]"));
    if (!slides.length) {
      return;
    }
    var active = 0;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle("is-active", i === active);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle("is-active", i === active);
      });
    }

    dots.forEach(function(dot, i) {
      dot.addEventListener("click", function() {
        show(i);
      });
    });

    window.setInterval(function() {
      show(active + 1);
    }, 5600);
  }

  function textOf(card, name) {
    return (card.getAttribute("data-" + name) || "").toLowerCase();
  }

  function initFilters() {
    document.querySelectorAll("[data-filter-root]").forEach(function(root) {
      var input = root.querySelector("[data-filter-input]");
      var region = root.querySelector("[data-filter-region]");
      var year = root.querySelector("[data-filter-year]");
      var genre = root.querySelector("[data-filter-genre]");
      var cards = Array.prototype.slice.call(root.querySelectorAll("[data-filter-card]"));
      var empty = root.querySelector("[data-filter-empty]");

      if (input) {
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q");
        if (initialQuery) {
          input.value = initialQuery;
        }
      }

      function apply() {
        var q = input ? input.value.trim().toLowerCase() : "";
        var r = region ? region.value.toLowerCase() : "";
        var y = year ? year.value.toLowerCase() : "";
        var g = genre ? genre.value.toLowerCase() : "";
        var visible = 0;

        cards.forEach(function(card) {
          var haystack = [
            textOf(card, "title"),
            textOf(card, "region"),
            textOf(card, "year"),
            textOf(card, "genre"),
            textOf(card, "type")
          ].join(" ");
          var ok = true;
          if (q && haystack.indexOf(q) === -1) {
            ok = false;
          }
          if (r && textOf(card, "region").indexOf(r) === -1) {
            ok = false;
          }
          if (y && textOf(card, "year").indexOf(y) === -1) {
            ok = false;
          }
          if (g && textOf(card, "genre").indexOf(g) === -1) {
            ok = false;
          }
          card.style.display = ok ? "" : "none";
          if (ok) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      [input, region, year, genre].forEach(function(el) {
        if (!el) {
          return;
        }
        el.addEventListener("input", apply);
        el.addEventListener("change", apply);
      });

      apply();
    });
  }

  window.initMoviePlayer = function(streamUrl) {
    var video = document.getElementById("moviePlayer");
    var button = document.getElementById("moviePlayButton");
    if (!video || !streamUrl) {
      return;
    }
    var loaded = false;
    var hlsInstance = null;

    function startVideo() {
      var playTask = video.play();
      if (playTask && typeof playTask.catch === "function") {
        playTask.catch(function() {
          if (button) {
            button.classList.remove("is-hidden");
          }
        });
      }
    }

    function attachAndPlay() {
      if (loaded) {
        startVideo();
        return;
      }
      loaded = true;
      if (button) {
        button.classList.add("is-hidden");
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        video.addEventListener("loadedmetadata", startVideo, { once: true });
        video.load();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          maxBufferLength: 32,
          enableWorker: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, startVideo);
        return;
      }

      video.src = streamUrl;
      video.addEventListener("loadedmetadata", startVideo, { once: true });
      video.load();
    }

    if (button) {
      button.addEventListener("click", attachAndPlay);
    }

    video.addEventListener("click", function() {
      if (!loaded || video.paused) {
        attachAndPlay();
      }
    });

    window.addEventListener("beforeunload", function() {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };

  onReady(function() {
    initNav();
    initHero();
    initFilters();
  });
})();
