"use strict";

const PAGE_ORIGIN =
  document.currentScript && document.currentScript.src
    ? new URL(document.currentScript.src).origin
    : null;
