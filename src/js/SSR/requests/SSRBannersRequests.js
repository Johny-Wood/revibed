import { parseCookies, setCookie } from 'nookies';

import { CommonVariablesConstants } from '@/constants/common/variables';
import { getBannersRequestAction, setActiveBannerAction } from '@/redux-actions/common/bannersActions';
import { getActiveBannerUtil } from '@/utils/bannersUtil';

const changeNextIndexActiveBannerFromCookie = ({
  banners = [],
  bannersCookie = -1,

  dispatch,
  ctx,
}) => {
  if (banners.length === 0) {
    return;
  }

  const activeBanner = getActiveBannerUtil({ banners, activeId: bannersCookie });

  setCookie(ctx, CommonVariablesConstants.BANNER_ID_COOKIES, activeBanner?.id, {
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });

  dispatch(setActiveBannerAction({ activeBanner, withSetCookie: false }));
};

export const SSRGetBanners = async (ctx, { dispatch, getState }) => {
  const { refreshedToken, req } = ctx;

  const cookie = parseCookies(ctx);

  const { BannersReducer: { getBannersInProcessFromApi } = {} } = getState();

  if (req) {
    await getBannersRequestAction({ refreshedToken, dispatch })
      .then(({ banners }) => {
        changeNextIndexActiveBannerFromCookie({
          banners,
          bannersCookie: cookie[CommonVariablesConstants.BANNER_ID_COOKIES],
          dispatch,
          ctx,
        });
      })
      .catch();
  } else if (!getBannersInProcessFromApi) {
    getBannersRequestAction({ refreshedToken, dispatch }).then().catch();
  }
};
