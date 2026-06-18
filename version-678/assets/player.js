import { H as Hls } from './hls.js';

function initPlayer(box) {
    var video = box.querySelector('video');
    var button = box.querySelector('[data-play-button]');
    var status = box.querySelector('[data-player-status]');
    var src = box.getAttribute('data-src');
    var hls = null;

    function setStatus(text) {
        if (status) {
            status.textContent = text;
        }
    }

    function play() {
        if (!src) {
            setStatus('暂未找到播放源。');
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            setStatus('正在使用浏览器原生 HLS 播放。');
        } else if (Hls && Hls.isSupported && Hls.isSupported()) {
            if (!hls) {
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(src);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    setStatus('播放源加载完成。');
                    video.play().catch(function () {
                        setStatus('请再次点击播放按钮。');
                    });
                });
                hls.on(Hls.Events.ERROR, function (_event, data) {
                    if (data && data.fatal) {
                        setStatus('播放加载遇到网络或媒体错误。');
                    }
                });
            }
        } else {
            video.src = src;
            setStatus('当前浏览器不支持 HLS.js，已尝试直接加载播放源。');
        }

        box.classList.add('is-playing');
        video.play().catch(function () {
            setStatus('播放已准备，请在播放器控件中继续播放。');
        });
    }

    if (button) {
        button.addEventListener('click', play);
    }

    video.addEventListener('play', function () {
        box.classList.add('is-playing');
    });
}

document.querySelectorAll('[data-player]').forEach(initPlayer);
