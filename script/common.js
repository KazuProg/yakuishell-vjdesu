"use strict";

const PAGE_ORIGIN =
  document.currentScript && document.currentScript.src
    ? new URL(document.currentScript.src).origin
    : null;

const VJ_DATA = {
  mediaFile: null,
  text: "",
  font: "sans-serif",
  fontSize: 24,
  fontColor: "#ffffff",
  backColor: "#000000",
  backOpacity: 0,
  logo: null,
  screenEffect: "none",
  shuffle: false,
  mediaList: [],
  randomBpm: 120,
  aspectRatio: "16:9",
  invertColor: false,
  invertColorWithBPM: false,
};

/**
 * Common functions
 */
function hex(val, len = 2) {
  return val.toString(16).toUpperCase().padStart(len, "0");
}
