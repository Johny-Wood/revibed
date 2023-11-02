import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import FollowLocationsConstants from '@/constants/follow/locations';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import TitlesConstants from '@/constants/titles/titlesConstants';
import FollowersList from '@/pages/personal/Follow/_components/FollowersList';
import { getPersonalFollowingRequestAction } from '@/redux-actions/personal/friendsActions';

const metaTitle = TitlesConstants.FOLLOWING;

function FollowersPageWrapper({
  getPersonalFollowingInProcess,
  getPersonalFollowingFromApi,
  following,
  followingPageSettings,
  getPersonalFollowingRequest,
}) {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: metaTitle,
      }}
      shownBanners
    >
      <PersonalPageLayout>
        <FollowersList
          inProcess={getPersonalFollowingInProcess}
          fromApi={getPersonalFollowingFromApi}
          list={following}
          listPageSettings={followingPageSettings}
          request={getPersonalFollowingRequest}
          noResultsText="Follow someone and be&nbsp;aware of&nbsp;their pre-orders."
          location={FollowLocationsConstants.FOLLOWING}
          path={RoutePathsConstants.FOLLOWING}
          scrollId={ScrollBlockIdConstants.FOLLOWING}
        />
      </PersonalPageLayout>
    </BaseWebsiteLayout>
  );
}

export default connect(
  (state) => ({
    getPersonalFollowingFromApi: state.FriendsReducer.getPersonalFollowingFromApi,
    getPersonalFollowingInProcess: state.FriendsReducer.getPersonalFollowingInProcess,
    following: state.FriendsReducer.following,
    followingPageSettings: state.FriendsReducer.followingPageSettings,
  }),
  (dispatch) => ({
    getPersonalFollowingRequest: (params = {}) =>
      getPersonalFollowingRequestAction({
        ...params,
        dispatch,
      }),
  })
)(FollowersPageWrapper);
