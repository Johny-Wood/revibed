import UserFollowingPageWrapper from '@/pages/personal/Follow/UserFollowingPageWrapper';
import { userGetInitialPropsLogic } from '@/SSR/getInitialProps/users';
import { SSRGetUserFollowing } from '@/SSR/requests/SSRFollowRequests';

function UserFollowingPage() {
  return <UserFollowingPageWrapper />;
}

UserFollowingPage.getInitialProps = async (ctx) => {
  const { store } = ctx;
  const awaitPromises = [];

  awaitPromises.push(userGetInitialPropsLogic({ ctx }));
  awaitPromises.push(SSRGetUserFollowing(ctx, store));

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default UserFollowingPage;
