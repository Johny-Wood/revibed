import { useEffect } from 'react';

import { connect } from 'react-redux';

import { CommonVariablesConstants } from '@/constants/common/variables';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { UseHistory } from '@/contexts/history/History';
import SignUpWrapper from '@/pages/auth/SignUpWrapper';
import AuthRedirectorService from '@/services/auth/AuthRedirectorService';
import { withPrivateNotAuthRoute } from '@/services/auth/WithPrivateAuthRoute';

function SignUpPage({ returnUrl = '', referralCode, userIsAuthorized, email }) {
  const {
    history: {
      previous: { path: previousPath },
    },
  } = UseHistory();

  useEffect(() => {
    const { authRedirector } = AuthRedirectorService.getInstance();

    if (userIsAuthorized || authRedirector || !returnUrl) {
      return;
    }

    if (
      userIsAuthorized ||
      authRedirector ||
      !returnUrl ||
      (!returnUrl &&
        (previousPath.startsWith(RoutePathsConstants.RESET_PASSWORD) ||
          previousPath.startsWith(RoutePathsConstants.REFERRAL) ||
          previousPath.startsWith(RoutePathsConstants.SIGN_UP) ||
          previousPath.startsWith(RoutePathsConstants.SIGN_IN)))
    ) {
      return;
    }

    if (!authRedirector && (returnUrl || previousPath)) {
      const returnUrlSplit = returnUrl.split('?');

      AuthRedirectorService.setAuthRedirector({
        routeBefore: returnUrlSplit[0] || previousPath,
        query: returnUrlSplit[1],
      });
    }
  }, [previousPath, returnUrl, userIsAuthorized]);

  return <SignUpWrapper referralCode={referralCode} email={email} />;
}

SignUpPage.getInitialProps = async ({ req: { cookies = {} } = {}, query: { returnUrl, email } = {} }) => ({
  referralCode: cookies[CommonVariablesConstants.REFERRAL_CODE] || '',
  returnUrl,
  email,
});

export default connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
}))(withPrivateNotAuthRoute(SignUpPage));
