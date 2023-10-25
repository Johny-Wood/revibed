import { PointsTypesConstants } from '@/constants/points/type';
import { loadPersonalActivePointsRequestAction } from '@/redux-actions/personal/activePointsActions';

export const SSRGetActivePointsGemsWithCookie = async ({ ctx }) => {
  const { refreshedToken, req, store, store: { dispatch } = {} } = ctx;

  const { PersonalActiveGemsReducer: { loadPersonalActivePointsFromApi } = {} } = store.getState();

  if (req) {
    await loadPersonalActivePointsRequestAction({
      type: PointsTypesConstants.GEM,
      dispatch,
      cookie: refreshedToken,
    })
      .then()
      .catch();
  } else if (!loadPersonalActivePointsFromApi) {
    loadPersonalActivePointsRequestAction({
      type: PointsTypesConstants.GEM,
      dispatch,
    })
      .then()
      .catch();
  }
};
