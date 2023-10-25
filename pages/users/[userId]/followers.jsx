import UserFollowersPageWrapper from '@/pages/personal/Follow/UserFollowersPageWrapper';
import { userGetInitialPropsLogic } from '@/SSR/getInitialProps/users';
import { SSRGetUserFollowers } from '@/SSR/requests/SSRFollowRequests';

function UserFollowersPage() {
  return <UserFollowersPageWrapper />;
}

UserFollowersPage.getInitialProps = async (ctx) => {
  const { store } = ctx;
  const awaitPromises = [];

  awaitPromises.push(userGetInitialPropsLogic({ ctx }));
  awaitPromises.push(SSRGetUserFollowers(ctx, store));

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default UserFollowersPage;
