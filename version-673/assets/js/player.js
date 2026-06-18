(function () {
  function resolveElements() {
    return {
      video: document.getElementById("movie-video"),
      button: document.getElementById("movie-play-button")
    };
  }

  function attach(video, source) {
    if (video.getAttribute("data-ready") === "true") {
      return;
    }

    video.setAttribute("data-ready", "true");

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      video._hls = hls;
      return;
    }

    video.src = source;
  }

  function playVideo(video, button, source) {
    attach(video, source);
    if (button) {
      button.classList.add("is-hidden");
    }
    var playback = video.play();
    if (playback && typeof playback.catch === "function") {
      playback.catch(function () {
        if (button) {
          button.classList.remove("is-hidden");
        }
      });
    }
  }

  window.initializeMoviePlayer = function (source) {
    var elements = resolveElements();
    var video = elements.video;
    var button = elements.button;

    if (!video || !source) {
      return;
    }

    video.addEventListener("play", function () {
      if (button) {
        button.classList.add("is-hidden");
      }
    });

    video.addEventListener("click", function () {
      if (video.paused) {
        playVideo(video, button, source);
      }
    });

    if (button) {
      button.addEventListener("click", function () {
        playVideo(video, button, source);
      });
    }
  };
})();
