import { cloneElement } from 'react';

import { RoutePathsConstants } from '@/constants/routes/routes';
import AuthRedirectorService from '@/services/auth/AuthRedirectorService';
import ReduxStoreService from '@/services/ReduxStoreService';

const Predicates = {
  AUTHORIZED_PREDICATE: () => {
    const { store } = ReduxStoreService.getInstance();

    const { AuthReducer: { userIsAuthorized = false } = {} } = store.getState();

    return userIsAuthorized;
  },
};

const RedirectComponent = ({
  redirectUri = RoutePathsConstants.SIGN_IN,
  predicate = () => undefined,
  enabled = true,
  routeBefore,
  query,
  callbackAfterRedirect = () => {},

  children,
}) =>
  cloneElement(children, {
    onClick: () => {
      if (!predicate() && !Predicates.AUTHORIZED_PREDICATE() && enabled) {
        if (redirectUri.startsWith('http')) {
          window.location.replace(redirectUri);
        } else if (predicate() === undefined) {
          AuthRedirectorService.setAuthRedirector({
            redirectUri,
            routeBefore,
            query,
            settings: { callbackAfterRedirect },
          });
        }
      } else {
        children.props.onClick();
      }
    },
  });

export { Predicates };

export default RedirectComponent;
