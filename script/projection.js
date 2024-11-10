import VJ_DATA from "./Settings.js";

let bpmInterval = null;
let randomLogoInterval = null;
let bounceTileCount;
let bounceTileCountDir;
let mediaLayer;
let logoLayer;

window.addEventListener("load", () => {
  mediaLayer = document.getElementById("media-layer");
  logoLayer = document.querySelector("#logo-layer");
  for (const key in VJ_DATA) {
    applyEffect(key, VJ_DATA[key], {});
  }
});

window.addEventListener("message", (event) => {
  if (event.origin !== location.origin) {
    console.warn("Unauthorized message origin in postMessage:", event.origin);
    return;
  }

  if (!("vjdesu" in event.data)) {
    console.warn("Unrecognized data format in postMessage:", event.data);
    return;
  }

  const data = event.data.vjdesu;

  for (const key in data) {
    const oldValue = JSON.stringify(VJ_DATA[key]);
    const newValue = JSON.stringify(data[key]);
    if (oldValue !== newValue) {
      VJ_DATA[key] = data[key];
      applyEffect(key, VJ_DATA[key], JSON.parse(oldValue));
    }
  }
});

function initTileMedia(tileCount) {
  let aspectHeight;
  switch (VJ_DATA.mediaEffect.aspectRatio) {
    case "1:1":
      aspectHeight = "1";
      break;
    case "4:3":
      aspectHeight = "0.75";
      break;
    case "16:9":
      aspectHeight = "0.5625";
      break;
  }

  mediaLayer.innerHTML = "";
  for (let i = 0; i < tileCount ** 2; i++) {
    const tile = createMediaElem(VJ_DATA.mediaList[0].url);
    tile.style.width = `calc(100vw / ${tileCount})`;
    tile.style.height = `calc(100vw / ${tileCount} * ${aspectHeight})`;
    mediaLayer.appendChild(tile);
  }
}
function applyEffect(key, newValue, oldValue) {
  switch (key) {
    case "centerText":
      const centerText = newValue;
      const elem = document.getElementById("text-layer");
      elem.innerText = centerText.text;
      elem.style.fontFamily = centerText.font;
      elem.style.fontSize = `${centerText.fontSize}px`;
      elem.style.color = centerText.textColor;
      elem.style.background =
        centerText.backColor + hex(centerText.backOpacity);
      break;
    case "mediaList":
    case "mediaEffect":
      const mediaEffect = VJ_DATA.mediaEffect;
      document.body.style.backgroundColor = mediaEffect.bgColor;
      mediaLayer.classList.remove("tile");
      mediaLayer.innerHTML = "";

      if (mediaEffect.type === "tile") {
        mediaLayer.classList.add("tile");
        initTileMedia(mediaEffect.tileCount);
      } else if (mediaEffect.type === "single") {
        const mediaElem = createMediaElem(VJ_DATA.mediaList[0].url);
        mediaElem.style.width = "100vw";
        mediaElem.style.height = "100vh";
        mediaLayer.appendChild(mediaElem);
      }

      if (mediaEffect.invertColor) {
        mediaLayer.classList.add("invertColor");
      } else {
        mediaLayer.classList.remove("invertColor");
      }
      break;
    case "beatEffect":
      const beatEffect = newValue;
      clearInterval(bpmInterval);

      if (beatEffect.bounce) {
        bounceTileCount = 1;
        bounceTileCountDir = 1;
      }

      bpmInterval = setInterval(() => {
        if (beatEffect.bounce) {
          bounceTileCount += bounceTileCountDir;
          initTileMedia(bounceTileCount);
          bounceMedia();
          if (bounceTileCount === VJ_DATA.mediaEffect.tileCount) {
            bounceTileCountDir = -1;
          }
          if (bounceTileCount === 1) {
            bounceTileCountDir = 1;
          }
        }

        if (beatEffect.shuffle) {
          Array.from(mediaLayer.children).forEach((tile) => {
            const randomMedia = () =>
              VJ_DATA.mediaList[
                Math.floor(Math.random() * VJ_DATA.mediaList.length)
              ];
            let mediaURL = null;
            if (
              VJ_DATA.mediaEffect.type === "single" &&
              VJ_DATA.mediaList.length >= 2
            ) {
              while (mediaURL == null) {
                const media = randomMedia();
                if (tile.style.backgroundImage.indexOf(media.url) === -1) {
                  mediaURL = media.url;
                }
              }
            } else {
              mediaURL = randomMedia().url;
            }
            tile.style.backgroundImage = `url(${mediaURL})`;
          });
        }

        if (beatEffect.flash) {
          const flashElement = document.querySelector("#flash");
          flashElement.classList.remove("flash");
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              flashElement.classList.add("flash");
            });
          });
        }

        if (VJ_DATA.mediaEffect.invertColor && beatEffect.invertColor) {
          if (mediaLayer.classList.contains("invertColor")) {
            mediaLayer.classList.remove("invertColor");
          } else {
            mediaLayer.classList.add("invertColor");
          }
        }
      }, (60 / beatEffect.bpm) * 1000);
      break;
    case "logo":
      const logo = newValue;

      if (logo.display) {
        logoLayer.style.opacity = logo.opacity;
        if (logo.randomPos) {
          if (
            randomLogoInterval === null ||
            logo.randomFreq !== oldValue.randomFreq
          ) {
            clearInterval(randomLogoInterval);
            randomLogoInterval = setInterval(
              logoIntervalHandler,
              logo.randomFreq * 1000
            );
          }
        } else {
          clearInterval(randomLogoInterval);
          randomLogoInterval = null;
          const logoElements = logoLayer.querySelectorAll("img");
          const logoElement =
            logoElements.length > 0
              ? logoElements[logoElements.length - 1]
              : null;
          if (logoElement && logoElement.src === logo.url) {
            applyLogoSizeAndPos(logoElement, logo.posX, logo.posY);
          } else {
            const logoElement = createLogoElem(logo.posX, logo.posY);
            logoLayer.appendChild(logoElement);
          }
          while (logoLayer.children.length !== 1) {
            logoLayer.removeChild(logoLayer.children[0]);
          }
        }
      } else {
        logoLayer.innerHTML = "";
      }
      break;
    default:
      console.warn(`unsupported key: ${key}`);
  }
}

function createLogoElem(x, y) {
  const logoElement = document.createElement("img");
  logoElement.style.position = "absolute";
  logoElement.style.display = "none";
  logoElement.src = VJ_DATA.logo.url;
  logoElement.addEventListener("load", () => {
    applyLogoSizeAndPos(logoElement, x, y);
    logoElement.style.display = "block";
  });
  return logoElement;
}

function applyLogoSizeAndPos(elem, x, y) {
  elem.style.width = `${window.innerWidth * VJ_DATA.logo.size}px`;
  const w = elem.clientWidth;
  const h = elem.clientHeight;
  elem.style.left = `${(window.innerWidth - w) * x}px`;
  elem.style.top = `${(window.innerHeight - h) * y}px`;
}

function logoIntervalHandler() {
  const logoElement = createLogoElem(Math.random(), Math.random());
  logoLayer.appendChild(logoElement);
  while (VJ_DATA.logo.randomCount < logoLayer.children.length) {
    logoLayer.removeChild(logoLayer.children[0]);
  }
}

function bounceMedia() {
  mediaLayer.classList.add("bounce");
  setTimeout(() => {
    mediaLayer.classList.remove("bounce");
  }, 300);
}

function createMediaElem(url) {
  const mediaType = VJ_DATA.mediaList.find((item) => item.url === url)?.type;
  let mediaElem;
  if (mediaType === "image") {
    mediaElem = document.createElement("div");
    mediaElem.style.backgroundImage = `url(${url})`;
    mediaElem.style.backgroundSize = VJ_DATA.mediaEffect.mediaDisplay;
    mediaElem.style.backgroundPosition = "center";
    mediaElem.style.backgroundRepeat = "no-repeat";
  }
  if (mediaType === "video") {
    mediaElem = document.createElement("video");
    mediaElem.src = url;
    mediaElem.muted = true;
    mediaElem.autoplay = true;
    mediaElem.controls = false;
    mediaElem.loop = true;
    mediaElem.style.objectFit = VJ_DATA.mediaEffect.mediaDisplay;
  }
  return mediaElem;
}

function hex(val, len = 2) {
  return val.toString(16).toUpperCase().padStart(len, "0");
}
