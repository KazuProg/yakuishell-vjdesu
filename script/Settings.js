const DefaultSettings = {
  mediaList: [],
  centerText: {
    text: "",
    font: "sans-serif",
    fontSize: 24,
    textColor: "#ffffff",
    backColor: "#000000",
    backOpacity: 0,
  },
  mediaEffect: {
    bgColor: "#000000",
    type: "none",
    mediaDisplay: "cover",
    tileCount: 6,
    aspectRatio: "1:1",
    invertColor: false,
  },
  beatEffect: {
    bpm: 120,
    shuffle: false,
    bounce: false,
    flash: false,
    invertColor: false,
  },
  logo: {
    url: null,
    display: false,
    size: 0.3,
    opacity: 1,
    randomPos: false,
    posX: 1,
    posY: 1,
    randomFreq: 0.5,
    randomCount: 1,
  },
};

export default DefaultSettings;
