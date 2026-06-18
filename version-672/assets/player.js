import { H as Hls } from './hls-vendor.js';

(function () {
  const shell = document.querySelector('[data-player-shell]');

  if (!shell) {
    return;
  }

  const video = shell.querySelector('video[data-video-src]');
  const button = shell.querySelector('[data-play-button]');
  const message = shell.querySelector('[data-player-message]');
  let hlsInstance = null;
  let initialized = false;

  function setMessage(text) {
    if (message) {
      message.textContent = text || '';
    }
  }

  function initializePlayer() {
    if (!video || initialized) {
      return;
    }

    const source = video.getAttribute('data-video-src');

    if (!source) {
      setMessage('未检测到播放源。');
      return;
    }

    initialized = true;
    setMessage('正在加载高清线路…');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.addEventListener('loadedmetadata', function () {
        setMessage('');
        video.play().catch(function () {
          setMessage('请再次点击播放按钮开始播放。');
        });
      }, { once: true });
      return;
    }

    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);

      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
        setMessage('');
        video.play().catch(function () {
          setMessage('请再次点击播放按钮开始播放。');
        });
      });

      hlsInstance.on(Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          setMessage('网络加载异常，正在尝试恢复。');
          hlsInstance.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          setMessage('媒体解码异常，正在尝试恢复。');
          hlsInstance.recoverMediaError();
        } else {
          setMessage('当前浏览器无法播放该线路。');
          hlsInstance.destroy();
        }
      });
    } else {
      setMessage('当前浏览器暂不支持该播放方式。');
    }
  }

  if (button) {
    button.addEventListener('click', function () {
      button.classList.add('hidden');
      initializePlayer();
    });
  }

  video.addEventListener('play', function () {
    if (button) {
      button.classList.add('hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
