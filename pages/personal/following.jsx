import FollowingPageWrapper from '@/pages/personal/Follow/FollowingPageWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';
import { SSRGetPersonalFollowing } from '@/SSR/requests/SSRFollowRequests';

function FollowingPage() {
  return <FollowingPageWrapper />;
}

FollowingPage.getInitialProps = async (ctx) => {
  const { store } = ctx;
  const awaitPromises = [];

  awaitPromises.push(SSRGetPersonalFollowing(ctx, store));

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default withPrivateAuthRoute(FollowingPage);
