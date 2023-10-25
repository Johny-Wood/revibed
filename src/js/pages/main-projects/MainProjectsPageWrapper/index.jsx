import { connect } from 'react-redux';
import MarketplaceListWidget from 'src/js/pages/main-projects/MainProjectsPageWrapper/_components/MarketplaceListWidget';

import MainJoinBanner from '@/components/common/auth-banner/MainJoinBanner';
import MainSlider from '@/components/global/MainSlider';
import { UserAuthorized, UserNotAuthorized } from '@/components/layouts/AuthLayouts';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import LiveBar from '@/pages/main-projects/LiveBar';
import MainPageNotAuthorizedWrapper from '@/pages/main-projects/MainPageNotAuthorizedWrapper';
import FundingNow from '@/pages/main-projects/MainProjectsPageWrapper/_components/FundingNow';
import MainProjects from '@/pages/main-projects/MainProjectsPageWrapper/_components/MainProjects';

import styles from './styles.module.scss';

const metaTitle = 'Wanted Vinyl Records, CDs & Cassette Tapes In High Resolution';
const metaDescription =
  'Rediscover some of the most forgotten and wanted music records of all time and support the original artists. Welcome to the most innovative tool to collect rare music.';

function MainProjectsPageWrapper({ userIsAuthorized }) {
  const { isNotDesktop } = ViewportHook();

  return (
    <>
      <UserAuthorized>
        <BaseWebsiteLayout
          headSettings={{
            title: metaTitle,
            description: metaDescription,
          }}
          headerProps={{
            transparent: !userIsAuthorized && !isNotDesktop,
            withTransparent: true,
          }}
          withoutPaddingTop={!userIsAuthorized && !isNotDesktop}
          shownBanners
        >
          <MainSlider />
          <FundingNow />
          <SiteWrapperLayout className={styles.MainProjectsPageWrapper__marketplace}>
            <MarketplaceListWidget />
          </SiteWrapperLayout>
          <SiteWrapperLayout direction={!isNotDesktop ? 'row' : 'column'}>
            <MainProjects />
            <LiveBar />
          </SiteWrapperLayout>
          <SiteWrapperLayout className={styles.MainProjectsPageWrapper__join}>
            <MainJoinBanner />
          </SiteWrapperLayout>
        </BaseWebsiteLayout>
      </UserAuthorized>
      <UserNotAuthorized>
        <MainPageNotAuthorizedWrapper isNotDesktop={isNotDesktop} userIsAuthorized={userIsAuthorized} />
      </UserNotAuthorized>
    </>
  );
}

export default connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
}))(MainProjectsPageWrapper);
