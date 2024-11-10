import VJ_DATA from "./Settings.js";
import MediaManager from "./MediaManager.js";
import ShiftKeyListener from "./ShiftKeyListener.js";
import BPMCounter from "./BPMCounter.js";

const mediaManager = new MediaManager(VJ_DATA, () => {
  sendToProjectionWindow();
});

const shiftListener = new ShiftKeyListener(
  () => {
    document.body.classList.add("shift");
  },
  () => {
    document.body.classList.remove("shift");
  }
);

const bpmcounter = new BPMCounter((bpm) => {
  bpm = parseFloat(bpm.toFixed(1));
  document.getElementById("bpm").value = bpm;
  VJ_DATA.beatEffect.bpm = bpm;
  sendToProjectionWindow();
});

let projectionWindow;

window.addEventListener("load", () => {
  initEventListeners();
  openProjectionWindow();
});

function initEventListeners() {
  document.querySelector("#open-projection").addEventListener("click", () => {
    openProjectionWindow();
  });

  // Medias
  const medias = document.querySelector("#medias");
  const mediasInput = medias.querySelector("input[type=file]");

  medias.addEventListener("dragover", (event) => {
    event.preventDefault();
    medias.classList.add("highlight");
  });

  medias.addEventListener("dragleave", () => {
    medias.classList.remove("highlight");
  });

  medias.addEventListener("drop", (event) => {
    event.preventDefault();
    medias.classList.remove("highlight");

    loadMedias(event.dataTransfer.files);
  });

  mediasInput.addEventListener("change", (event) => {
    loadMedias(event.target.files);
  });

  document.querySelector("#add-media").addEventListener("click", () => {
    mediasInput.click();
  });

  // Center Text
  initInput("#text", VJ_DATA.centerText, "text", (e) => {
    return e.target.value;
  });
  addAutoCompleteBehavior("#font");
  initInput("#font", VJ_DATA.centerText, "font", (e) => {
    return e.target.value;
  });
  initInput("#font-size", VJ_DATA.centerText, "fontSize", (e) => {
    return parseInt(e.target.value);
  });
  initInput("#text-color", VJ_DATA.centerText, "textColor", (e) => {
    return e.target.value;
  });
  initInput("#back-color", VJ_DATA.centerText, "backColor", (e) => {
    return e.target.value;
  });
  initInput("#back-opacity", VJ_DATA.centerText, "backOpacity", (e) => {
    return parseInt(e.target.value);
  });

  // Media Effect
  initInput("#bg-color", VJ_DATA.mediaEffect, "bgColor", (e) => {
    return e.target.value;
  });
  initInput("#media-effect", VJ_DATA.mediaEffect, "type", (e) => {
    const type = e.target.value;
    const settings = document.querySelectorAll(".media-effect-option");
    const tileSettings = document.querySelectorAll(".media-effect-tile-option");
    if (type === "none") {
      settings.forEach((e) => e.classList.add("hidden"));
      tileSettings.forEach((e) => e.classList.add("hidden"));
    } else {
      settings.forEach((e) => e.classList.remove("hidden"));
      if (type === "tile") {
        tileSettings.forEach((e) => e.classList.remove("hidden"));
      } else {
        tileSettings.forEach((e) => e.classList.add("hidden"));
      }
    }
    return type;
  });
  initInput("#media-display", VJ_DATA.mediaEffect, "mediaDisplay", (e) => {
    return e.target.value;
  });
  initInput("#tile-count", VJ_DATA.mediaEffect, "tileCount", (e) => {
    return Math.max(2, Math.min(6, parseInt(e.target.value)));
  });
  initInput("#aspect-ratio", VJ_DATA.mediaEffect, "aspectRatio", (e) => {
    return e.target.value;
  });
  initInput("#invert-color", VJ_DATA.mediaEffect, "invertColor", (e) => {
    const value = e.target.checked;
    const target = document.getElementById("beat-invert-color").parentElement;
    if (value) {
      target.style.display = "block";
    } else {
      target.style.display = "none";
    }
    return value;
  });

  // Beat Effect
  initInput("#bpm", VJ_DATA.beatEffect, "bpm", (e) => {
    return parseFloat(e.target.value);
  });
  document.querySelector("#measure-bpm").addEventListener("click", (e) => {
    bpmcounter.recordTimestamp();
  });
  initInput("#beat-shuffle", VJ_DATA.beatEffect, "shuffle", (e) => {
    return e.target.checked;
  });
  initInput("#beat-bounce", VJ_DATA.beatEffect, "bounce", (e) => {
    return e.target.checked;
  });
  initInput("#beat-flash", VJ_DATA.beatEffect, "flash", (e) => {
    return e.target.checked;
  });
  initInput("#beat-invert-color", VJ_DATA.beatEffect, "invertColor", (e) => {
    return e.target.checked;
  });

  // Logo
  const logo = document.querySelector("#logo");
  const logoPreview = logo.querySelector("#logo-preview");
  const logoInput = logo.querySelector("input[type=file]");

  logo.addEventListener("dragover", (event) => {
    event.preventDefault();
    logo.classList.add("highlight");
  });

  logo.addEventListener("dragleave", () => {
    logo.classList.remove("highlight");
  });

  logo.addEventListener("drop", (event) => {
    event.preventDefault();
    logo.classList.remove("highlight");

    loadLogo(event.dataTransfer.files[0]);
  });

  logoInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    loadLogo(file);
  });

  logoPreview.addEventListener("click", () => {
    logoInput.click();
  });

  initInput("#display-logo", VJ_DATA.logo, "display", (e) => {
    return e.target.checked;
  });
  initInput("#logo-size", VJ_DATA.logo, "size", (e) => {
    return parseFloat(e.target.value);
  });
  initInput("#logo-opacity", VJ_DATA.logo, "opacity", (e) => {
    return parseFloat(e.target.value);
  });
  initInput("#logo-random-position", VJ_DATA.logo, "randomPos", (e) => {
    const randomPos = e.target.checked;
    const logoFixedPos = document.querySelectorAll(".logo-fixed-position");
    const logoRandomPos = document.querySelectorAll(".logo-random-position");
    if (randomPos) {
      logoFixedPos.forEach((e) => e.classList.add("hidden"));
      logoRandomPos.forEach((e) => e.classList.remove("hidden"));
    } else {
      logoRandomPos.forEach((e) => e.classList.add("hidden"));
      logoFixedPos.forEach((e) => e.classList.remove("hidden"));
    }
    return randomPos;
  });
  initInput("#logo-pos-x", VJ_DATA.logo, "posX", (e) => {
    return parseFloat(e.target.value);
  });
  initInput("#logo-pos-y", VJ_DATA.logo, "posY", (e) => {
    return parseFloat(e.target.value);
  });
  initInput("#logo-random-freq", VJ_DATA.logo, "randomFreq", (e) => {
    return parseFloat(e.target.value);
  });
  initInput("#logo-random-count", VJ_DATA.logo, "randomCount", (e) => {
    return parseFloat(e.target.value);
  });
}

function loadMedias(files) {
  Array.from(files).forEach((file) => {
    const media = mediaManager.addMedia(file);
    if (!media) {
      return;
    }

    const previewItem = document.createElement("div");
    previewItem.className = "item";
    if (media.type === "image") {
      previewItem.style.backgroundImage = `url(${media.url})`;
    }
    if (media.type === "video") {
      const video = document.createElement("video");
      video.src = media.url;
      previewItem.appendChild(video);
    }

    const fileName = document.createElement("div");
    fileName.className = "file-name";
    fileName.textContent = file.name;

    previewItem.appendChild(fileName);
    medias.appendChild(previewItem);

    // クリックでメディアを選択
    previewItem.addEventListener("click", () => {
      if (shiftListener.isShiftPressed) {
        mediaManager.removeMedia(media.url);
        medias.removeChild(previewItem);
      } else {
        mediaManager.selectMedia(media.url);
      }
    });
  });
}

function loadLogo(file) {
  if (file) {
    if (file.type.split("/")[0] !== "image") {
      return;
    }
    const url = URL.createObjectURL(file);
    const logoPreview = logo.querySelector("#logo-preview");

    logoPreview.innerHTML = "";
    const img = document.createElement("img");
    img.src = url;
    logoPreview.appendChild(img);

    VJ_DATA.logo.url = url;
    sendToProjectionWindow();
  }
}

function openProjectionWindow() {
  projectionWindow = window.open(
    "projection.html",
    "Projection Window",
    "width=800,height=600"
  );
}

function sendToProjectionWindow() {
  if (projectionWindow && !projectionWindow.closed) {
    projectionWindow.postMessage({ vjdesu: VJ_DATA }, location.origin);
  }
}

function initInput(selector, obj, prop, onInputListener) {
  const target = document.querySelector(selector);

  if (!target) {
    console.warn(`Element not found: "${selector}"`);
    return;
  }

  const isCheckbox = target.type.toLowerCase() === "checkbox";

  const applyValueToInput = (val) => {
    if (isCheckbox) {
      target.checked = val;
    } else {
      target.value = val;
    }
  };

  const _listener = (e) => {
    const result = onInputListener(e);
    if (result !== undefined) {
      if (obj[prop] !== result) {
        obj[prop] = result;
        mediaManager.update();
        sendToProjectionWindow();
      }
      applyValueToInput(result);
    }
  };

  applyValueToInput(obj[prop]);
  target.addEventListener("input", _listener);
  target.addEventListener("change", _listener);
}

/**
 * Adds autocomplete behavior to an input element specified by a selector.
 *
 * This function allows the input element to clear its value temporarily on focus
 * and reapply it immediately to trigger autocomplete suggestions.
 * Additionally, the input element will lose focus when its value changes.
 *
 * @param {string} selector - A CSS selector for selecting the target input element.
 */
function addAutoCompleteBehavior(selector) {
  const inputElement = document.querySelector(selector);

  if (!inputElement) {
    console.warn(`Element not found: "${selector}"`);
    return;
  }

  inputElement.addEventListener("focus", () => {
    const currentValue = inputElement.value;
    inputElement.value = "";
    setTimeout(() => {
      inputElement.value = currentValue;
    }, 1);
  });

  inputElement.addEventListener("change", () => {
    inputElement.blur();
  });
}
