import { useMemo } from 'react';

import classNames from 'classnames';

import newMobileMenuAnimation from '@/assets/styles/animations/new-mobile-menu.module.scss';
import NotificationSectionCount from '@/components/common/Notification/NotificationSectionCount';
import UserControlButton from '@/components/global/Header/_components/UserControlBar/_compoenents/UserControl/_components/UserControlButton';
import UserControlContent from '@/components/global/Header/_components/UserControlBar/_compoenents/UserControl/_components/UserControlContent';
import ClosedOnClickLayout from '@/components/layouts/ClosedOnClickLayout';
import { PersonalUserControlNavigationConstants } from '@/constants/navigations/personal';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import ViewportHook from '@/hooks/viewport/ViewportHook';

import styles from './styles.module.scss';

type UserControlProps = {
  className?: string;
};

function UserControl({ className }: UserControlProps) {
  const { isNotDesktop } = ViewportHook();

  const keysMenuNotification = useMemo(
    () =>
      PersonalUserControlNavigationConstants.filter((item) => {
        const { keyMenuNotification } = (item as { keyMenuNotification?: string }) ?? {};
        return (
          keyMenuNotification !== PersonalNotificationsSectionsConstants.PERSONAL_EVENTS_FEED ||
          (keyMenuNotification === PersonalNotificationsSectionsConstants.PERSONAL_EVENTS_FEED && isNotDesktop)
        );
      }).map((item) => {
        const { keyMenuNotification } = (item as { keyMenuNotification?: string }) ?? {};

        return keyMenuNotification;
      }),
    [isNotDesktop]
  );

  return (
    // @ts-ignore
    <ClosedOnClickLayout
      className={classNames(styles.userControl, className)}
      animationDuration={240}
      animationClassNames={{
        enter: newMobileMenuAnimation.newMobileMenuAnimationEnter,
        enterActive: newMobileMenuAnimation.newMobileMenuAnimationEnter_active,
        exit: newMobileMenuAnimation.newMobileMenuAnimationExit,
        exitActive: newMobileMenuAnimation.newMobileMenuAnimationExit_active,
      }}
      button={UserControlButton}
      content={NotificationSectionCount}
      contentProps={{
        keysMenuNotification,
        className: styles.notificationCount,
      }}
    >
      <UserControlContent />
    </ClosedOnClickLayout>
  );
}

export default UserControl;
