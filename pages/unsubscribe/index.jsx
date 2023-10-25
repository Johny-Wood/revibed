import { RoutePathsConstants } from '@/constants/routes/routes';
import UnsubscribeWrapper from '@/pages/unsubscribe/UnsubscribeWrapper';
import { SSRGetUnsubscribeType } from '@/SSR/requests/unsubscribe/SSRUnsubscribeRequests';

function UnsubscribePage({ token, template }) {
  return <UnsubscribeWrapper token={token} template={template} />;
}

UnsubscribePage.getInitialProps = async (ctx) => {
  const { req, res, query: { token, e_template: template } = {}, store } = ctx;

  const { AuthReducer: { userIsAuthorized } = {} } = store.getState();

  const awaitPromises = [];

  if (!token && !userIsAuthorized && req) {
    res.statusCode = 302;
    res.setHeader('Location', RoutePathsConstants.MAIN);
    res.end();
  }

  if (token || userIsAuthorized) {
    awaitPromises.push(SSRGetUnsubscribeType(ctx, userIsAuthorized));
    await Promise.all(awaitPromises);
  }

  return {
    token,
    template,
  };
};

export default UnsubscribePage;
