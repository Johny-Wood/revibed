import { useMemo } from 'react';

import dynamic from 'next/dynamic';
import { connect } from 'react-redux';

import { notificationCountsMapUtil } from '@/utils/user-notifications/userNotificationsUtil';

const NotificationCount = dynamic(() => import('@/components/common/Notification/NotificationCount'), { ssr: false });

function NotificationSectionCount({
  withNotifications = true,
  keysMenuNotification = [],

  newArrivalsProjects,
  variablesList,
  unreadEvents,
  unreadMessagesCount,
  className,
}) {
  const notificationCountsMap = useMemo(
    () =>
      notificationCountsMapUtil({
        adminUnreadMessagesCount: unreadMessagesCount,
        newArrivalsIds: newArrivalsProjects.map(({ id }) => id),
        variablesList,
        unreadEvents,
      }),
    [variablesList, unreadEvents, unreadMessagesCount, newArrivalsProjects]
  );

  const count = useMemo(
    () =>
      Object.keys(notificationCountsMap)
        .filter((key) => keysMenuNotification.includes(key))
        .map((key) => notificationCountsMap[key])
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0),
    [keysMenuNotification, notificationCountsMap]
  );

  return <NotificationCount className={className} withCount count={withNotifications ? count : 0} />;
}

export default connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,
  unreadMessagesCount: state.AdminDialogReducer.unreadMessagesCount,
  unreadEvents: state.PersonalNotificationCountsReducer.unreadEvents,
  newArrivalsProjects: state.NewArrivalsProjectsReducer.projects,
}))(NotificationSectionCount);
