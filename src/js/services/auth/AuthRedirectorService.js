import { RoutePathsConstants } from '@/constants/routes/routes';
import NextRouter from '@/services/NextRouter';

const AuthRedirectorService = (() => {
  let instance;

  const init = () => ({
    authRedirector: undefined,
  });

  const clearAuthRedirector = () => {
    instance = init();
  };

  return {
    getInstance: () => {
      if (!instance) {
        throw new Error('AuthRedirector service not initialized');
      }

      return instance;
    },
    initialize: () => {
      instance = init();

      return instance;
    },
    setAuthRedirector: ({
      redirectUri = RoutePathsConstants.SIGN_IN,
      withBeforeRedirect = true,
      routeBefore,
      query,
      settings = {},
      callbackBeforeRedirect = () => {},
    } = {}) => {
      const { router = {}, router: { router: { asPath } = {} } = {} } = NextRouter.getInstance();
      const { authRedirector: { route: currentAuthRedirectorRoute } = {} } = instance || {};
      const beforeRoute = routeBefore || asPath;

      if (currentAuthRedirectorRoute !== beforeRoute) {
        instance.authRedirector = {
          route: beforeRoute,
          query,
          settings,
        };

        if (withBeforeRedirect) {
          router.push(redirectUri);
        }
      }

      callbackBeforeRedirect();
    },
    callAuthRedirector: () => {
      const { authRedirector } = instance;

      if (authRedirector) {
        const { route, query, settings: { callbackAfterRedirect = () => {} } = {} } = authRedirector;

        if (route) {
          const { router = {} } = NextRouter.getInstance();

          router.push(query ? { pathname: route, query } : route).then(() => {
            callbackAfterRedirect();
          });
        }

        clearAuthRedirector();
      }
    },
    clearAuthRedirector: () => {
      clearAuthRedirector();
    },
  };
})();

export default AuthRedirectorService;
