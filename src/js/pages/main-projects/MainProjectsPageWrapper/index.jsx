import MarketplaceListWidget from 'src/js/pages/main-projects/MainProjectsPageWrapper/_components/MarketplaceListWidget';

import ToStartPreOrderBlackBanner from '@/components/common/banners/ToStartPreOrderBlackBanner';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import BlogLastArticlesWidget from '@/pages/blog/BlogLastArticlesWidget';
import LiveBar from '@/pages/main-projects/LiveBar';
import FundingNow from '@/pages/main-projects/MainProjectsPageWrapper/_components/FundingNow';

import styles from './styles.module.scss';

const metaTitle = 'Wanted Vinyl Records, CDs & Cassette Tapes In High Resolution';
const metaDescription =
  'Rediscover some of the most forgotten and wanted music records of all time and support the original artists. Welcome to the most innovative tool to collect rare music.';

function MainProjectsPageWrapper() {
  const { isNotDesktop } = ViewportHook();

  const contentDirection = !isNotDesktop ? 'row' : 'column';

  return (
    <BaseWebsiteLayout
      headSettings={{
        title: metaTitle,
        description: metaDescription,
      }}
      shownBanners
      className={styles.MainProjectsPageWrapper}
    >
      <FundingNow />
      <SiteWrapperLayout direction={contentDirection}>
        <MarketplaceListWidget />
        <LiveBar />
      </SiteWrapperLayout>
      <SiteWrapperLayout direction={contentDirection}>
        <ToStartPreOrderBlackBanner className={styles.MainProjectsPageWrapper__banner} />
      </SiteWrapperLayout>
      <SiteWrapperLayout direction={contentDirection}>
        <BlogLastArticlesWidget />
      </SiteWrapperLayout>
    </BaseWebsiteLayout>
  );
}

export default MainProjectsPageWrapper;
