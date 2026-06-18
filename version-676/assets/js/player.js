(function () {
  const players = Array.from(document.querySelectorAll('[data-player]'));

  players.forEach(function (player) {
    const video = player.querySelector('video');
    const cover = player.querySelector('[data-player-cover]');
    const sourceElement = video ? video.querySelector('source') : null;
    const source = sourceElement ? sourceElement.getAttribute('src') : '';
    let hlsInstance = null;

    function setup() {
      if (!video || !source || player.getAttribute('data-ready') === 'true') {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }

      player.setAttribute('data-ready', 'true');
    }

    function play() {
      setup();
      if (!video) {
        return;
      }

      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener('click', function () {
        cover.classList.add('is-hidden');
        play();
      });
    }

    if (video) {
      video.addEventListener('play', function () {
        if (cover) {
          cover.classList.add('is-hidden');
        }
      });
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
