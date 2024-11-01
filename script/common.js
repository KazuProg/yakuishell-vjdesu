"use strict";

const PAGE_ORIGIN =
  document.currentScript && document.currentScript.src
    ? new URL(document.currentScript.src).origin
    : null;

const VJ_DATA = {
  mediaFile: null,
  text: "",
  font: "Arial",
  logo: null,
  screenEffect: "none",
  shuffle: false,
  mediaList: [],
  randomBpm: 120,
  aspectRatio: "16:9",
  invertColor: false,
  invertColorWithBPM: false,
};
