import { getFeedRequestAction } from '@/redux-actions/feedActions';

export const SSRGetFeed = async ({ refreshedToken, req, store: { dispatch, getState } }) => {
  const { MyFeedReducer: { loadedProjectsFromApi } = {} } = getState();

  if (req) {
    await getFeedRequestAction({ cookie: refreshedToken, dispatch }).then().catch();
  } else if (!loadedProjectsFromApi) {
    getFeedRequestAction({ cookie: refreshedToken, dispatch }).then().catch();
  }
};
