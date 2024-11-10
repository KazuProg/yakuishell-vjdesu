export default class MediaManager {
  #VJ_DATA;
  #updateCallback;
  #mediaList = [];
  #selected = null;

  constructor(VJ_DATA, updateCallback) {
    this.#VJ_DATA = VJ_DATA;
    this.#updateCallback = updateCallback;
  }

  addMedia(file) {
    const media = {
      name: file.name,
      type: file.type.split("/")[0],
      url: URL.createObjectURL(file),
    };

    if (media.type === "image" || media.type === "video") {
      this.#mediaList.push(media);
      this.#sendToProjectionWindow();
      return media;
    } else {
      return null;
    }
  }

  removeMedia(url) {
    this.#mediaList = this.#mediaList.filter((media) => media.url !== url);

    this.#sendToProjectionWindow();
  }

  selectMedia(url) {
    if (this.#VJ_DATA.beatEffect.shuffle) {
      this.#VJ_DATA.beatEffect.shuffle = false;
      document.querySelector("#beat-shuffle").checked = false;
    }

    this.#selected = this.#mediaList.find((media) => media.url === url);

    this.#sendToProjectionWindow();
  }

  update() {
    this.#sendToProjectionWindow();
  }

  #sendToProjectionWindow() {
    if (this.#selected) {
      if (this.#mediaList.indexOf(this.#selected) === -1) {
        this.#selected = null;
      }
    }

    if (!this.#selected) {
      if (this.#mediaList.length !== 0) {
        this.#selected = this.#mediaList[0];
      }
    }

    if (this.#VJ_DATA.beatEffect.shuffle) {
      this.#VJ_DATA.mediaList = this.#mediaList.filter(
        (media) => media.type === "image"
      );
    } else {
      this.#VJ_DATA.mediaList.length = 0; // すべての要素を削除
      if (this.#selected) {
        this.#VJ_DATA.mediaList.push(this.#selected);
        if (this.#selected.type === "video") {
          this.#VJ_DATA.mediaEffect.type = "single";
          document.getElementById("media-effect").value = "single";
          document
            .getElementById("media-effect")
            .dispatchEvent(new Event("input"));
        }
      }
    }
    this.#updateCallback();
  }
}
