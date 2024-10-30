let projectionWindow;
let selectedMedia = null;
let selectedText = null;
let selectedFont = "Arial"; // デフォルトフォント
let selectedLogo = null;
let mediaList = []; // メディアリスト
let logoList = []; // ロゴリスト
let randomBpm = 120;
let aspectRatio = "16:9"; // デフォルトのアスペクト比
let invertColor = false;
let invertColorBPM = null;

// メディアファイルをアップロードしてプレビューを表示
document.getElementById("media").addEventListener("change", function (event) {
  const files = event.target.files;
  const mediaPreview = document.getElementById("mediaPreview");
  // 既存のプレビューをクリアするのではなく、上書きしない
  Array.from(files).forEach((file) => {
    const url = URL.createObjectURL(file);
    mediaList.push({ name: file.name, url: url }); // メディアリストに追加

    // プレビューを作成（静止画として表示）
    const previewItem = document.createElement("div");
    previewItem.className = "preview-item";
    previewItem.style.backgroundImage = `url(${url})`;

    const fileName = document.createElement("div");
    fileName.className = "file-name";
    fileName.textContent = file.name;

    previewItem.appendChild(fileName);
    mediaPreview.appendChild(previewItem);

    // クリックでメディアを選択
    previewItem.addEventListener("click", () => {
      if (document.getElementById("deleteMode").checked) {
        mediaPreview.removeChild(previewItem);

        // メディアリストから削除
        mediaList = mediaList.filter((media) => media.url !== url);
        sendToProjectionWindow();
      } else {
        selectedMedia = url;
        sendToProjectionWindow();
      }
    });
  });
});

// ロゴアップロード処理
document
  .getElementById("logoUpload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const logoPreview = document.getElementById("logoPreview");

    const url = URL.createObjectURL(file);
    logoList.push({ name: file.name, url: url }); // ロゴリストに追加

    // プレビューを作成
    const previewItem = document.createElement("div");
    previewItem.className = "preview-item";
    previewItem.style.backgroundImage = `url(${url})`;

    const fileName = document.createElement("div");
    fileName.className = "file-name";
    fileName.textContent = file.name;

    previewItem.appendChild(fileName);
    logoPreview.appendChild(previewItem);

    // クリックでロゴを選択
    previewItem.addEventListener("click", () => {
      if (document.getElementById("deleteMode").checked) {
        logoPreview.removeChild(previewItem);
        logoList = logoList.filter((logo) => logo.url !== url); // ロゴリストから削除
        sendToProjectionWindow();
      } else {
        selectedLogo = url;
        sendToProjectionWindow();
      }
    });
  });

// ロゴ非表示ボタン
function hideLogo() {
  selectedLogo = null;
  sendToProjectionWindow();
}

// effect2変更時の処理
function handleEffect2Change() {
  const effect2 = document.getElementById("effect2").value;
  if (effect2 === "random") {
    document.getElementById("randomBpmControl").style.display = "block";
  } else {
    document.getElementById("randomBpmControl").style.display = "none";
  }
  sendToProjectionWindow();
}

document.querySelector("#invertColor").addEventListener("change", (e) => {
  invertColor = e.target.checked;
  if (invertColor) {
    document.getElementById("invertColorBpmControl").style.display = "block";
  } else {
    document.getElementById("invertColorBpmControl").style.display = "none";
  }
  sendToProjectionWindow();
});

// プロジェクションウィンドウを開く
document
  .getElementById("openProjection")
  .addEventListener("click", function () {
    projectionWindow = window.open(
      "projection.html",
      "Projection Window",
      "width=800,height=600"
    );
  });

// リセットボタン
document.getElementById("resetEffects").addEventListener("click", function () {
  selectedMedia = null;
  selectedText = null;
  selectedFont = "Arial"; // リセット時のフォントはデフォルト
  selectedLogo = null;
  document.getElementById("screenEffect").value = "none";
  document.getElementById("effect2").value = "none";
  document.getElementById("randomBpmControl").style.display = "none";
  document.getElementById("aspectRatio").value = "16:9";
  sendToProjectionWindow();
});

// プロジェクションウィンドウにデータを送信
function sendToProjectionWindow() {
  if (projectionWindow && !projectionWindow.closed) {
    const screenEffect = document.getElementById("screenEffect").value;
    const effect2 = document.getElementById("effect2").value;
    randomBpm = document.getElementById("randomBpm").value;
    invertColorBPM = document.getElementById("invertColorBpm").value || null;
    aspectRatio = document.getElementById("aspectRatio").value;
    const data = {
      mediaFile: selectedMedia,
      text: document.getElementById("text").value,
      font: document.getElementById("font").value,
      logoFile: selectedLogo,
      screenEffect: screenEffect,
      effect2: effect2,
      randomBpm: randomBpm,
      mediaList: mediaList,
      aspectRatio: aspectRatio,
      invertColor,
      invertColorBPM,
    };
    projectionWindow.postMessage({ vjdesu: data }, PAGE_ORIGIN || "*");
  }
}
