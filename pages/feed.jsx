import FeedPageWrapper from '@/pages/main-projects/FeedPageWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';
import { SSRGetFeed } from '@/SSR/requests/SSRFeedRequests';
import { SSRTrendingRequests } from '@/SSR/requests/trending/SSRTrendingRequests';

function FeedPage() {
  return <FeedPageWrapper />;
}

FeedPage.getInitialProps = async (ctx) => {
  const { store } = ctx;

  const { AuthReducer: { userIsAuthorized } = {} } = store.getState();

  if (!userIsAuthorized) {
    return { props: {} };
  }

  const awaitPromises = [];

  awaitPromises.push(SSRGetFeed(ctx));
  awaitPromises.push(SSRTrendingRequests(ctx));

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default withPrivateAuthRoute(FeedPage);
