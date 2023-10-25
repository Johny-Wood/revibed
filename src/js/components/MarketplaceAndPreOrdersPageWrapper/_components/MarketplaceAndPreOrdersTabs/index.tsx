import type { TabConfig } from '@/components/common/tabs/TabsNavigation';
import TabsWrapper from '@/components/common/tabs/TabsWrapper';
import { RoutePathsConstants } from '@/constants/routes/routes';
import TitlesConstants from '@/constants/titles/titlesConstants';

import styles from './styles.module.scss';

const TABS: TabConfig[] = [
  {
    id: 1,
    title: 'Albums',
    keyMenu: 'MARKETPLACE',
    href: RoutePathsConstants.MARKETPLACE,
  },
  {
    id: 2,
    title: TitlesConstants.PRE_ORDERS,
    keyMenu: 'PRE_ORDERS',
    href: RoutePathsConstants.PROJECTS,
  },
];

const MarketplaceAndPreOrdersTabs = () => (
  <TabsWrapper tabs={TABS} type="NAVIGATION" className={styles.MarketplaceAndPreOrdersTabs} />
);

export default MarketplaceAndPreOrdersTabs;
