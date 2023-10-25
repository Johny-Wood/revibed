import CartControl from '@/components/global/Header/_components/CartControl';
import MobileMenu from '@/components/global/Header/_components/MobileMenu';
import NotificationControl from '@/components/global/Header/_components/NotificationControl';
import UserControlBar from '@/components/global/Header/_components/UserControlBar';
import { UserAuthorized } from '@/components/layouts/AuthLayouts';
import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';

import styles from './styles.module.scss';

function AuthorizedControls({ color }) {
  return (
    <UserAuthorized>
      <div className={styles.headerAuthControls}>
        <CartControl color={color} />
        <DesktopLayout>
          <NotificationControl color={color} />
        </DesktopLayout>
        <DesktopLayout>
          <div className={styles.headerAuthControls__right}>
            <UserControlBar />
          </div>
        </DesktopLayout>
      </div>
      <MobileLayout>
        <UserControlBar />
        <MobileMenu />
      </MobileLayout>
    </UserAuthorized>
  );
}

export default AuthorizedControls;
