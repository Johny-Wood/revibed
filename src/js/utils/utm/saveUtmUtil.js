import NextRouter from '@/services/NextRouter';
import { getCookieUtil, setCookieUtil } from '@/utils/cookiesUtil';
import { textToCamelCaseUtil } from '@/utils/textUtils';

export const saveUtmToCookieUtil = () => {
  const { router: { router: { query = {} } = {} } = {} } = NextRouter.getInstance();
  const target = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  const anyPresent = target.map((t) => !!getCookieUtil(textToCamelCaseUtil(t, '_'))).filter(Boolean);

  if (anyPresent && anyPresent.length > 0) {
    return;
  }

  target.forEach((t) => {
    const value = query[t];
    if (value) {
      setCookieUtil(textToCamelCaseUtil(t, '_'), query[t], {
        expires: new Date(2222, 0),
      });
    }
  });
};
