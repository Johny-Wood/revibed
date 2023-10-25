import { useEffect, useRef } from 'react';

import SideBarLayout from '@/components/layouts/SideBarLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import WrapperContainerLayout from '@/components/layouts/WrapperContainerLayout';
import UserProfileBar from '@/components/personal/profile/UserProfileBar';
import UserNavigation from '@/components/users/UserNavigation';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import ScrollService from '@/services/scroll/ScrollService';

import styles from './styles.module.scss';

function UserPageWrapper({ userId, scrollId, path, children }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(scrollId, path, scrollRef);
  }, [path, scrollId]);

  useEffect(() => {
    ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).scrollTop({
      sectionId: scrollId,
    });
  }, [scrollId]);

  return (
    <SiteWrapperLayout direction="column" firstInPage name={styles.userPage} ref={scrollRef}>
      <WrapperContainerLayout direction="column" wrap="wrap">
        <WrapperContainerLayout direction="row" wrap="nowrap">
          <SideBarLayout className={styles.sideBar}>
            <div className={styles.personalDashboard}>
              <UserProfileBar userId={userId} />
            </div>
          </SideBarLayout>
          <div className={styles.userWrapper}>
            <UserNavigation userId={userId} />
            {children}
          </div>
        </WrapperContainerLayout>
      </WrapperContainerLayout>
    </SiteWrapperLayout>
  );
}

export default UserPageWrapper;
