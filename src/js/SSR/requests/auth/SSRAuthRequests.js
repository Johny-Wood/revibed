import { parseCookies, setCookie } from 'nookies';

import { CommonVariablesConstants } from '@/constants/common/variables';
import { signInWithCookieAction } from '@/redux-actions/auth/authActions';

export const SSRSignInWithCookie = async (ctx, dispatch) => {
  const cookie = parseCookies(ctx);

  const { req: { headers: { 'x-real-ip': ip } = {} } = {} } = ctx;

  if (cookie && cookie[CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]) {
    const signInWithCookieResponse = await signInWithCookieAction({
      cookie: cookie[CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME] || undefined,
      ip,
    })(dispatch);

    const { tokenInfo } = signInWithCookieResponse || {};

    if (signInWithCookieResponse && tokenInfo) {
      const { name, value, maxAge } = JSON.parse(Buffer.from(tokenInfo, 'base64').toString());

      setCookie(ctx, name, value, {
        path: '/',
        maxAge,
        httpOnly: true,
      });

      return {
        refreshedToken: value,
      };
    }
  }

  return {};
};
