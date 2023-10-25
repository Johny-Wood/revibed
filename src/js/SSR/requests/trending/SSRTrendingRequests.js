import { getTrendingListRequestAction } from '@/redux-actions/trending/trendingActions';

export const SSRTrendingRequests = async (ctx) => {
  const {
    req,
    refreshedToken,
    store: { dispatch, getState },
  } = ctx;

  if (req) {
    await getTrendingListRequestAction({ cookie: refreshedToken, dispatch }).then().catch();
  } else {
    const { TrendingReducer: { getTrendingListFromApi } = {} } = getState();

    if (!getTrendingListFromApi) {
      getTrendingListRequestAction({ cookie: refreshedToken, dispatch }).then().catch();
    }
  }
};
