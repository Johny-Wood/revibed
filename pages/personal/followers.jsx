import FollowersPageWrapper from '@/pages/personal/Follow/FollowersPageWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';
import { SSRGetPersonalFollowers } from '@/SSR/requests/SSRFollowRequests';

function FollowersPage() {
  return <FollowersPageWrapper />;
}

FollowersPage.getInitialProps = async (ctx) => {
  const { store } = ctx;
  const awaitPromises = [];

  awaitPromises.push(SSRGetPersonalFollowers(ctx, store));

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default withPrivateAuthRoute(FollowersPage);
