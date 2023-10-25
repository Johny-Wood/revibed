import { useCallback, useEffect, useRef, useState } from 'react';

import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';

import CookiesPopup from '@/components/global/CookiesPopup';
import DarkBackgroundOverlay from '@/components/global/DarkBackgroundOverlay';
import GradientsIcon from '@/components/global/GradientsIcon';
import Popups from '@/components/global/Popups';
import SitePreloader from '@/components/global/SitePreloader';
import { MobileLayout } from '@/components/layouts/ViewportLayouts';
import { CommonVariablesConstants } from '@/constants/common/variables';
import DialogLocationsConstants from '@/constants/dialog/location';
import { WebSocketSubscriptionIdsConstants } from '@/constants/websocket/webSocketSubscriptionIds';
import { PreviousHook } from '@/hooks/state/PreviousHook';
import { getBannersRequestAction, setActiveBannerAction } from '@/redux-actions/common/bannersActions';
import { loadCountriesRequestAction } from '@/redux-actions/common/globalActions';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { getDialogIdRequestAction } from '@/redux-actions/dialog/dialogActions';
import { loadConditionsRequestAction } from '@/redux-actions/projects/dataForProjectActions';
import { loadPromoListRequestAction } from '@/redux-actions/promo/promoActions';
import AuthRedirectorService from '@/services/auth/AuthRedirectorService';
import ImageLiteBoxService from '@/services/ImageLiteBoxService';
import NextRouter from '@/services/NextRouter';
import ProcessService from '@/services/ProcessService';
import WebSocketService from '@/services/WebSocketService';
import FacebookPixel from '@/utils/analytics/facebookPixel';
import GtmPusher from '@/utils/analytics/gtmPusher';
import { logInUtil } from '@/utils/auth/logInUtil';
import { getActiveBannerUtil } from '@/utils/bannersUtil';
import { getCookieUtil } from '@/utils/cookiesUtil';
import { removeShowErrorQueryUtil } from '@/utils/error/errorQueryUtil';
import { saveUtmToCookieUtil } from '@/utils/utm/saveUtmUtil';
import { websocketConnectUtil } from '@/websocket/connectUtil';

const GlobalYoutubePlayer = dynamic(() => import('@/components/global/GlobalYoutubePlayer'), {
  ssr: false,
});

const ImageLiteBox = dynamic(() => import('@/components/global/ImageLiteBox'), {
  ssr: false,
});

function App({
  children,

  shownCookiesPopup,

  userIsAuthorized,
  userInfo,
  userInfo: { id: userId } = {},

  dialogIdLoadedFromApi,
  getDialogId,
  loadConditionsRequest,
  loadCountriesRequest,
  getBannersRequest,
  setActiveBanner,
  loadPromoListRequest,
  showMessage,
}) {
  const initializedServices = useRef(false);

  const prevUserIsAuthorized = PreviousHook(userIsAuthorized);

  const [isAllResourcesLoaded, setIsAllResourcesLoaded] = useState(false);

  if (!initializedServices.current && typeof window !== 'undefined') {
    AuthRedirectorService.initialize();
    ProcessService.initialize();
    ImageLiteBoxService.initialize();
    FacebookPixel.getInstance().initializePixel();
    GtmPusher.getInstance().initializeGtm();

    initializedServices.current = true;
  }

  const getAndConnectDialogsId = useCallback(() => {
    if (!dialogIdLoadedFromApi && userIsAuthorized) {
      getDialogId(DialogLocationsConstants.ADMIN).then((chatId) => {
        if (chatId && chatId >= 0) {
          WebSocketService.subscribe({
            category: WebSocketSubscriptionIdsConstants.CHAT,
            subscribeName: `/chat/${chatId}`,
            callbackData: {
              location: DialogLocationsConstants.ADMIN,
              chatId,
            },
          });
        }
      });
    }
  }, [dialogIdLoadedFromApi, getDialogId, userIsAuthorized]);

  const websocketSubscribeUser = useCallback(
    (category) => {
      if (!userIsAuthorized || !userId) {
        return;
      }

      WebSocketService.subscribe({
        category,
        subscribeName: `/user-private/${userId}/info`,
      });
    },
    [userId, userIsAuthorized]
  );

  const websocketSubscribeUserAndGetDialogId = useCallback(() => {
    websocketSubscribeUser(WebSocketSubscriptionIdsConstants.USER_INFO);
    getAndConnectDialogsId();
  }, [getAndConnectDialogsId, websocketSubscribeUser]);

  const getBanners = useCallback(() => {
    getBannersRequest().then(({ banners }) => {
      const activeId = getCookieUtil(CommonVariablesConstants.BANNER_ID_COOKIES) || -1;

      setActiveBanner({
        activeBanner: getActiveBannerUtil({ activeId, banners }),
        withSetCookie: true,
      });
    });
  }, [getBannersRequest, setActiveBanner]);

  useEffect(() => {
    if (!isAllResourcesLoaded) {
      const { router: { router: { query } = {} } = {} } = NextRouter.getInstance();

      if (!isEmpty(query) && query['show-error']) {
        showMessage(query['show-error']);
      }
    }
  }, [isAllResourcesLoaded, showMessage]);

  useEffect(() => {
    if (!isAllResourcesLoaded) {
      websocketConnectUtil(websocketSubscribeUserAndGetDialogId);
    }
  }, [isAllResourcesLoaded, websocketSubscribeUserAndGetDialogId]);

  useEffect(() => {
    if (!isAllResourcesLoaded) {
      removeShowErrorQueryUtil();
      saveUtmToCookieUtil();
    }
  }, [isAllResourcesLoaded]);

  useEffect(() => {
    if (!isAllResourcesLoaded) {
      loadConditionsRequest();
    }
  }, [isAllResourcesLoaded, loadConditionsRequest]);

  useEffect(() => {
    if (!isAllResourcesLoaded) {
      loadCountriesRequest();
    }
  }, [isAllResourcesLoaded, loadCountriesRequest]);

  useEffect(() => {
    if (userIsAuthorized && !isAllResourcesLoaded) {
      logInUtil({ userInfo });
    }
  }, [isAllResourcesLoaded, userInfo, userIsAuthorized]);

  useEffect(() => {
    setIsAllResourcesLoaded(true);
  }, []);

  if (prevUserIsAuthorized !== userIsAuthorized) {
    WebSocketService.disconnect(() => websocketConnectUtil(userIsAuthorized && websocketSubscribeUserAndGetDialogId));

    loadPromoListRequest();
    getBanners();

    if (userIsAuthorized) {
      logInUtil({ userInfo });
    }
  }

  return (
    <>
      <GradientsIcon />
      <SitePreloader isShown={!isAllResourcesLoaded} />
      {children}
      <Popups />
      <CookiesPopup shownCookiesPopup={shownCookiesPopup} />
      <GlobalYoutubePlayer />
      <ImageLiteBox />
      <MobileLayout>
        <DarkBackgroundOverlay />
      </MobileLayout>
    </>
  );
}

export default connect(
  (state) => ({
    userInfo: state.AuthReducer.userInfo,
    userIsAuthorized: state.AuthReducer.userIsAuthorized,
    dialogIdLoadedFromApi: state.AdminDialogReducer.dialogIdLoadedFromApi,
  }),
  (dispatch) => ({
    getDialogId: (location) => getDialogIdRequestAction(location)(dispatch),
    loadPromoListRequest: () => loadPromoListRequestAction({ dispatch }),
    getBannersRequest: () => getBannersRequestAction({ dispatch }),
    loadConditionsRequest: () => loadConditionsRequestAction({ dispatch }),
    loadCountriesRequest: () => loadCountriesRequestAction({ dispatch }),
    setActiveBanner: (params) => {
      dispatch(setActiveBannerAction(params));
    },
    showMessage: (messageId, messageData = {}, closeOtherMessages = true) => {
      dispatch(showMessageAction(messageId, messageData, closeOtherMessages));
    },
  })
)(App);
