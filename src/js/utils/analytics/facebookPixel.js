import NextRouter from '@/services/NextRouter';

const FacebookPixel = (() => {
  let instance = null;
  let isInitialized = false;

  const init = () => {
    const initializePixel = () => {
      const { router } = NextRouter.getInstance();

      const facebookPixelKey = process.env.NEXT_STATIC_FACEBOOK_PIXEL_ID;
      const canPixelWork =
        process.env.NEXT_STATIC_FACEBOOK_PIXEL_ENABLED === 'true' && facebookPixelKey && typeof window !== 'undefined';

      if (isInitialized) {
        return;
      }

      if (canPixelWork) {
        import('react-facebook-pixel')
          .then(({ default: resDefault }) => resDefault)
          .then((ReactPixel) => {
            console.log('FacebookPixel initialized');
            ReactPixel.init(process.env.NEXT_STATIC_FACEBOOK_PIXEL_ID);
            ReactPixel.pageView();

            router.events.on('routeChangeComplete', () => {
              ReactPixel.pageView();
            });
          });
      }

      isInitialized = true;
    };

    return {
      initializePixel,
    };
  };

  return {
    getInstance: () => {
      if (!instance) {
        instance = init();
      }
      return instance;
    },
  };
})();

export default FacebookPixel;
