(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function initMenu() {
        var button = document.querySelector(".menu-toggle");
        var panel = document.querySelector(".mobile-panel");
        if (!button || !panel) {
            return;
        }
        button.addEventListener("click", function () {
            var isOpen = panel.hasAttribute("hidden") === false;
            if (isOpen) {
                panel.setAttribute("hidden", "");
                button.setAttribute("aria-expanded", "false");
            } else {
                panel.removeAttribute("hidden");
                button.setAttribute("aria-expanded", "true");
            }
        });
    }

    function initHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(root.querySelectorAll(".hero-dot"));
        var previous = root.querySelector(".hero-prev");
        var next = root.querySelector(".hero-next");
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-slide")) || 0);
                restart();
            });
        });

        if (previous) {
            previous.addEventListener("click", function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                restart();
            });
        }

        show(0);
        restart();
    }

    function initFilters() {
        var containers = Array.prototype.slice.call(document.querySelectorAll("[data-card-container]"));
        if (!containers.length) {
            return;
        }
        var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-card-filter]"));
        var sorters = Array.prototype.slice.call(document.querySelectorAll("[data-sort-cards]"));
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";

        inputs.forEach(function (input) {
            if (query && !input.value) {
                input.value = query;
            }
            input.addEventListener("input", applyFilter);
        });

        sorters.forEach(function (select) {
            select.addEventListener("change", applySort);
        });

        function getQuery() {
            var active = inputs.find(function (input) {
                return input.value.trim();
            });
            return active ? active.value.trim().toLowerCase() : "";
        }

        function applyFilter() {
            var value = getQuery();
            containers.forEach(function (container) {
                Array.prototype.slice.call(container.children).forEach(function (card) {
                    var haystack = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
                    card.classList.toggle("is-filtered-out", Boolean(value) && haystack.indexOf(value) === -1);
                });
            });
        }

        function applySort() {
            var mode = this.value;
            containers.forEach(function (container) {
                var cards = Array.prototype.slice.call(container.children);
                cards.sort(function (a, b) {
                    var ay = Number(a.getAttribute("data-year")) || 0;
                    var by = Number(b.getAttribute("data-year")) || 0;
                    var ah = Number(a.getAttribute("data-heat")) || 0;
                    var bh = Number(b.getAttribute("data-heat")) || 0;
                    if (mode === "year-asc") {
                        return ay - by || bh - ah;
                    }
                    if (mode === "heat-desc") {
                        return bh - ah || by - ay;
                    }
                    return by - ay || bh - ah;
                });
                cards.forEach(function (card) {
                    container.appendChild(card);
                });
            });
        }

        if (sorters[0]) {
            applySort.call(sorters[0]);
        }
        applyFilter();
    }

    function initPlayer(source) {
        var video = document.getElementById("movie-player");
        var overlay = document.getElementById("player-overlay");
        if (!video || !source) {
            return;
        }
        var started = false;
        var hlsInstance = null;

        function attachSource() {
            if (started) {
                return;
            }
            started = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function playVideo() {
            attachSource();
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener("click", playVideo);
        }
        video.addEventListener("click", function () {
            if (!started || video.paused) {
                playVideo();
            }
        });
        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        });
        window.addEventListener("pagehide", function () {
            if (hlsInstance && typeof hlsInstance.destroy === "function") {
                hlsInstance.destroy();
            }
        });
    }

    window.StaticMoviePlayer = {
        init: initPlayer
    };

    ready(function () {
        initMenu();
        initHero();
        initFilters();
    });
})();
