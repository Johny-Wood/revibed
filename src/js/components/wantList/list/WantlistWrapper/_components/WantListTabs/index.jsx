import TabsWrapper from '@/components/common/tabs/TabsWrapper';
import WantListSearch from '@/components/wantList/list/WantListReleases/_components/WantListSearch';
import WantListReleasesItemsSearch from '@/components/wantList/list/WantListReleasesItems/WantListReleasesItemsSearch';
import WantListControlMenu from '@/components/wantList/list/WantlistWrapper/_components/WantListControlMenu';
import WantListHeader from '@/components/wantList/list/WantlistWrapper/_components/WantListHeader';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import { RoutePathsConstants } from '@/constants/routes/routes';

import styles from './styles.module.scss';

const WANTLIST_TABS = [
  {
    id: 1,
    title: 'Wantlist',
    href: RoutePathsConstants.WANTLIST,
    throughBlockChild: WantListSearch,
    inheritanceActive: false,
  },
  {
    id: 2,
    title: 'Notifications',
    keyMenu: 'WANT_LIST_RELEASES_ITEMS',
    href: RoutePathsConstants.WANTLIST_RELEASES_ITEMS,
    throughBlockChild: WantListReleasesItemsSearch,
    keyMenuNotification: PersonalNotificationsSectionsConstants.WANT_LIST_RELEASES_ITEMS,
  },
];

function WantlistTabs() {
  return (
    <TabsWrapper
      className={styles.wantlistTabs}
      withButtonBorder={false}
      tabs={WANTLIST_TABS}
      throughBlock={WantListHeader}
      tabsRightBlock={WantListControlMenu}
      withOffsetBottom={false}
      type="NAVIGATION"
    />
  );
}

export default WantlistTabs;
