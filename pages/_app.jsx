import MobileDetect from 'mobile-detect';
import withRedux from 'next-redux-wrapper';
import App from 'next/app';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { Provider } from 'react-redux';

import { CommonVariablesConstants } from '@/constants/common/variables';
import { PointsTypesConstants } from '@/constants/points/type';
import { HistoryProvider } from '@/contexts/history/History';
import { loadLanguagesRequestAction } from '@/redux-actions/common/globalActions';
import { loadVarsFromApiRequestAction } from '@/redux-actions/common/variablesActions';
import { loadPersonalActivePointsRequestAction } from '@/redux-actions/personal/activePointsActions';
import { loadPromoListRequestAction } from '@/redux-actions/promo/promoActions';
import detectDefaultSelectedLanguage from '@/services/language/detect/DetectDefaultSelectLanguageService';
import TranslateProvider from '@/services/language/TranslateProvider';
import ReduxStoreService from '@/services/ReduxStoreService';
import ViewPortProvider from '@/services/viewport/ViewPortProvider';
import { SSRSignInWithCookie } from '@/SSR/requests/auth/SSRAuthRequests';
import { SSRGetBanners } from '@/SSR/requests/SSRBannersRequests';

import '@/components/projects/Project/_components/ProjectRippedLabel/styles.scss';
import '@/components/projects/Project/_components/ProjectStatus/styles.scss';
import '@/components/projects/Project/_components/SecuredLabel/styles.scss';
import '@/components/projects/Project/_components/buttons/CreateProjectLink/styles.scss';
import '@/components/projects/Project/_components/buttons/ProjectActionButton/styles.scss';
import '@/components/ui/Preloader/styles.scss';
import '@/components/ui/ToolTip/styles.scss';
import '@/components/ui/buttons/Button/styles.scss';
import '@/components/ui/buttons/ButtonIcon/styles.scss';
import '@/components/ui/inputs/Input/styles.scss';
import '@/components/ui/links/LinkDefault/styles.scss';
import '@/assets/styles/index.scss';

import StartApp from '../App';

// export function reportWebVitals(metric) {
//   // eslint-disable-next-line no-console
//   console.log(metric);
// }

function NextApp({ Component, ...rest }) {
  const { store, isMobileFromUserAgent, isTabletFromUserAgent, shownCookiesPopup, pageProps } = rest;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Provider store={store}>
        <TranslateProvider>
          <ViewPortProvider isMobileFromUserAgent={isMobileFromUserAgent} isTabletFromUserAgent={isTabletFromUserAgent}>
            <HistoryProvider>
              <StartApp shownCookiesPopup={shownCookiesPopup}>
                <Component {...pageProps} />
              </StartApp>
            </HistoryProvider>
          </ViewPortProvider>
        </TranslateProvider>
      </Provider>
    </>
  );
}

NextApp.getInitialProps = async (appContext) => {
  const { ctx } = appContext;
  const { req, store, store: { dispatch, getState } = {} } = ctx;

  let md = {};
  let shownCookiesPopup = false;

  if (req) {
    const userAgent = req ? req?.headers['user-agent'] || '' : window?.navigator?.userAgent || '';

    md = new MobileDetect(userAgent || '');

    const cookie = parseCookies(ctx);

    const { refreshedToken } = await SSRSignInWithCookie(ctx, dispatch);

    const { AuthReducer: { userInfo: { language, goldenCoinsCount } = {} } = {} } = getState();

    shownCookiesPopup = !cookie[CommonVariablesConstants.CONFIRM_COOKIES];

    const hasCookieAndToken = !!refreshedToken || (!!cookie && !!cookie[CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]);

    const cookieParam = hasCookieAndToken ? refreshedToken || cookie[CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME] : undefined;

    const detectedLanguage = detectDefaultSelectedLanguage({
      headersAcceptLanguage: req.headers['accept-language'],
      userLanguage: language || {},
    });

    ctx.refreshedToken = cookieParam;

    await loadVarsFromApiRequestAction({ dispatch });

    const awaitPromises = [];

    if (goldenCoinsCount > 0) {
      awaitPromises.push(
        loadPersonalActivePointsRequestAction({
          type: PointsTypesConstants.GOLDEN_COIN,
          cookie: cookieParam,
          dispatch,
        })
      );
    }

    awaitPromises.push(loadLanguagesRequestAction({ detectedLanguage, dispatch }));

    awaitPromises.push(loadPromoListRequestAction({ cookie: cookieParam, dispatch }));

    awaitPromises.push(SSRGetBanners(ctx, store));

    await Promise.all(awaitPromises);
  }

  const pageProps = await App.getInitialProps(appContext);

  const isMobile = md?.mobile ? !!md.mobile() : false;
  const isTablet = md?.tablet ? !!md.tablet() : false;

  return {
    ...pageProps,
    isMobileFromUserAgent: isMobile,
    isTabletFromUserAgent: isTablet,
    shownCookiesPopup,
  };
};

export default withRedux(ReduxStoreService.init)(NextApp);
