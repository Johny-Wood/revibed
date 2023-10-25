import api from '@/api';
import { RatingActionsConstants } from '@/constants/actions/common/rating';
import { CommonVariablesConstants } from '@/constants/common/variables';

import createAction from '../actionCreator';

const getRatingInProcessAction = (getRatingInProcess) =>
  createAction(RatingActionsConstants.GET_RATING_IN_PROCESS, {
    getRatingInProcess,
  });

const getRatingSuccessAction = ({ rating }) =>
  createAction(RatingActionsConstants.GET_RATING_SUCCESS, {
    rating,
  });

export const changeFollowUserRatingAction = ({ userId, isFollowing }) =>
  createAction(RatingActionsConstants.RATING_CHANGE_FOLLOW_USER, {
    userId,
    isFollowing,
  });

export const getRatingRequestAction = ({ cookie, dispatch }) =>
  new Promise((resolve) => {
    dispatch(getRatingInProcessAction(true));

    api
      .get('rating/founded', {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
      })
      .then(({ data: { data: rating = [] } }) => {
        dispatch(getRatingSuccessAction({ rating }));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        dispatch(getRatingInProcessAction(false));
        resolve();
      });
  });
