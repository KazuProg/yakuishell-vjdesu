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
  const mediaElement = document.getElementById("mediaElement");
  const logoElement = document.getElementById("logoElement");
  const tilesContainer = document.getElementById("tiles");
  const displayText = document.getElementById("displayText");

  clearInterval(interval); // 既存のランダム切り替えタイマーをクリア
  clearInterval(interval_invertColor);

  // メディアファイル表示
  if (VJ_DATA.mediaFile) {
    mediaElement.src = VJ_DATA.mediaFile;
    mediaElement.style.display = "block"; // メディアがある場合は表示
  } else {
    mediaElement.style.display = "none"; // メディアがない場合は非表示
  }

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

  // continuous エフェクト（タイル表示）
  if (VJ_DATA.screenEffect === "continuous") {
    tilesContainer.innerHTML = "";
    mediaElement.style.display = "none"; // メディアは非表示
    tilesContainer.style.display = "flex";

    let aspectHeight; // アスペクト比に基づく高さの計算
    if (VJ_DATA.aspectRatio === "1:1") {
      aspectHeight = "1"; // 1:1 の比率
    } else if (VJ_DATA.aspectRatio === "4:3") {
      aspectHeight = "0.75"; // 4:3 の比率
    } else if (VJ_DATA.aspectRatio === "16:9") {
      aspectHeight = "0.5625"; // 16:9 の比率
    }

    for (let i = 0; i < 36; i++) {
      // 6x6のタイル配置
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.style.width = "calc(100% / 6)";
      tile.style.paddingTop = `calc(100% / 6 * ${aspectHeight})`; // 選択されたアスペクト比で設定
      tile.style.backgroundImage = `url(${VJ_DATA.mediaFile})`;
      tile.style.backgroundSize = "cover";
      tile.style.backgroundPosition = "center";
      tilesContainer.appendChild(tile);
    }
  } else {
    tilesContainer.style.display = "none";
    mediaElement.style.display = "block"; // その他のエフェクト時はメディアを表示
  }

  if (VJ_DATA.invertColor) {
    tilesContainer.classList.add("invertColor");
  } else {
    tilesContainer.classList.remove("invertColor");
  }

  // ランダムエフェクトが選択されている場合
  if (VJ_DATA.effect2 === "random") {
    interval = setInterval(() => {
      if (VJ_DATA.screenEffect === "continuous") {
        Array.from(tilesContainer.children).forEach((tile) => {
          const randomMedia =
            VJ_DATA.mediaList[
              Math.floor(Math.random() * VJ_DATA.mediaList.length)
            ];
          tile.style.backgroundImage = `url(${randomMedia.url})`;
        });
      } else if (VJ_DATA.screenEffect === "none") {
        const randomMedia =
          VJ_DATA.mediaList[
            Math.floor(Math.random() * VJ_DATA.mediaList.length)
          ];
        mediaElement.src = randomMedia.url;
      }
    }, (60 / VJ_DATA.randomBpm) * 1000); // BPMに基づいてランダム切り替え
  }

  if (VJ_DATA.invertColor && VJ_DATA.invertColorBPM) {
    interval_invertColor = setInterval(() => {
      if (tilesContainer.classList.contains("invertColor")) {
        tilesContainer.classList.remove("invertColor");
      } else {
        tilesContainer.classList.add("invertColor");
      }
    }, (60 / VJ_DATA.invertColorBPM) * 1000);
  }
}
