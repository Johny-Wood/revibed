import type { SingletonRouter } from 'next/router';
import Router from 'next/router';

const NextRouter = (() => {
  let instance: { router: SingletonRouter } | null = null;

  const init = () => {
    const router = Router;

    return {
      router,
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

export default NextRouter;
