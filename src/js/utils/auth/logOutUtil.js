import { AuthActionsConstants } from '@/constants/actions/auth/auth';
import { RoutePathsConstants } from '@/constants/routes/routes';
import NextRouter from '@/services/NextRouter';

export const logOutUtil = ({ dispatch, req }) => {
  const { router = {} } = NextRouter.getInstance();

  dispatch({
    type: AuthActionsConstants.SIGN_OUT,
  });

  if (req) {
    return;
  }

  router.push(RoutePathsConstants.MAIN);
};
