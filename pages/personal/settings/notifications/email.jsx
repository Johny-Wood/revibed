import PersonalEmailSettingsPageWrapper from '@/pages/personal/settings/PersonalEmailSettingsPageWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';
import { SSRGetAccountNotificationsSettings } from '@/SSR/requests/account/SSRAccountRequests';

function PersonalEmailSettingsPage() {
  return <PersonalEmailSettingsPageWrapper />;
}

PersonalEmailSettingsPage.getInitialProps = async (ctx) => {
  const awaitPromises = [];

  awaitPromises.push(
    SSRGetAccountNotificationsSettings(ctx, {
      targetType: 'EMAIL',
    })
  );

  await Promise.all(awaitPromises);

  return { props: {} };
};

export default withPrivateAuthRoute(PersonalEmailSettingsPage);
