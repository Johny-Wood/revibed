import { connect } from 'react-redux';

import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageLayout from '@/components/layouts/PersonalPageLayout';
import NotificationsWrapper from '@/components/personal/notifications';
import MarkAsReadButton from '@/components/personal/notifications/_components/MarkAsReadButton';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import { getPersonalUserNotificationsRequestAction } from '@/redux-actions/personal/personalUserNotificationsActions';

import styles from './styles.module.scss';

const metaTitle = 'Notifications';

function NotificationsPageWrapper({
  personalUserNotifications,
  getPersonalUserNotificationsFromApi,
  getPersonalUserNotificationsInProcess,
  pageSettings,
  getPersonalUserNotificationsRequest,
}) {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: metaTitle,
      }}
      shownBanners
    >
      <PersonalPageLayout headerContent={MarkAsReadButton} pageHeaderClassName={styles.NotificationsPageWrapper}>
        <NotificationsWrapper
          notifications={personalUserNotifications}
          getFromApi={getPersonalUserNotificationsFromApi}
          getInProcess={getPersonalUserNotificationsInProcess}
          pageSettings={{ page: pageSettings }}
          request={getPersonalUserNotificationsRequest}
          path={RoutePathsConstants.USER_NOTIFICATIONS}
          scrollId={ScrollBlockIdConstants.USER_NOTIFICATIONS}
        />
      </PersonalPageLayout>
    </BaseWebsiteLayout>
  );
}

export default connect(
  (state) => ({
    personalUserNotifications: state.PersonalUserNotificationsReducer.personalUserNotifications,
    getPersonalUserNotificationsFromApi: state.PersonalUserNotificationsReducer.getPersonalUserNotificationsFromApi,
    getPersonalUserNotificationsInProcess: state.PersonalUserNotificationsReducer.getPersonalUserNotificationsInProcess,
    pageSettings: state.PersonalUserNotificationsReducer.pageSettings,
  }),
  (dispatch) => ({
    getPersonalUserNotificationsRequest: (params) => getPersonalUserNotificationsRequestAction({ ...params, dispatch }),
  })
)(NotificationsPageWrapper);
