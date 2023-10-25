import newMobileMenuAnimation from '@/assets/styles/animations/new-mobile-menu.module.scss';
import HeaderMenu from '@/components/global/Header/_components/HeaderMenu';
import MobileMenuButton from '@/components/global/Header/_components/MobileMenu/_components/MobileMenuButton';
import { UserAuthorized } from '@/components/layouts/AuthLayouts';
import ClosedOnClickLayout from '@/components/layouts/ClosedOnClickLayout';
import CreateProjectLink from '@/components/projects/Project/_components/buttons/CreateProjectLink';
import { MobileMenuNavigationConstants } from '@/constants/navigations/main';

import styles from './styles.module.scss';

function MobileMenu() {
  return (
    <ClosedOnClickLayout
      animationDuration={240}
      animationClassNames={{
        enter: newMobileMenuAnimation.newMobileMenuAnimationEnter,
        enterActive: newMobileMenuAnimation.newMobileMenuAnimationEnter_active,
        exit: newMobileMenuAnimation.newMobileMenuAnimationExit,
        exitActive: newMobileMenuAnimation.newMobileMenuAnimationExit_active,
      }}
      button={MobileMenuButton}
    >
      <div className={styles.mobileMenu}>
        <UserAuthorized>
          <CreateProjectLink withIcon transparent={false} rounded={false} gtmAttribute="start_project_header" />
        </UserAuthorized>
        <HeaderMenu className={styles.navHeader} links={MobileMenuNavigationConstants} />
      </div>
    </ClosedOnClickLayout>
  );
}

export default MobileMenu;
