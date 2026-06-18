(function() {
    function initMoviePlayer(videoId, overlayId, sourceUrl) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        var hlsInstance = null;

        if (!video || !overlay || !sourceUrl) {
            return;
        }

        function bindSource() {
            if (video.getAttribute("data-bound") === "1") {
                return;
            }

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = sourceUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(sourceUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = sourceUrl;
            }

            video.setAttribute("data-bound", "1");
        }

        function startPlayback() {
            bindSource();
            overlay.classList.add("is-hidden");
            video.setAttribute("controls", "controls");
            var playTask = video.play();
            if (playTask && typeof playTask.catch === "function") {
                playTask.catch(function() {});
            }
        }

        overlay.addEventListener("click", startPlayback);
        video.addEventListener("click", function() {
            if (video.paused) {
                startPlayback();
            }
        });
        video.addEventListener("play", function() {
            overlay.classList.add("is-hidden");
        });
        window.addEventListener("pagehide", function() {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;
})();
