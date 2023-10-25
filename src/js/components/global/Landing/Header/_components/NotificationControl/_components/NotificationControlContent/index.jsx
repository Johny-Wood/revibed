import { useEffect, useState } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import InfinityScrollWithScrollbarLayout from '@/components/layouts/InfinityScrollWithScrollbarLayout';
import MarkAsReadButton from '@/components/personal/notifications/_components/MarkAsReadButton';
import NotificationsPreviewWrapper from '@/components/personal/notifications/_components/NotificationsPreviewWrapper';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { getShortPersonalUserNotificationsRequestAction } from '@/redux-actions/personal/personalUserNotificationsActions';

import styles from './styles.module.scss';

function NotificationControlContent({
  shown,
  getShortPersonalUserNotificationsInProcess,
  shortPageSettings,
  shortPersonalUserNotifications,
  getShortPersonalUserNotificationsRequest,
  userNotificationClassName,
  noResultClassName,
  notificationEventsEventClassName,
}) {
  const [list, setList] = useState(shortPersonalUserNotifications);
  const [pageSettingsState, setPageSettingsState] = useState(shortPageSettings);

  useEffect(() => {
    setList(shortPersonalUserNotifications);
  }, [shortPersonalUserNotifications]);

  useEffect(() => {
    setPageSettingsState(shortPageSettings);
  }, [shortPageSettings]);

  return (
    <div className={styles.notificationsControl__content}>
      <div
        className={classNames([
          styles.notificationsControl__header,
          'p-bottom-10',
          `f-x-${list.length > 0 ? 'between' : 'center'}`,
        ])}
      >
        <b>Notifications</b>
        {list.length > 0 && <MarkAsReadButton />}
      </div>
      <div className={styles.notificationsControl__items}>
        <InfinityScrollWithScrollbarLayout
          width="100%"
          height={`calc((1rem * ${77 * 5.5} / var(--font-size__small-int))`}
          isInProcess={getShortPersonalUserNotificationsInProcess}
          pageSettings={pageSettingsState}
          request={getShortPersonalUserNotificationsRequest}
          requestCallback={({ list: newList, pageSettings: newPageSettings }) => {
            setList([...list, ...newList]);
            setPageSettingsState(newPageSettings);
          }}
          contentLength={list.length}
        >
          <NotificationsPreviewWrapper
            shown={shown}
            notifications={list}
            userNotificationClassName={userNotificationClassName}
            notificationEventsEventClassName={notificationEventsEventClassName}
            noResultClassName={noResultClassName}
          />
        </InfinityScrollWithScrollbarLayout>
      </div>
      {list.length > 0 && (
        <div>
          <LinkRoute
            href={RoutePathsConstants.USER_NOTIFICATIONS}
            type="button_string"
            text="Show all"
            className="m-top-10 c-blue t-semi-bold"
          />
        </div>
      )}
    </div>
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    getShortPersonalUserNotificationsRequest: (params) =>
      getShortPersonalUserNotificationsRequestAction({
        ...params,
        dispatch,
      }),
  })
)(NotificationControlContent);
