import FeedPageWrapper from '@/pages/main-projects/FeedPageWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';
import { SSRRating } from '@/SSR/requests/common/SSRRatingRequests';
import { SSRGetFeed } from '@/SSR/requests/SSRFeedRequests';

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
  awaitPromises.push(SSRRating(ctx));

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default withPrivateAuthRoute(FeedPage);
