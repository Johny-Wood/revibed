import { useRouter } from 'next/router';
import { connect } from 'react-redux';

import FollowLocationsConstants from '@/constants/follow/locations';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import TitlesConstants from '@/constants/titles/titlesConstants';
import FollowersList from '@/pages/personal/Follow/_components/FollowersList';
import UserWrapperLayout from '@/pages/users/UserWrapperLayout';
import { getUserFollowersRequestAction } from '@/redux-actions/users/usersActions';

const metaTitle = TitlesConstants.FOLLOWERS;

function UserFollowersPageWrapper({
  getUserFollowersInProcess,
  getUserFollowersFromApi,
  followers,
  followersPageSettings,
  getUserFollowersRequest,
  userInfo,
}) {
  const router = useRouter();
  const { query: { userId } = {} } = router || {};

  const { name } = userInfo[userId] || {};

  return (
    <UserWrapperLayout title={metaTitle}>
      <FollowersList
        inProcess={getUserFollowersInProcess}
        fromApi={getUserFollowersFromApi}
        list={followers}
        listPageSettings={followersPageSettings}
        request={getUserFollowersRequest}
        userName={name}
        location={FollowLocationsConstants.USER_FOLLOWERS}
        path={RoutePathsConstants.USER_FOLLOWERS}
        scrollId={ScrollBlockIdConstants.USER_FOLLOWERS}
      />
    </UserWrapperLayout>
  );
}

export default connect(
  (state) => ({
    userInfo: state.UsersReducer.userInfo,
    getUserFollowersFromApi: state.UsersReducer.getUserFollowersFromApi,
    getUserFollowersInProcess: state.UsersReducer.getUserFollowersInProcess,
    followers: state.UsersReducer.followers,
    followersPageSettings: state.UsersReducer.followersPageSettings,
  }),
  (dispatch) => ({
    getUserFollowersRequest: (params = {}) =>
      getUserFollowersRequestAction({
        ...params,
        dispatch,
      }),
  })
)(UserFollowersPageWrapper);
