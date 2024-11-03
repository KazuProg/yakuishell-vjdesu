let interval = null; // ランダム切り替え用のタイマー
let interval_invertColor = null;

// 受信データの処理
window.addEventListener("message", function (event) {
  if (PAGE_ORIGIN && event.origin !== PAGE_ORIGIN) {
    console.warn("Unauthorized message origin in postMessage:", event.origin);
    return;
  }

  if (!("vjdesu" in event.data)) {
    console.warn("Unrecognized data format in postMessage:", event.data);
    return;
  }

  const data = event.data.vjdesu;

  for (const key in data) {
    VJ_DATA[key] = data[key];
  }

  applyEffect();
});

function applyEffect() {
  const logoElement = document.getElementById("logoElement");
  const mediaContainer = document.getElementById("media");
  const displayText = document.getElementById("displayText");

  clearInterval(interval); // 既存のランダム切り替えタイマーをクリア
  clearInterval(interval_invertColor);

  document.body.style.backgroundColor = VJ_DATA.backgroundColor;

  // テキスト表示
  displayText.innerText = VJ_DATA.text || ""; // innerTextを設定
  displayText.style.fontFamily = VJ_DATA.font;
  displayText.style.fontSize = `${VJ_DATA.fontSize}px`;
  displayText.style.color = VJ_DATA.fontColor;
  displayText.style.background = VJ_DATA.backColor + hex(VJ_DATA.backOpacity);
  displayText.style.display = VJ_DATA.text ? "block" : "none"; // テキストがあれば表示

  // ロゴ表示
  if (VJ_DATA.logo) {
    logoElement.src = VJ_DATA.logo;
    logoElement.addEventListener("load", (e) => {
      logoElement.style.width = `${window.innerWidth * VJ_DATA.logoSize}px`;
      const w = logoElement.clientWidth;
      const h = logoElement.clientHeight;
      logoElement.style.left = `${
        (window.innerWidth - w) * VJ_DATA.logoPosX
      }px`;
      logoElement.style.top = `${
        (window.innerHeight - h) * VJ_DATA.logoPosY
      }px`;
    });
    logoElement.style.opacity = VJ_DATA.logoOpacity;
    logoElement.style.display = "block";
  } else {
    logoElement.style.display = "none";
  }

  mediaContainer.classList.remove("tile");
  mediaContainer.innerHTML = "";
  // continuous エフェクト（タイル表示）
  if (VJ_DATA.screenEffect === "continuous") {
    mediaContainer.classList.add("tile");

    let aspectHeight; // アスペクト比に基づく高さの計算
    if (VJ_DATA.aspectRatio === "1:1") {
      aspectHeight = "1"; // 1:1 の比率
    } else if (VJ_DATA.aspectRatio === "4:3") {
      aspectHeight = "0.75"; // 4:3 の比率
    } else if (VJ_DATA.aspectRatio === "16:9") {
      aspectHeight = "0.5625"; // 16:9 の比率
    }

    for (let i = 0; i < VJ_DATA.tileCount ** 2; i++) {
      // 6x6のタイル配置
      const tile = createMediaElem(VJ_DATA.mediaFile);
      tile.style.width = `calc(100vw / ${VJ_DATA.tileCount})`;
      tile.style.height = `calc(100vw / ${VJ_DATA.tileCount} * ${aspectHeight})`;
      mediaContainer.appendChild(tile);
    }
  } else if (VJ_DATA.screenEffect === "single") {
    const mediaElem = createMediaElem(VJ_DATA.mediaFile);
    mediaElem.style.width = "100vw";
    mediaElem.style.height = "100vh";
    mediaContainer.appendChild(mediaElem);
  }

  if (VJ_DATA.invertColor) {
    mediaContainer.classList.add("invertColor");
  } else {
    mediaContainer.classList.remove("invertColor");
  }

  // ランダムエフェクトが選択されている場合
  if (VJ_DATA.shuffle === true) {
    interval = setInterval(() => {
      Array.from(mediaContainer.children).forEach((tile) => {
        const randomMedia = () =>
          VJ_DATA.mediaList[
            Math.floor(Math.random() * VJ_DATA.mediaList.length)
          ];
        let mediaURL = null;
        if (
          VJ_DATA.screenEffect === "single" &&
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
    }, (60 / VJ_DATA.randomBpm) * 1000); // BPMに基づいてランダム切り替え
  }

  if (VJ_DATA.invertColor && VJ_DATA.invertColorWithBPM) {
    interval_invertColor = setInterval(() => {
      if (mediaContainer.classList.contains("invertColor")) {
        mediaContainer.classList.remove("invertColor");
      } else {
        mediaContainer.classList.add("invertColor");
      }
    }, (60 / VJ_DATA.randomBpm) * 1000);
  }

  if (VJ_DATA.flash) {
    interval_invertColor = setInterval(() => {
      const flashElement = document.querySelector("#flash");
      flashElement.classList.remove("flash");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          flashElement.classList.add("flash");
        });
      });
    }, (60 / VJ_DATA.randomBpm) * 1000);
  }
}

function createMediaElem(url) {
  const mediaType = VJ_DATA.mediaList.find((item) => item.url === url)?.type;
  let mediaElem;
  if (mediaType === "image") {
    mediaElem = document.createElement("div");
    mediaElem.style.backgroundImage = `url(${url})`;
    mediaElem.style.backgroundSize = VJ_DATA.mediaDisplay;
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
    mediaElem.style.objectFit = VJ_DATA.mediaDisplay;
  }
  return mediaElem;
}
