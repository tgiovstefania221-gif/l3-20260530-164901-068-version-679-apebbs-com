(function() {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    ready(function() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");

        if (toggle && panel) {
            toggle.addEventListener("click", function() {
                panel.classList.toggle("open");
            });
        }

        document.querySelectorAll("[data-search-form]").forEach(function(form) {
            form.addEventListener("submit", function(event) {
                var input = form.querySelector("input[name='q']");
                var query = input ? input.value.trim() : "";
                if (!query) {
                    event.preventDefault();
                    window.location.href = "./search.html";
                }
            });
        });

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var index = 0;

            function show(next) {
                if (!slides.length) {
                    return;
                }
                index = (next + slides.length) % slides.length;
                slides.forEach(function(slide, slideIndex) {
                    slide.classList.toggle("active", slideIndex === index);
                });
                dots.forEach(function(dot, dotIndex) {
                    dot.classList.toggle("active", dotIndex === index);
                });
            }

            dots.forEach(function(dot) {
                dot.addEventListener("click", function() {
                    show(Number(dot.getAttribute("data-hero-dot")) || 0);
                });
            });

            window.setInterval(function() {
                show(index + 1);
            }, 5200);
        }

        document.querySelectorAll("[data-page-filter]").forEach(function(form) {
            var input = form.querySelector("[data-card-search]");
            var list = document.querySelector("[data-card-list]");
            if (!input || !list) {
                return;
            }

            var params = new URLSearchParams(window.location.search);
            var initial = params.get("q") || "";
            if (initial) {
                input.value = initial;
            }

            function applyFilter() {
                var query = normalize(input.value);
                var tokens = query.split(/\s+/).filter(Boolean);
                list.querySelectorAll("[data-card]").forEach(function(card) {
                    var haystack = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-tags"),
                        card.textContent
                    ].join(" "));
                    var matched = tokens.every(function(token) {
                        return haystack.indexOf(token) !== -1;
                    });
                    card.classList.toggle("is-hidden", tokens.length > 0 && !matched);
                });
            }

            form.addEventListener("submit", function(event) {
                event.preventDefault();
                applyFilter();
            });
            input.addEventListener("input", applyFilter);
            applyFilter();
        });
    });
})();
