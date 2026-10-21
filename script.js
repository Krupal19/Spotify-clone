const titles = [
  "Let me love you",
  "Track 02",
  "Track 03",
  "Track 04",
  "Track 05",
  "Track 06",
  "Track 07",
  "Track 08",
  "Track 09",
  "Track 10",
];
const tracks = Array.from({ length: 10 }, (_, index) => {
  const number = index + 1;
  const coverNumber = number === 1 ? 10 : number - 1;
  return {
    title: titles[index],
    source: `songs/${number}.mp3`,
    cover: `covers/${coverNumber}.jpg`,
    duration: null,
  };
});

const audio = new Audio();
audio.preload = "metadata";
audio.volume = 1;

const songItems = document.querySelector("#songItems");
const playButton = document.querySelector("#playButton");
const progressBar = document.querySelector("#songProgressBar");
const currentTimeLabel = document.querySelector("#currentTime");
const durationLabel = document.querySelector("#duration");
const playerStatus = document.querySelector("#playerStatus");
const shuffleButton = document.querySelector("#shuffleButton");
const repeatButton = document.querySelector("#repeatButton");
const volumeBar = document.querySelector("#volumeBar");
const muteButton = document.querySelector("#muteButton");
const offlineBanner = document.querySelector("#offlineBanner");
const onlineToast = document.querySelector("#onlineToast");
let currentTrackIndex = 0;
let trackRequestId = 0;
let shuffleEnabled = false;
let repeatMode = "off";
let previousVolume = 1;
let onlineToastTimer;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function renderTracks() {
  songItems.replaceChildren(
    ...tracks.map((track, index) => {
      const button = document.createElement("button");
      button.className = "songItem";
      button.type = "button";
      button.dataset.index = index;
      button.setAttribute("aria-label", `Play ${track.title}`);

      const cover = document.createElement("img");
      cover.src = track.cover;
      cover.alt = "";

      const title = document.createElement("span");
      title.className = "songTitle";
      title.textContent = track.title;

      const number = document.createElement("span");
      number.className = "songDuration";
      number.dataset.index = index;
      number.textContent = track.duration === null ? "--:--" : formatTime(track.duration);

      const icon = document.createElement("img");
      icon.src = "icons/play-circle-svgrepo-com.svg";
      icon.alt = "";

      const playIcon = document.createElement("span");
      playIcon.className = "songlistPlay";
      playIcon.setAttribute("aria-hidden", "true");
      playIcon.append(icon);

      button.append(cover, title, number, playIcon);
      button.addEventListener("click", () => {
        if (index === currentTrackIndex && !audio.paused) {
          audio.pause();
        } else {
          selectTrack(index, true);
        }
      });

      return button;
    }),
  );
}

function loadTrackDurations() {
  tracks.forEach((track, index) => {
    const metadataAudio = new Audio(track.source);
    metadataAudio.preload = "metadata";
    metadataAudio.addEventListener("loadedmetadata", () => {
      track.duration = metadataAudio.duration;
      const durationElement = document.querySelector(
        `.songDuration[data-index="${index}"]`,
      );
      if (durationElement) durationElement.textContent = formatTime(track.duration);
    });
    metadataAudio.addEventListener("error", () => {
      console.error(`Unable to load metadata for ${track.source}`);
    });
  });
}

function updatePlayState(isPlaying) {
  const icon = playButton.querySelector("img");
  icon.src = isPlaying
    ? "icons/pause-circle-svgrepo-com.svg"
    : "icons/play-circle-svgrepo-com.svg";
  playButton.setAttribute("aria-label", isPlaying ? "Pause" : "Play");

  document.querySelectorAll(".songItem").forEach((item, index) => {
    const isCurrentTrack = index === currentTrackIndex;
    item.classList.toggle("is-playing", isCurrentTrack && isPlaying);
    item.setAttribute(
      "aria-label",
      `${isCurrentTrack && isPlaying ? "Pause" : "Play"} ${tracks[index].title}`,
    );
    item.querySelector(".songlistPlay img").src =
      isCurrentTrack && isPlaying
        ? "icons/pause-circle-svgrepo-com.svg"
        : "icons/play-circle-svgrepo-com.svg";
  });
}

function showPlayerError(message) {
  playerStatus.textContent = message;
  playButton.disabled = true;
  progressBar.disabled = true;
  updatePlayState(false);
}

function selectTrack(index, autoplay) {
  currentTrackIndex = index;
  const track = tracks[index];
  const requestId = ++trackRequestId;

  audio.src = track.source;
  document.querySelector("#featuredCover").src = track.cover;
  document.querySelector("#playerCover").src = track.cover;
  document.querySelector("#featuredTitle").textContent = track.title;
  document.querySelector("#playerTitle").textContent = track.title;
  currentTimeLabel.textContent = "0:00";
  durationLabel.textContent = "0:00";
  progressBar.value = "0";
  progressBar.disabled = false;
  playButton.disabled = false;
  playerStatus.textContent = "";
  updatePlayState(false);

  if (autoplay) {
    audio.play().catch((error) => {
      if (requestId !== trackRequestId) return;
      showPlayerError("Unable to play this track.");
      console.error(`Unable to play ${track.source}:`, error);
    });
  }
}

function playNextTrack() {
  if (repeatMode === "one") {
    selectTrack(currentTrackIndex, true);
    return;
  }

  let nextIndex;
  if (shuffleEnabled) {
    nextIndex = Math.floor(Math.random() * (tracks.length - 1));
    if (nextIndex >= currentTrackIndex) nextIndex += 1;
  } else {
    nextIndex = currentTrackIndex + 1;
    if (nextIndex >= tracks.length) {
      if (repeatMode === "all") {
        nextIndex = 0;
      } else {
        audio.pause();
        audio.currentTime = 0;
        updatePlayState(false);
        return;
      }
    }
  }
  selectTrack(nextIndex, true);
}

renderTracks();
loadTrackDurations();
selectTrack(0, false);

playButton.addEventListener("click", () => {
  if (audio.paused) {
    const requestId = trackRequestId;
    audio.play().catch((error) => {
      if (requestId !== trackRequestId) return;
      showPlayerError("Unable to play this track.");
      console.error(`Unable to play ${tracks[currentTrackIndex].source}:`, error);
    });
  } else {
    audio.pause();
  }
});

document.querySelector("#previousButton").addEventListener("click", () => {
  const previousIndex =
    currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
  selectTrack(previousIndex, true);
});

document.querySelector("#nextButton").addEventListener("click", playNextTrack);

shuffleButton.addEventListener("click", () => {
  shuffleEnabled = !shuffleEnabled;
  shuffleButton.setAttribute("aria-pressed", String(shuffleEnabled));
  shuffleButton.setAttribute(
    "aria-label",
    shuffleEnabled ? "Shuffle on" : "Shuffle off",
  );
  shuffleButton.classList.toggle("is-active", shuffleEnabled);
});

repeatButton.addEventListener("click", () => {
  repeatMode =
    repeatMode === "off" ? "all" : repeatMode === "all" ? "one" : "off";
  const labels = {
    off: "Repeat off",
    all: "Repeat all",
    one: "Repeat one",
  };
  repeatButton.setAttribute("aria-label", labels[repeatMode]);
  repeatButton.setAttribute("aria-pressed", String(repeatMode !== "off"));
  repeatButton.classList.toggle("is-active", repeatMode !== "off");
  repeatButton.querySelector("img").src =
    repeatMode === "one"
      ? "icons/repeate-one-svgrepo-com.svg"
      : "icons/repeat-svgrepo-com.svg";
});

volumeBar.addEventListener("input", () => {
  const volume = Number(volumeBar.value) / 100;
  audio.volume = volume;
  if (volume > 0) previousVolume = volume;
  updateMuteState(volume === 0);
});

function updateMuteState(isMuted) {
  muteButton.setAttribute("aria-pressed", String(isMuted));
  muteButton.setAttribute("aria-label", isMuted ? "Unmute" : "Mute");
  muteButton.querySelector("img").src = isMuted
    ? "icons/volume-slash-svgrepo-com.svg"
    : "icons/volume-high-svgrepo-com.svg";
}

muteButton.addEventListener("click", () => {
  if (audio.volume > 0) {
    previousVolume = audio.volume;
    audio.volume = 0;
    volumeBar.value = "0";
    updateMuteState(true);
  } else {
    audio.volume = previousVolume || 1;
    volumeBar.value = String(Math.round(audio.volume * 100));
    updateMuteState(false);
  }
});

function updateNetworkStatus(showOnlineToast = true) {
  const isOffline = !navigator.onLine;
  offlineBanner.hidden = !isOffline;
  document.body.classList.toggle("network-offline", isOffline);
  if (isOffline) {
    onlineToast.hidden = true;
    clearTimeout(onlineToastTimer);
    return;
  }

  if (!showOnlineToast) {
    onlineToast.hidden = true;
    return;
  }

  onlineToast.hidden = false;
  clearTimeout(onlineToastTimer);
  onlineToastTimer = setTimeout(() => {
    onlineToast.hidden = true;
  }, 4500);
}

window.addEventListener("offline", updateNetworkStatus);
window.addEventListener("online", () => updateNetworkStatus(true));
updateNetworkStatus(false);

progressBar.addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) {
    audio.currentTime = (Number(progressBar.value) / 1000) * audio.duration;
  }
});

audio.addEventListener("loadedmetadata", () => {
  durationLabel.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTimeLabel.textContent = formatTime(audio.currentTime);
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    progressBar.value = String((audio.currentTime / audio.duration) * 1000);
  }
});

audio.addEventListener("play", () => {
  playerStatus.textContent = "";
  playButton.disabled = false;
  progressBar.disabled = false;
  updatePlayState(true);
});
audio.addEventListener("pause", () => updatePlayState(false));
audio.addEventListener("ended", playNextTrack);
audio.addEventListener("error", () => {
  showPlayerError("This track could not be loaded.");
  console.error(`Audio failed to load: ${tracks[currentTrackIndex].source}`);
});
