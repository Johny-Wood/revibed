import { CommonRegExpConstants } from '@/constants/common/regExp';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ProjectsReducersConstants } from '@/constants/projects/reducers';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { SSRGetProjectsWithCookie } from '@/SSR/requests/projects/SSRProjectsRequests';
import { SSRGetUsers } from '@/SSR/requests/users/SSRUsersRequests';

export const userGetInitialPropsLogic = async ({ ctx, location, reducerName }) => {
  const { res, query: { userId } = {}, req, store } = ctx;
  const awaitPromises = [];

  const { AuthReducer: { userInfo: { id: meUserId } = {} } = {} } = store.getState();
  const isMeId = +userId === meUserId;

  if (!userId || !CommonRegExpConstants.INT.test(userId) || isMeId) {
    if (req && res) {
      res.statusCode = 302;
      res.setHeader('Location', isMeId ? RoutePathsConstants.MY_PROJECTS : RoutePathsConstants.MAIN);
      res.end();
    }
  } else {
    awaitPromises.push(SSRGetUsers(ctx));

    if (location === ProjectsLocationsConstants.PROJECTS_USER) {
      awaitPromises.push(
        SSRGetProjectsWithCookie({
          ctx,
          location,
          reducerName: ProjectsReducersConstants[reducerName],
          withoutLoadedFromApi: true,
        })
      );
    }
  }

  await Promise.all(awaitPromises);
};
