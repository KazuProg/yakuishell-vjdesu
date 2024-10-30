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

  // テキスト表示
  displayText.innerText = VJ_DATA.text || ""; // innerTextを設定
  displayText.style.fontFamily = VJ_DATA.font;
  displayText.style.display = VJ_DATA.text ? "block" : "none"; // テキストがあれば表示

  // ロゴ表示
  if (VJ_DATA.logoFile) {
    logoElement.src = VJ_DATA.logoFile;
    logoElement.style.display = "block";
  } else {
    logoElement.style.display = "none";
  }

  mediaContainer.classList.remove("tile");
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

    mediaContainer.innerHTML = "";
    for (let i = 0; i < 36; i++) {
      // 6x6のタイル配置
      const tile = createMediaElem(VJ_DATA.mediaFile);
      tile.style.width = "calc(100vw / 6)";
      tile.style.height = "calc(100vw / 6)";
      mediaContainer.appendChild(tile);
    }
  } else if (VJ_DATA.screenEffect === "single") {
    mediaContainer.innerHTML = "";
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
  if (VJ_DATA.effect2 === "random") {
    interval = setInterval(() => {
      Array.from(mediaContainer.children).forEach((tile) => {
        const randomMedia =
          VJ_DATA.mediaList[
            Math.floor(Math.random() * VJ_DATA.mediaList.length)
          ];
        tile.src = randomMedia.url;
      });
    }, (60 / VJ_DATA.randomBpm) * 1000); // BPMに基づいてランダム切り替え
  }

  if (VJ_DATA.invertColor && VJ_DATA.invertColorBPM) {
    interval_invertColor = setInterval(() => {
      if (mediaContainer.classList.contains("invertColor")) {
        mediaContainer.classList.remove("invertColor");
      } else {
        mediaContainer.classList.add("invertColor");
      }
    }, (60 / VJ_DATA.invertColorBPM) * 1000);
  }
}

function createMediaElem(url) {
  const mediaType = VJ_DATA.mediaList.find((item) => item.url === url)?.type;
  let mediaElem;
  if (mediaType === "image") {
    mediaElem = document.createElement("img");
    mediaElem.src = url;
  }
  if (mediaType === "video") {
    mediaElem = document.createElement("video");
    mediaElem.src = url;
    mediaElem.muted = true;
    mediaElem.autoplay = true;
    mediaElem.controls = false;
    mediaElem.loop = true;
  }
  mediaElem.style.objectFit = "cover";
  return mediaElem;
}
