import PersonalTelegramSettingsPageWrapper from '@/pages/personal/settings/PersonalTelegramSettingsPageWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';
import { SSRGetAccountNotificationsSettings } from '@/SSR/requests/account/SSRAccountRequests';

function PersonalTelegramSettingsPage() {
  return <PersonalTelegramSettingsPageWrapper />;
}

PersonalTelegramSettingsPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(
    SSRGetAccountNotificationsSettings(ctx, {
      targetType: 'TELEGRAM_BOT',
    })
  );

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default withPrivateAuthRoute(PersonalTelegramSettingsPage);
