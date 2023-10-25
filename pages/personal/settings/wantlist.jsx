import PersonalWantlistSettingsPageWrapper from '@/pages/personal/settings/PersonalWantlistSettingsPageWrapper';
import { withPrivateAuthRoute } from '@/services/auth/WithPrivateAuthRoute';

function PersonalWantlistSettingsPage() {
  return <PersonalWantlistSettingsPageWrapper />;
}

export default withPrivateAuthRoute(PersonalWantlistSettingsPage);
