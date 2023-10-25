import { RoutePathsConstants } from '@/constants/routes/routes';
import { getUsersInfoRequestAction } from '@/redux-actions/users/usersActions';
import NextRouter from '@/services/NextRouter';

const redirectToPage = ({ req, res, location = RoutePathsConstants.MAIN, error }) => {
  if (error) {
    if (req) {
      res.statusCode = 302;
      res.setHeader('Location', location);
      res.end();
    } else {
      const { router = {} } = NextRouter.getInstance();
      router.push(location);
    }
  }
};

export const SSRGetUsers = async ({ res, req, refreshedToken, store, store: { dispatch } = {}, query: { userId } = {} }) => {
  const { UsersReducer: { userInfo = {} } = {} } = store.getState();

  if (req) {
    await getUsersInfoRequestAction({ cookie: refreshedToken, userId, dispatch })
      .then(({ error } = {}) => {
        redirectToPage({
          req,
          res,
          error,
        });
      })
      .catch();
  } else if (!userInfo[userId]) {
    getUsersInfoRequestAction({ userId, dispatch })
      .then(({ error } = {}) => {
        redirectToPage({
          req,
          res,
          error,
        });
      })
      .catch();
  }
};
