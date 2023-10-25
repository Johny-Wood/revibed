import { useMemo } from 'react';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import orderBy from 'lodash/orderBy';
import { connect } from 'react-redux';

import ListPageWrapper from '@/components/common/list/ListPageWrapper';
import EventsWrapper from '@/components/events/EventsWrapper';
import NoUserNotifications from '@/components/personal/notifications/_components/NoUserNotifications';
import UserNotification from '@/components/personal/notifications/_components/UserNotification';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';

import styles from './styles.module.scss';

const getUnreadEvents = ({ unreadEvents }) => {
  const { [PersonalNotificationsSectionsConstants.PERSONAL_EVENTS_FEED]: unreadNotificationsEvents = {} } = unreadEvents[0] || {};

  return Object.keys(unreadNotificationsEvents).map((id) => +id);
};

function NotificationsWrapper({
  className,
  itemsListClassName,
  notificationEventsEventClassName,
  userNotificationClassName,
  noResultClassName,
  notifications,
  pageSettings: { page: { currentNumber } = {}, page: pageSettings } = {},
  getInProcess,
  request,
  path,
  scrollId,
  unreadEvents,
}) {
  const notificationsSorted = cloneDeep(orderBy(notifications, ['id'], ['desc']));
  const notificationsIds = useMemo(() => notificationsSorted.map(({ id }) => id), [notificationsSorted]);

  const unreadAllNotificationsIds = useMemo(() => getUnreadEvents({ unreadEvents }), [unreadEvents]);

  const currentUnreadNotificationsIds = useMemo(
    () => unreadAllNotificationsIds.filter((e) => notificationsIds.includes(e)),
    [unreadAllNotificationsIds, notificationsIds]
  );

  return (
    <EventsWrapper
      location={PersonalNotificationsSectionsConstants.PERSONAL_EVENTS_FEED}
      deleteFromAllProjects={false}
      eventsIds={currentUnreadNotificationsIds}
      isStartDeleteUnreadEventsMarkers={currentNumber + 1}
    >
      <div className={classNames([styles.userNotifications, className])}>
        <ListPageWrapper
          className={itemsListClassName}
          blockClassName={styles.itemsList__block}
          location="USER_NOTIFICATIONS"
          inProcess={getInProcess}
          itemComponent={UserNotification}
          itemInnerProps={{
            userNotificationClassName,
            eventClassName: notificationEventsEventClassName,
          }}
          items={notificationsSorted}
          withHeaderControl={false}
          withFiltersAndSort={false}
          pageSettings={pageSettings}
          request={request}
          noResults={{
            text: null,
            component: NoUserNotifications,
            className: noResultClassName,
          }}
          listWithPadding={false}
          path={path}
          scrollId={scrollId}
        />
      </div>
    </EventsWrapper>
  );
}

export default connect((state) => ({
  unreadEvents: state.PersonalNotificationCountsReducer.unreadEvents,
}))(NotificationsWrapper);
