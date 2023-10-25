import type { TabConfig } from '@/components/common/tabs/TabsNavigation';
import TabsWrapper from '@/components/common/tabs/TabsWrapper';
import { PersonalNavigationConstants } from '@/constants/navigations/personal';

import styles from './styles.module.scss';

const PERSONAL_TABS: TabConfig[] = PersonalNavigationConstants.map(({ links }) => links)
  .flat()
  .map((item, idx) => ({ id: idx + 1, ...item }));

function PersonalTabsNavigation() {
  return (
    <TabsWrapper
      className={styles.personalTabs}
      horizontalScrollLayoutContentClassName={styles.horizontalScrollLayout__content}
      withOffsetBottom={false}
      tabs={PERSONAL_TABS}
      type="NAVIGATION"
    />
  );
}

export default PersonalTabsNavigation;
