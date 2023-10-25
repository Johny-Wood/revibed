import { useMemo } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import newMobileMenuAnimation from '@/assets/styles/animations/new-mobile-menu.module.scss';
import NotificationSectionCount from '@/components/common/Notification/NotificationSectionCount';
import UserControlButton from '@/components/global/Header/_components/UserControlBar/_compoenents/UserControl/_components/UserControlButton';
import UserControlContent from '@/components/global/Header/_components/UserControlBar/_compoenents/UserControl/_components/UserControlContent';
import ClosedOnClickLayout from '@/components/layouts/ClosedOnClickLayout';
import { PersonalUserControlNavigationConstants } from '@/constants/navigations/personal';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { signOutRequestAction } from '@/redux-actions/auth/authActions';

import styles from './styles.module.scss';

function UserControl({ className }) {
  const { isNotDesktop } = ViewportHook();

  const keysMenuNotification = useMemo(
    () =>
      PersonalUserControlNavigationConstants.filter(
        ({ keyMenuNotification }) =>
          keyMenuNotification !== PersonalNotificationsSectionsConstants.PERSONAL_EVENTS_FEED ||
          (keyMenuNotification === PersonalNotificationsSectionsConstants.PERSONAL_EVENTS_FEED && isNotDesktop)
      ).map(({ keyMenuNotification }) => keyMenuNotification),
    [isNotDesktop]
  );

  return (
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

export default connect(
  () => ({}),
  (dispatch) => ({
    signOut: (params = {}) => signOutRequestAction(params)(dispatch),
  })
)(UserControl);
