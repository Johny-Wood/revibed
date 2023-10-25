import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import FollowLocationsConstants from '@/constants/follow/locations';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import TitlesConstants from '@/constants/titles/titlesConstants';
import FollowersList from '@/pages/personal/Follow/_components/FollowersList';
import { getPersonalFollowersRequestAction } from '@/redux-actions/personal/friendsActions';

const metaTitle = TitlesConstants.FOLLOWERS;

function FollowersPageWrapper({
  getPersonalFollowersInProcess,
  getPersonalFollowersFromApi,
  followers,
  followersPageSettings,
  getPersonalFollowersRequest,
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
          inProcess={getPersonalFollowersInProcess}
          fromApi={getPersonalFollowersFromApi}
          list={followers}
          listPageSettings={followersPageSettings}
          request={getPersonalFollowersRequest}
          noResultsText="Be&nbsp;active and people will reach out to&nbsp;you."
          location={FollowLocationsConstants.FOLLOWERS}
          path={RoutePathsConstants.FOLLOWERS}
          scrollId={ScrollBlockIdConstants.FOLLOWERS}
        />
      </PersonalPageLayout>
    </BaseWebsiteLayout>
  );
}

export default connect(
  (state) => ({
    getPersonalFollowersFromApi: state.FriendsReducer.getPersonalFollowersFromApi,
    getPersonalFollowersInProcess: state.FriendsReducer.getPersonalFollowersInProcess,
    followers: state.FriendsReducer.followers,
    followersPageSettings: state.FriendsReducer.followersPageSettings,
  }),
  (dispatch) => ({
    getPersonalFollowersRequest: (params = {}) =>
      getPersonalFollowersRequestAction({
        ...params,
        dispatch,
      }),
  })
)(FollowersPageWrapper);
