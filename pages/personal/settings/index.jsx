import PersonalSettingsPageWrapper from '@/pages/personal/settings/PersonalSettingsPageWrapper';
import { withPrivateAuthRouteToSignUp } from '@/services/auth/WithPrivateAuthRoute';

function PersonalSettingsPage() {
  return <PersonalSettingsPageWrapper />;
}

export default withPrivateAuthRouteToSignUp(PersonalSettingsPage);
