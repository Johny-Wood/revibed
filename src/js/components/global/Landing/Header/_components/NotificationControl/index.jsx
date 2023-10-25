import { useEffect, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';
import size from 'lodash/size';
import { connect } from 'react-redux';

import NotificationSectionCount from '@/components/common/Notification/NotificationSectionCount';
import NotificationControlContent from '@/components/global/Header/_components/NotificationControl/_components/NotificationControlContent';
import Button from '@/components/ui/buttons/Button';
import ComponentsCommonConstants from '@/constants/components/common';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import NotificationsIcon from '@/icons/NotificationsIcon';

import styles from './styles.module.scss';

function NotificationControl({
  newShortPersonalUserNotificationsDate,
  getShortPersonalUserNotificationsInProcess,
  shortPageSettings,
  shortPersonalUserNotifications,
  unreadEvents,
  color,
}) {
  const { isDesktop, width } = ViewportHook();

  const newShortPersonalUserNotificationsDatePrev = useRef(0);
  const isNewEventTimer = useRef(null);

  const [isNewEvent, setIsNewEvent] = useState(false);

  const { PERSONAL_EVENTS_FEED = {} } = useMemo(() => unreadEvents[0] || {}, [unreadEvents]);

  useEffect(() => {
    newShortPersonalUserNotificationsDatePrev.current = newShortPersonalUserNotificationsDate;
  }, [newShortPersonalUserNotificationsDate]);

  useEffect(() => {
    if (
      newShortPersonalUserNotificationsDate > 0 &&
      newShortPersonalUserNotificationsDatePrev.current !== newShortPersonalUserNotificationsDate &&
      !isNewEvent &&
      size(PERSONAL_EVENTS_FEED) > 0
    ) {
      newShortPersonalUserNotificationsDatePrev.current = newShortPersonalUserNotificationsDate;
      setIsNewEvent(true);

      isNewEventTimer.current = setTimeout(() => {
        setIsNewEvent(false);
      }, 2000);
    }
  }, [PERSONAL_EVENTS_FEED, isNewEvent, newShortPersonalUserNotificationsDate]);

  useEffect(
    () => () => {
      clearTimeout(isNewEventTimer.current);
    },
    []
  );

  return (
    <div className={classNames([styles.notificationsControl, isNewEvent && styles.notificationsControl_new])}>
      <Button
        type="button_string"
        tooltip={{
          canShow: true,
          color: 'white',
          withCloseButton: false,
          size: ComponentsCommonConstants.Size.LARGE,
          width: 400,
          position: isDesktop ? 'bottom-center' : width > 500 && 'bottom-right',
          childrenEnd: NotificationControlContent,
          childrenEndProps: {
            shortPersonalUserNotifications,
            getShortPersonalUserNotificationsInProcess,
            shortPageSettings,
            userNotificationClassName: styles.userNotification,
            noResultClassName: styles.noResult,
            notificationEventsEventClassName: styles.notificationEvent__event,
          },
          hover: false,
          childrenIn: true,
        }}
      >
        <NotificationsIcon color={color} />
        <NotificationSectionCount
          className={styles.notificationCount}
          keysMenuNotification={[PersonalNotificationsSectionsConstants.PERSONAL_EVENTS_FEED]}
        />
      </Button>
    </div>
  );
}

export default connect((state) => ({
  getShortPersonalUserNotificationsInProcess: state.PersonalUserNotificationsReducer.getShortPersonalUserNotificationsInProcess,
  shortPageSettings: state.PersonalUserNotificationsReducer.shortPageSettings,
  shortPersonalUserNotifications: state.PersonalUserNotificationsReducer.shortPersonalUserNotifications,
  newShortPersonalUserNotificationsDate: state.PersonalUserNotificationsReducer.newShortPersonalUserNotificationsDate,
  unreadEvents: state.PersonalNotificationCountsReducer.unreadEvents,
}))(NotificationControl);
