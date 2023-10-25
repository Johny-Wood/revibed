import PersonalTelegramBotSettingsPageWrapper from '@/pages/personal/settings/PersonalTelegramBotSettingsPageWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';

function PersonalTelegramBotSettingsPage() {
  return <PersonalTelegramBotSettingsPageWrapper />;
}

export default withPrivateAuthRoute(PersonalTelegramBotSettingsPage);
