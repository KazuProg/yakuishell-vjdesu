let projectionWindow;
let logoList = []; // ロゴリスト

// メディアファイルをアップロードしてプレビューを表示
document.getElementById("media").addEventListener("change", function (event) {
  const files = event.target.files;
  const mediaPreview = document.getElementById("mediaPreview");
  // 既存のプレビューをクリアするのではなく、上書きしない
  Array.from(files).forEach((file) => {
    const url = URL.createObjectURL(file);
    const media = { name: file.name, type: file.type.split("/")[0], url: url };
    VJ_DATA.mediaList.push(media); // メディアリストに追加

    // プレビューを作成（静止画として表示）
    const previewItem = document.createElement("div");
    previewItem.className = "preview-item";
    if (media.type === "image") {
      previewItem.style.backgroundImage = `url(${url})`;
    }
    if (media.type === "video") {
      const video = document.createElement("video");
      video.src = url;
      previewItem.appendChild(video);
    }

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
        VJ_DATA.mediaList = VJ_DATA.mediaList.filter(
          (media) => media.url !== url
        );
        sendToProjectionWindow();
      } else {
        VJ_DATA.mediaFile = media.url;
        if (media.type === "video") {
          VJ_DATA.screenEffect = "single";
          document.getElementById("screenEffect").value = "single";
        }
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
        VJ_DATA.logoFile = url;
        sendToProjectionWindow();
      }
    });
  });

// ロゴ非表示ボタン
function hideLogo() {
  VJ_DATA.logoFile = null;
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
  VJ_DATA.invertColor = e.target.checked;
  if (VJ_DATA.invertColor) {
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
  VJ_DATA.mediaFile = null;
  VJ_DATA.text = null;
  VJ_DATA.font = "Arial"; // リセット時のフォントはデフォルト
  VJ_DATA.logoFile = null;
  document.getElementById("text").value = null;
  document.getElementById("screenEffect").value = "none";
  document.getElementById("effect2").value = "none";
  document.getElementById("randomBpmControl").style.display = "none";
  document.getElementById("aspectRatio").value = "16:9";
  sendToProjectionWindow();
});

// プロジェクションウィンドウにデータを送信
function sendToProjectionWindow() {
  if (projectionWindow && !projectionWindow.closed) {
    VJ_DATA.text = document.getElementById("text").value;
    VJ_DATA.font = document.getElementById("font").value;
    VJ_DATA.randomBpm = parseFloat(document.getElementById("randomBpm").value);
    VJ_DATA.aspectRatio = document.getElementById("aspectRatio").value;
    VJ_DATA.invertColorBPM =
      document.getElementById("invertColorBpm").value || null;
    VJ_DATA.effect2 = document.getElementById("effect2").value;
    VJ_DATA.screenEffect = document.getElementById("screenEffect").value;
    projectionWindow.postMessage({ vjdesu: VJ_DATA }, PAGE_ORIGIN || "*");
  }
}
