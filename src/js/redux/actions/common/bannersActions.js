import api from '@/api';
import { BannersActionsConstants } from '@/constants/actions/common/banners';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { setCookieUtil } from '@/utils/cookiesUtil';

import createAction from '../actionCreator';

export const setActiveBannerAction = ({ activeBanner, withSetCookie = true }) => {
  if (withSetCookie) {
    setCookieUtil(CommonVariablesConstants.BANNER_ID_COOKIES, JSON.stringify(activeBanner?.id), {
      expires: new Date(2222, 0),
    });
  }

  return createAction(BannersActionsConstants.SET_ACTIVE_BANNER, {
    activeBanner,
  });
};

const getBannersInProcessAction = (getBannersInProcess) =>
  createAction(BannersActionsConstants.GET_BANNERS_IN_PROCESS, {
    getBannersInProcess,
  });

const getBannersSuccessAction = ({ banners }) =>
  createAction(BannersActionsConstants.GET_BANNERS_SUCCESS, {
    banners,
  });

export const getBannersRequestAction = ({ refreshedToken, dispatch }) =>
  new Promise((resolve) => {
    dispatch(getBannersInProcessAction(true));

    api
      .get('banners', {
        headers: refreshedToken
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: refreshedToken,
            }
          : undefined,
      })
      .then(({ data: { data: banners = [] } }) => {
        dispatch(getBannersSuccessAction({ banners }));

        resolve({ banners });
      })
      .catch((error) => {
        console.error(error);

        dispatch(getBannersInProcessAction(false));
        resolve();
      });
  });
