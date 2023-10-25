import { useEffect } from 'react';

import { CommonVariablesConstants } from '@/constants/common/variables';
import { RoutePathsConstants } from '@/constants/routes/routes';
import SignUpReferralWrapper from '@/pages/auth/SignUpReferralWrapper';
import NextRouter from '@/services/NextRouter';
import ReduxStoreService from '@/services/ReduxStoreService';
import { setCookieUtil } from '@/utils/cookiesUtil';

const REDIRECT_LOCATION = RoutePathsConstants.SIGN_UP;

const promoIsActive = () => {
  const { store = {} } = ReduxStoreService.getInstance();

  const { PromoReducer: { promoActions: { REFERRAL_PROGRAM: { isActive } = {} } = {} } = {} } = store.getState();

  return isActive;
};

function ReferralCodePage() {
  useEffect(() => {
    const { router = {}, router: { router: { query: { referralCode } = {} } = {} } = {} } = NextRouter.getInstance();

    if (referralCode && promoIsActive()) {
      setCookieUtil(CommonVariablesConstants.REFERRAL_CODE, referralCode, {
        expires: new Date(2222, 0),
      });
    }

    router.replace(REDIRECT_LOCATION);
  }, []);

  return <SignUpReferralWrapper />;
}

ReferralCodePage.getInitialProps = async (ctx) => {
  const { res = {}, req } = ctx;

  if (res && req && !promoIsActive()) {
    res.statusCode = 302;
    res.setHeader('Location', REDIRECT_LOCATION);
    res.end();
  }

  return { props: {} };
};

export default ReferralCodePage;
