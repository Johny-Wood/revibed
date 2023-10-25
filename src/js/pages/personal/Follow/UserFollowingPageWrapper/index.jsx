import { useRouter } from 'next/router';
import { connect } from 'react-redux';

import FollowLocationsConstants from '@/constants/follow/locations';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import TitlesConstants from '@/constants/titles/titlesConstants';
import FollowersList from '@/pages/personal/Follow/_components/FollowersList';
import UserWrapperLayout from '@/pages/users/UserWrapperLayout';
import { getUserFollowingRequestAction } from '@/redux-actions/users/usersActions';

const metaTitle = TitlesConstants.FOLLOWING;

function UserFollowingPageWrapper({
  getUserFollowingInProcess,
  getUserFollowingFromApi,
  following,
  followingPageSettings,
  getUserFollowingRequest,
  userInfo,
}) {
  const router = useRouter();
  const { query: { userId } = {} } = router || {};

  const { name } = userInfo[userId] || {};

  return (
    <UserWrapperLayout title={metaTitle}>
      <FollowersList
        inProcess={getUserFollowingInProcess}
        fromApi={getUserFollowingFromApi}
        list={following}
        listPageSettings={followingPageSettings}
        request={getUserFollowingRequest}
        userName={name}
        location={FollowLocationsConstants.USER_FOLLOWING}
        path={RoutePathsConstants.USER_FOLLOWING}
        scrollId={ScrollBlockIdConstants.USER_FOLLOWING}
      />
    </UserWrapperLayout>
  );
}

export default connect(
  (state) => ({
    userInfo: state.UsersReducer.userInfo,
    getUserFollowingFromApi: state.UsersReducer.getUserFollowingFromApi,
    getUserFollowingInProcess: state.UsersReducer.getUserFollowingInProcess,
    following: state.UsersReducer.following,
    followingPageSettings: state.UsersReducer.followingPageSettings,
  }),
  (dispatch) => ({
    getUserFollowingRequest: (params = {}) =>
      getUserFollowingRequestAction({
        ...params,
        dispatch,
      }),
  })
)(UserFollowingPageWrapper);
