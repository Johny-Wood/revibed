import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import UserPageWrapper from '@/components/users/UserPageWrapper';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import { resetUserFollowersAction, resetUserFollowingAction } from '@/redux-actions/users/usersActions';

function UserWrapperLayout({ userInfo, title, children, resetUserFollowers, resetUserFollowing }) {
  const router = useRouter();
  const { query: { userId } = {} } = router || {};

  const { name } = userInfo[userId] || {};

  useEffect(
    () => () => {
      resetUserFollowers();
      resetUserFollowing();
    },
    [resetUserFollowers, resetUserFollowing]
  );

  return (
    <BaseWebsiteLayout
      headSettings={{
        title: `${title} (${name})`,
      }}
      shownBanners
    >
      <UserPageWrapper userId={userId} scrollId={ScrollBlockIdConstants.USER_PROJECTS} path={RoutePathsConstants.USER_PROJECTS}>
        {children}
      </UserPageWrapper>
    </BaseWebsiteLayout>
  );
}

export default connect(
  (state) => ({
    userInfo: state.UsersReducer.userInfo,
  }),
  (dispatch) => ({
    resetUserFollowers: () => {
      dispatch(resetUserFollowersAction());
    },
    resetUserFollowing: () => {
      dispatch(resetUserFollowingAction());
    },
  })
)(UserWrapperLayout);
