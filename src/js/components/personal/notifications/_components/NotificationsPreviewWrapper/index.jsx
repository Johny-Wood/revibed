import { connect } from 'react-redux';

import NotificationsWrapper from '@/components/personal/notifications';
import Preloader from '@/components/ui/Preloader';
import ComponentsCommonConstants from '@/constants/components/common';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';

import styles from './styles.module.scss';

function NotificationsPreviewWrapper({
  notifications,
  getShortPersonalUserNotificationsInfoFromApi,
  getShortPersonalUserNotificationsInProcess,
  userNotificationClassName,
  noResultClassName,
  notificationEventsEventClassName,
}) {
  return (
    <>
      <Preloader
        isShown={getShortPersonalUserNotificationsInProcess && !getShortPersonalUserNotificationsInfoFromApi}
        type="container"
        withOffsets={false}
        size={ComponentsCommonConstants.Size.SMALL}
      />
      <NotificationsWrapper
        className={styles.userNotificationsPreview}
        itemsListClassName={styles.itemsList}
        notifications={notifications}
        getNotificationsFromApi={getShortPersonalUserNotificationsInfoFromApi}
        getNotificationsInProcess={getShortPersonalUserNotificationsInProcess}
        path={RoutePathsConstants.USER_NOTIFICATIONS}
        scrollId={ScrollBlockIdConstants.USER_NOTIFICATIONS_PREVIEW}
        userNotificationClassName={userNotificationClassName}
        noResultClassName={noResultClassName}
        notificationEventsEventClassName={notificationEventsEventClassName}
      />
    </>
  );
}

export default connect((state) => ({
  getShortPersonalUserNotificationsInfoFromApi:
    state.PersonalUserNotificationsReducer.getShortPersonalUserNotificationsInfoFromApi,
  getShortPersonalUserNotificationsInProcess: state.PersonalUserNotificationsReducer.getShortPersonalUserNotificationsInProcess,
}))(NotificationsPreviewWrapper);
