import { RoutePathsConstants } from '@/constants/routes/routes';
import AccountNotificationsSettingsTelegramWrapper from '@/pages/notifications-settings/AccountNotificationsSettingsTelegramWrapper';
import { SSRGetAccountNotificationsSettings } from '@/SSR/requests/account/SSRAccountRequests';

function TelegramNotificationSettingsPage({ token }) {
  return <AccountNotificationsSettingsTelegramWrapper token={token} />;
}

TelegramNotificationSettingsPage.getInitialProps = async (ctx) => {
  const { req, res, query: { token } = {}, store } = ctx;

  const { AuthReducer: { userIsAuthorized } = {} } = store.getState();

  const awaitPromises = [];

  if (!token && !userIsAuthorized && req) {
    res.statusCode = 302;
    res.setHeader('Location', RoutePathsConstants.MAIN);
    res.end();
  }

  if (token || userIsAuthorized) {
    awaitPromises.push(
      SSRGetAccountNotificationsSettings(ctx, {
        targetType: 'TELEGRAM_BOT',
        token,
      })
    );

    await Promise.all(awaitPromises);
  }

  return {
    token,
  };
};

export default TelegramNotificationSettingsPage;
