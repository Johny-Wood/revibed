import { getRatingRequestAction } from '@/redux-actions/common/ratingActions';

export const SSRRating = async ({ req, refreshedToken, store: { dispatch, getState } }) => {
  if (req) {
    await getRatingRequestAction({ cookie: refreshedToken, dispatch }).then().catch();
  } else {
    const { RatingReducer: { getRatingInProcessFromApi } = {} } = getState();

    if (!getRatingInProcessFromApi) {
      getRatingRequestAction({ dispatch }).then().catch();
    }
  }
};
