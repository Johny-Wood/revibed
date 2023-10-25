import HeaderNavLayout from '@/components/global/Header/_components/HeaderNavLayout';
import MobileMenu from '@/components/global/Header/_components/MobileMenu';
import { UserNotAuthorized } from '@/components/layouts/AuthLayouts';
import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';

import styles from './styles.module.scss';

function NotAuthorizedControls() {
  return (
    <UserNotAuthorized>
      <div className={styles.headerNotAuthControls}>
        <DesktopLayout>
          <div className={styles.headerNotAuthControls__right}>
            <UserNotAuthorized>
              <HeaderNavLayout>
                <div className={styles.headerNotAuthControls__navigation}>
                  <LinkRoute href={RoutePathsConstants.SIGN_IN} translateKey="login" />
                  <LinkRoute
                    type="button"
                    href={RoutePathsConstants.SIGN_UP}
                    translateKey="signUp"
                    transparent
                    rounded
                    className="button_signup"
                  />
                </div>
              </HeaderNavLayout>
            </UserNotAuthorized>
          </div>
        </DesktopLayout>
      </div>
      <MobileLayout>
        <MobileMenu />
      </MobileLayout>
    </UserNotAuthorized>
  );
}

export default NotAuthorizedControls;
