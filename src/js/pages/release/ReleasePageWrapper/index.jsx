import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import WrapperContainerLayout from '@/components/layouts/WrapperContainerLayout';
import Release from '@/components/release/ReleaseWrapper';
import { projectNameUtil } from '@/utils/project/projectDetailsUtil';

function ReleasePageWrapper({
  id,

  wantlistReleaseItem,
  getWantListReleaseItemInProcess,
}) {
  const releaseItem = (wantlistReleaseItem || {})[id] || {};
  const { releaseInfo: { artists = [], album: albumTitle = '' } = {} } = releaseItem;

  return (
    <BaseWebsiteLayout
      headSettings={{
        title:
          artists.length || !!albumTitle
            ? projectNameUtil({
                artists,
                albumTitle,
              })
            : 'Release',
      }}
      shownBanners
    >
      <PersonalPageLayout withPersonalTabsNavigation={false} withDashboard={false} withProfileBar={false} withSideBar={false}>
        <SiteWrapperLayout withPadding={false} preloadInProcess={getWantListReleaseItemInProcess}>
          <WrapperContainerLayout>
            <Release releaseItem={releaseItem} releaseItemId={id} />
          </WrapperContainerLayout>
        </SiteWrapperLayout>
      </PersonalPageLayout>
    </BaseWebsiteLayout>
  );
}

export default connect((state) => ({
  getWantListReleaseItemInProcess: state.WantListReleaseItemReducer.getWantListReleaseItemInProcess,
  wantlistReleaseItem: state.WantListReleaseItemReducer.wantlistReleaseItem,
}))(ReleasePageWrapper);
