import TagManager from 'react-gtm-module';

const GtmPusher = (() => {
  let instance = null;
  let isInitialized = false;

  const init = () => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
    }

    const initializeGtm = () => {
      const gtmKey = process.env.NEXT_STATIC_GTM_KEY;
      const canGTMWork = process.env.NEXT_STATIC_GTM_ENABLED === 'true' && gtmKey;

      if (isInitialized) {
        return;
      }

      if (canGTMWork) {
        const tagManagerArgs = {
          gtmId: gtmKey,
        };

        TagManager.initialize(tagManagerArgs);

        console.log('ReactGTM initialized');
      }

      isInitialized = true;
    };

    const standardEvent = ({ ...args }) => {
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];

        window.dataLayer.push({
          ...args,
        });
      }
    };

    const sendUserIdEvent = (UID) => {
      standardEvent({
        UID,
      });
    };

    const sendSignUpEvent = () => {
      standardEvent({
        event: 'registration',
      });
    };

    return {
      initializeGtm,
      sendUserIdEvent,
      sendSignUpEvent,
      standardEvent,
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

export default GtmPusher;
