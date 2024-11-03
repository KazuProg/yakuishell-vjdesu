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
  logoSize: 0.3,
  logoPosX: 0.5,
  logoPosY: 0.7,
  logoOpacity: 1,
  screenEffect: "none",
  shuffle: false,
  mediaList: [],
  mediaDisplay: "cover",
  randomBpm: 120,
  aspectRatio: "16:9",
  tileCount: 6,
  backgroundColor: "#000000",
  invertColor: false,
  invertColorWithBPM: false,
};

/**
 * Common functions
 */
function hex(val, len = 2) {
  return val.toString(16).toUpperCase().padStart(len, "0");
}
