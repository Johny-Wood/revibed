const ImageLiteBoxService = (() => {
  let instance = null;

  const init = () => ({
    images: [],
    iframe: '',
    opened: false,
    config: {},
    activeSlideIdx: 0,
    callback: () => {},
  });

  return {
    getInstance: () => {
      if (!instance) {
        throw new Error('ImageLiteBox service not initialized');
      }

      return instance;
    },
    initialize: () => {
      instance = init();

      return instance;
    },
    setImagesCallback: (callback) => {
      instance.callback = callback;
    },
    open: () => {
      instance.opened = true;

      instance.callback();
    },
    close: () => {
      instance.opened = false;

      instance.callback();
    },
    setImages: (images, activeSlideIdx) => {
      instance.images = images;
      instance.activeSlideIdx = activeSlideIdx;

      instance.callback();
    },
    setIframe: (iframe) => {
      instance.iframe = iframe;

      instance.callback();
    },
    setConfig: (config = {}) => {
      instance.config = config;
    },
    resetImages: () => {
      instance.images = [];
      instance.activeSlideIdx = 0;

      instance.callback();
    },
    resetIframe: () => {
      instance.iframe = '';

      instance.callback();
    },
  };
})();

export default ImageLiteBoxService;
