import type { TabConfig } from '@/components/common/tabs/TabsNavigation';
import TabsWrapper from '@/components/common/tabs/TabsWrapper';
import { RoutePathsConstants } from '@/constants/routes/routes';
import MarketplaceListComingSoon from '@/pages/main-projects/MainProjectsPageWrapper/_components/MarketplaceListWidget/_components/MarketplaceListComingSoon';
import MarketplaceListNewReleases from '@/pages/main-projects/MainProjectsPageWrapper/_components/MarketplaceListWidget/_components/MarketplaceListNewReleases';

import styles from './styles.module.scss';

const MAIN_MARKETPLACE_TABS: TabConfig[] = [
  {
    id: 1,
    title: 'New releases',
    href: RoutePathsConstants.MAIN,
    hrefKey: RoutePathsConstants.MAIN_MARKETPLACE_NEW_RELEASES,
    keyMenu: 'NEW_RELEASES',
    withActive: false,
    container: MarketplaceListNewReleases,
  },
  {
    id: 2,
    title: 'Coming soon',
    href: RoutePathsConstants.MAIN,
    hrefKey: RoutePathsConstants.MAIN_MARKETPLACE_COMING_SOON,
    keyMenu: 'COMING_SOON',
    withActive: false,
    container: MarketplaceListComingSoon,
  },
];

const MarketplaceTabs = () => (
  <TabsWrapper
    type="NAVIGATION"
    visibleType="TAGS"
    tabs={MAIN_MARKETPLACE_TABS}
    withActiveClass
    withOffsetBottom={false}
    className={styles.MarketplaceTabs}
  />
);

export default MarketplaceTabs;
