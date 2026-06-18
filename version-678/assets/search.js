(function () {
    var input = document.getElementById('movieSearch');
    var typeFilter = document.getElementById('typeFilter');
    var yearFilter = document.getElementById('yearFilter');
    var results = document.getElementById('searchResults');
    var count = document.getElementById('searchCount');
    var movies = window.MOVIES || [];
    var params = new URLSearchParams(window.location.search);

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function card(movie) {
        return [
            '<article class="movie-card">',
            '    <a class="poster-wrap" href="' + escapeHtml(movie.detail) + '" title="' + escapeHtml(movie.title) + '">',
            '        <img src="' + escapeHtml(movie.image) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '        <span class="score-pill">' + escapeHtml(movie.score) + '</span>',
            '    </a>',
            '    <div class="movie-info">',
            '        <div class="movie-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
            '        <h3><a href="' + escapeHtml(movie.detail) + '">' + escapeHtml(movie.title) + '</a></h3>',
            '        <p>' + escapeHtml(movie.one_line) + '</p>',
            '        <div class="tag-row"><span>' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
            '    </div>',
            '</article>'
        ].join('\n');
    }

    function populateYears() {
        var years = Array.from(new Set(movies.map(function (movie) {
            return movie.year;
        }).filter(Boolean))).sort().reverse();

        years.forEach(function (year) {
            var option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
    }

    function render() {
        var keyword = (input.value || '').trim().toLowerCase();
        var type = typeFilter.value;
        var year = yearFilter.value;

        var filtered = movies.filter(function (movie) {
            var haystack = [
                movie.title,
                movie.region,
                movie.type,
                movie.year,
                movie.genre,
                movie.tags,
                movie.one_line,
                movie.category
            ].join(' ').toLowerCase();

            return (!keyword || haystack.indexOf(keyword) !== -1)
                && (!type || movie.type.indexOf(type) !== -1)
                && (!year || movie.year === year);
        });

        count.textContent = '共找到 ' + filtered.length + ' 部影片，当前显示前 120 部。';
        results.innerHTML = filtered.slice(0, 120).map(card).join('\n');
    }

    populateYears();

    if (params.get('q')) {
        input.value = params.get('q');
    }

    input.addEventListener('input', render);
    typeFilter.addEventListener('change', render);
    yearFilter.addEventListener('change', render);

    render();
})();
