import cloneDeep from 'lodash/cloneDeep';

import { RatingActionsConstants } from '@/constants/actions/common/rating';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getRatingInProcess: false,
  getRatingInProcessFromApi: false,
  rating: [],
};

const handlers = createHandlers({
  [RatingActionsConstants.GET_RATING_IN_PROCESS]: (state, { getRatingInProcess = false }) => ({
    ...state,
    getRatingInProcess,
  }),
  [RatingActionsConstants.GET_RATING_SUCCESS]: (state, { rating = [] }) => ({
    ...state,
    rating,
    getRatingInProcess: false,
    getRatingInProcessFromApi: true,
  }),
  [RatingActionsConstants.RATING_CHANGE_FOLLOW_USER]: (state, { userId, isFollowing }) => {
    const ratingTmp = cloneDeep(state.rating);
    const foundUserIdx = ratingTmp.findIndex(({ id }) => id === userId);

    if (foundUserIdx === -1) {
      return {
        ...state,
      };
    }

    const { subscribersCount = 0 } = ratingTmp[foundUserIdx];

    ratingTmp[foundUserIdx] = {
      ...ratingTmp[foundUserIdx],
      subscribersCount: subscribersCount + (isFollowing ? 1 : -1),
      subscription: isFollowing,
    };

    return {
      ...state,
      rating: ratingTmp,
    };
  },
});

const RatingReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default RatingReducer;
