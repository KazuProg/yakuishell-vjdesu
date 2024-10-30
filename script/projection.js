let mediaFile = null;
let text = "";
let font = "Arial";
let logoFile = null;
let screenEffect = "none";
let effect2 = "none";
let mediaList = [];
let interval = null; // ランダム切り替え用のタイマー
let interval_invertColor = null;
let aspectRatio = "16:9"; // デフォルトのアスペクト比
let invertColor = false;
let invertColorBPM = null;

// 受信データの処理
window.addEventListener("message", function (event) {
  const data = event.data;

  // 受信データの確認
  console.log(data);

  mediaFile = data.mediaFile;
  text = data.text;
  font = data.font;
  logoFile = data.logoFile;
  screenEffect = data.screenEffect;
  effect2 = data.effect2;
  mediaList = data.mediaList;
  randomBpm = data.randomBpm;
  aspectRatio = data.aspectRatio;
  invertColor = data.invertColor;
  invertColorBPM = data.invertColorBPM;

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
  if (mediaFile) {
    mediaElement.src = mediaFile;
    mediaElement.style.display = "block"; // メディアがある場合は表示
  } else {
    mediaElement.style.display = "none"; // メディアがない場合は非表示
  }

  // テキスト表示
  displayText.innerText = text || ""; // innerTextを設定
  displayText.style.fontFamily = font;
  displayText.style.display = text ? "block" : "none"; // テキストがあれば表示

  // ロゴ表示
  if (logoFile) {
    logoElement.src = logoFile;
    logoElement.style.display = "block";
  } else {
    logoElement.style.display = "none";
  }

  // continuous エフェクト（タイル表示）
  if (screenEffect === "continuous") {
    tilesContainer.innerHTML = "";
    mediaElement.style.display = "none"; // メディアは非表示
    tilesContainer.style.display = "flex";

    let aspectHeight; // アスペクト比に基づく高さの計算
    if (aspectRatio === "1:1") {
      aspectHeight = "1"; // 1:1 の比率
    } else if (aspectRatio === "4:3") {
      aspectHeight = "0.75"; // 4:3 の比率
    } else if (aspectRatio === "16:9") {
      aspectHeight = "0.5625"; // 16:9 の比率
    }

    for (let i = 0; i < 36; i++) {
      // 6x6のタイル配置
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.style.width = "calc(100% / 6)";
      tile.style.paddingTop = `calc(100% / 6 * ${aspectHeight})`; // 選択されたアスペクト比で設定
      tile.style.backgroundImage = `url(${mediaFile})`;
      tile.style.backgroundSize = "cover";
      tile.style.backgroundPosition = "center";
      tilesContainer.appendChild(tile);
    }
  } else {
    tilesContainer.style.display = "none";
    mediaElement.style.display = "block"; // その他のエフェクト時はメディアを表示
  }

  if (invertColor) {
    tilesContainer.classList.add("invertColor");
  } else {
    tilesContainer.classList.remove("invertColor");
  }

  // ランダムエフェクトが選択されている場合
  if (effect2 === "random") {
    interval = setInterval(() => {
      if (screenEffect === "continuous") {
        Array.from(tilesContainer.children).forEach((tile) => {
          const randomMedia =
            mediaList[Math.floor(Math.random() * mediaList.length)];
          tile.style.backgroundImage = `url(${randomMedia.url})`;
        });
      } else if (screenEffect === "none") {
        const randomMedia =
          mediaList[Math.floor(Math.random() * mediaList.length)];
        mediaElement.src = randomMedia.url;
      }
    }, (60 / randomBpm) * 1000); // BPMに基づいてランダム切り替え
  }

  if (invertColor && invertColorBPM) {
    interval_invertColor = setInterval(() => {
      if (tilesContainer.classList.contains("invertColor")) {
        tilesContainer.classList.remove("invertColor");
      } else {
        tilesContainer.classList.add("invertColor");
      }
    }, (60 / invertColorBPM) * 1000);
  }
}
