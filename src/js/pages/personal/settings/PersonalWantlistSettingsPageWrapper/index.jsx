import WantListSettingsForm from '@/components/forms/personal/profile/WantListSettingsForm';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageAccountLayout from '@/components/layouts/PersonalPageAccountLayout';

const TITLE = 'Wantlist Settings';

function PersonalWantlistSettingsPageWrapper() {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: TITLE,
      }}
      shownBanners
    >
      <PersonalPageAccountLayout headerText={TITLE}>
        <div className="w-100pct f_direction_column">
          <WantListSettingsForm />
        </div>
      </PersonalPageAccountLayout>
    </BaseWebsiteLayout>
  );
}

export default PersonalWantlistSettingsPageWrapper;
