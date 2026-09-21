const AUDIO_STORAGE_KEY = "toolPlayerState";

document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("my-audio");
    if (!audio) return;

    const playBtn = document.getElementById("play-btn");     // only exists on index.html
    const pauseBtn = document.getElementById("pause-btn");   // only exists on index.html
    const miniBtn = document.getElementById("mini-play-pause");

    function updateMiniButton() {
        if (!miniBtn) return;
        miniBtn.textContent = audio.paused ? "▶" : "⏸";
        miniBtn.setAttribute("aria-label", audio.paused ? "Play music" : "Pause music");
    }

    function saveState() {
        localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify({
            playing: !audio.paused,
            time: audio.currentTime,
            savedAt: Date.now()
        }));
    }

    function playAudio() {
        audio.play().catch(function () {
            // Browser blocked autoplay on this fresh page load.
            // currentTime is already set correctly, so one click resumes right on time.
            updateMiniButton();
        });
    }

    if (playBtn) playBtn.addEventListener("click", playAudio);
    if (pauseBtn) pauseBtn.addEventListener("click", function () { audio.pause(); });
    if (miniBtn) {
        miniBtn.addEventListener("click", function () {
            audio.paused ? playAudio() : audio.pause();
        });
    }

    audio.addEventListener("play", function () { updateMiniButton(); saveState(); });
    audio.addEventListener("pause", function () { updateMiniButton(); saveState(); });

    // Keep the saved position fresh, and definitely save right as you navigate away
    setInterval(saveState, 1000);
    window.addEventListener("pagehide", saveState);

    // Resume from wherever the last page left off
    const raw = localStorage.getItem(AUDIO_STORAGE_KEY);
    if (!raw) {
        updateMiniButton();
        return;
    }

    try {
        const state = JSON.parse(raw);
        let targetTime = state.time || 0;
        if (state.playing) {
            targetTime += (Date.now() - state.savedAt) / 1000;
        }

        const applyTime = function () {
            if (isFinite(audio.duration) && targetTime < audio.duration) {
                audio.currentTime = targetTime;
            }
            audio.removeEventListener("loadedmetadata", applyTime);
            if (state.playing) playAudio();
            updateMiniButton();
        };

        if (audio.readyState >= 1) {
            applyTime();
        } else {
            audio.addEventListener("loadedmetadata", applyTime);
        }
    } catch (e) {
        updateMiniButton();
    }
});