import { useEffect, useMemo } from 'react';

import { connect } from 'react-redux';

import { UseHistory } from '@/contexts/history/History';
import SignInWrapper from '@/pages/auth/SignInWrapper';
import AuthRedirectorService from '@/services/auth/AuthRedirectorService';
import { withPrivateNotAuthRoute } from '@/services/auth/WithPrivateAuthRoute';

function SignInPage({ email, userIsAuthorized, returnUrl }) {
  const {
    history: {
      current: { path: previousPath },
    },
  } = UseHistory();

  const returnPath = useMemo(() => returnUrl || previousPath, [returnUrl, previousPath]);

  useEffect(() => {
    const { authRedirector } = AuthRedirectorService.getInstance();

    if (userIsAuthorized || authRedirector || !returnPath) {
      return;
    }

    const returnUrlSplit = returnPath.split('?');

    AuthRedirectorService.setAuthRedirector({
      routeBefore: returnUrlSplit[0],
    });
  }, [returnPath, userIsAuthorized]);

  return <SignInWrapper email={email} />;
}

SignInPage.getInitialProps = async ({ query: { email = '', returnUrl } = {} }) => ({
  email,
  returnUrl,
});

export default withPrivateNotAuthRoute(
  connect((state) => ({
    userIsAuthorized: state.AuthReducer.userIsAuthorized,
  }))(SignInPage)
);
