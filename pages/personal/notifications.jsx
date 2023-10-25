import NotificationsPageWrapper from '@/pages/personal/NotificationsPageWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';
import { SSRLoadUserNotifications } from '@/SSR/requests/user-notifications/SSRUserNotificationsRequests';

function NotificationsPage() {
  return <NotificationsPageWrapper />;
}

NotificationsPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(SSRLoadUserNotifications({ ctx }));

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default withPrivateAuthRoute(NotificationsPage);
