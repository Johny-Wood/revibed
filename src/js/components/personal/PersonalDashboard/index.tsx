import RetractableMenu from '@/components/common/RetractableMenu';
import { UserAuthorized } from '@/components/layouts/AuthLayouts';
import SideBarLayout from '@/components/layouts/SideBarLayout';
import PersonalNavigation from '@/components/personal/PersonalNavigation';
import MyProfileBar from '@/components/personal/profile/MyProfileBar';
import MenuIcon from '@/icons/control/MenuIcon';

import styles from './styles.module.scss';

type PersonalDashboardProps = {
  className?: string;
  withProfileBar?: boolean;
  navigationList?: unknown[];
};

function PersonalDashboard({ className, navigationList, withProfileBar }: PersonalDashboardProps) {
  return (
    <SideBarLayout className={className}>
      <UserAuthorized>
        <div className={styles.personalDashboard}>
          <UserAuthorized>{withProfileBar && <MyProfileBar />}</UserAuthorized>
          {navigationList && navigationList.length > 0 && (
            <RetractableMenu
              className={styles.retractable}
              buttonText="Menu"
              buttonIcon={<MenuIcon />}
              withMenu={navigationList.length > 0}
            >
              <PersonalNavigation groupClassName={styles.personalNavigation__group} navigationList={navigationList} />
            </RetractableMenu>
          )}
        </div>
      </UserAuthorized>
    </SideBarLayout>
  );
}

export default PersonalDashboard;
