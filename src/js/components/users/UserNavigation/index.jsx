import TabsWrapper from '@/components/common/tabs/TabsWrapper';
import { UserNavigationConstants } from '@/constants/navigations/user';

import styles from './styles.module.scss';

function UserNavigation({ userId }) {
  return (
    <TabsWrapper
      className={styles.userTabs}
      tabs={UserNavigationConstants(userId)
        .map(({ links }) => links)
        .flat()
        .map((item, idx) => ({
          id: idx + 1,
          ...item,
        }))}
      type="NAVIGATION"
    />
  );
}

export default UserNavigation;
