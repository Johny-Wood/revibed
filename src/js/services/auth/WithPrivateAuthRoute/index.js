import Router from 'next/router';

import { RoutePathsConstants } from '@/constants/routes/routes';

import ReduxStoreService from '../../ReduxStoreService';

const checkUserAuthentication = () => {
  const { store } = ReduxStoreService.getInstance();

  return {
    auth: store.getState().AuthReducer.userIsAuthorized,
  };
};

const redirect = async ({ context, redirectRoute }) => {
  const { res, req } = context;

  const redirectUrl =
    redirectRoute === RoutePathsConstants.SIGN_IN ? `${redirectRoute}?returnUrl=${encodeURI(context.asPath)}` : redirectRoute;

  if (res && req) {
    res.statusCode = 302;
    res.setHeader('Location', redirectUrl);
    res.end();
  } else {
    await Router.push(redirectUrl);
  }
};

const returnPage = async ({ WrappedComponent, userAuth, context }) => {
  const wrappedProps = await WrappedComponent.getInitialProps({
    ...context,
    auth: userAuth,
  });

  return {
    ...wrappedProps,
    userAuth,
  };
};

const privateRoute = ({ wrappedComponent: WrappedComponent, condition, redirectRoute }) => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

  hocComponent.getInitialProps = async (context) => {
    const userAuth = checkUserAuthentication();
    const { auth } = userAuth;

    if (auth === condition) {
      await redirect({
        context,
        redirectRoute,
      });
    } else if (WrappedComponent.getInitialProps) {
      return returnPage({ WrappedComponent, userAuth, context });
    }

    return { userAuth };
  };

  return hocComponent;
};

const withPrivateAuthRouteToSignUp = (WrappedComponent) =>
  privateRoute({
    wrappedComponent: WrappedComponent,
    condition: false,
    redirectRoute: RoutePathsConstants.SIGN_UP,
  });

const withPrivateAuthRoute = (WrappedComponent) =>
  privateRoute({
    wrappedComponent: WrappedComponent,
    condition: false,
    redirectRoute: RoutePathsConstants.SIGN_IN,
  });

const withPrivateNotAuthRoute = (WrappedComponent) =>
  privateRoute({
    wrappedComponent: WrappedComponent,
    condition: true,
    redirectRoute: RoutePathsConstants.MAIN,
  });

export { withPrivateAuthRoute, withPrivateAuthRouteToSignUp, withPrivateNotAuthRoute };
