import PasswordChangeForm from '@/components/forms/personal/profile/PasswordChangeForm';
import PersonalInformationChangeForm from '@/components/forms/personal/profile/PersonalInformationChangeForm';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageAccountLayout from '@/components/layouts/PersonalPageAccountLayout';

const TITLE = 'Account';

function PersonalSettingsPageWrapper() {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: TITLE,
      }}
      shownBanners
    >
      <PersonalPageAccountLayout headerText={TITLE}>
        <div className="w-100pct f_direction_column">
          <PersonalInformationChangeForm />
          <PasswordChangeForm />
        </div>
      </PersonalPageAccountLayout>
    </BaseWebsiteLayout>
  );
}

export default PersonalSettingsPageWrapper;
