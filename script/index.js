let projectionWindow;
let logo = null;

let isShiftPressed = false;

document.addEventListener("keydown", (event) => {
  isShiftPressed = event.shiftKey;
  _switchShift();
});

document.addEventListener("keyup", (event) => {
  isShiftPressed = false;
  _switchShift();
});

function _switchShift() {
  if (isShiftPressed && !document.body.classList.contains("shift")) {
    document.body.classList.add("shift");
  }
  if (!isShiftPressed && document.body.classList.contains("shift")) {
    document.body.classList.remove("shift");
  }
}

const medias = document.getElementById("medias");
const medias_fileInput = document.getElementById("media");

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

  const files = event.dataTransfer.files;
  if (files.length) {
    medias_fileInput.files = files;
    medias_fileInput.dispatchEvent(new Event("change"));
  }
});

document.getElementById("add-media").addEventListener("click", () => {
  medias_fileInput.click();
});

// メディアファイルをアップロードしてプレビューを表示
medias_fileInput.addEventListener("change", function (event) {
  const files = event.target.files;
  // 既存のプレビューをクリアするのではなく、上書きしない
  Array.from(files).forEach((file) => {
    const url = URL.createObjectURL(file);
    const media = { name: file.name, type: file.type.split("/")[0], url: url };
    VJ_DATA.mediaList.push(media); // メディアリストに追加

    // プレビューを作成（静止画として表示）
    const previewItem = document.createElement("div");
    previewItem.className = "item";
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
    medias.appendChild(previewItem);

    // クリックでメディアを選択
    previewItem.addEventListener("click", () => {
      if (isShiftPressed) {
        medias.removeChild(previewItem);

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

const logo_droparea = document.getElementById("logoDroparea");
const logo_preview = document.getElementById("logoPreview");
const logo_fileInput = document.getElementById("logo");

logo_droparea.addEventListener("dragover", (event) => {
  event.preventDefault();
  logo_droparea.classList.add("highlight");
});

logo_droparea.addEventListener("dragleave", () => {
  logo_droparea.classList.remove("highlight");
});

logo_droparea.addEventListener("drop", (event) => {
  event.preventDefault();
  logo_droparea.classList.remove("highlight");

  const files = event.dataTransfer.files;
  if (files.length) {
    logo_fileInput.files = files;
    logo_fileInput.dispatchEvent(new Event("change"));
  }
});

logo_preview.addEventListener("click", () => {
  logo_fileInput.click();
});

logo_fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);

  logo = url;
  logo_preview.innerHTML = "";
  const img = document.createElement("img");
  img.src = url;
  logo_preview.appendChild(img);
  sendToProjectionWindow();
});

document.querySelector("#invertColor").addEventListener("change", (e) => {
  VJ_DATA.invertColor = e.target.checked;
  if (VJ_DATA.invertColor) {
    document.getElementById("invertColorWithBPM").parentElement.style.display =
      "block";
  } else {
    document.getElementById("invertColorWithBPM").parentElement.style.display =
      "none";
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
  document.getElementById("shuffle").checked = false;
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
    VJ_DATA.invertColorWithBPM =
      document.getElementById("invertColorWithBPM").checked;
    VJ_DATA.shuffle = document.getElementById("shuffle").checked;
    VJ_DATA.screenEffect = document.getElementById("screenEffect").value;
    VJ_DATA.logo = document.getElementById("displayLogo").checked ? logo : null;
    projectionWindow.postMessage({ vjdesu: VJ_DATA }, PAGE_ORIGIN || "*");
  }
}
