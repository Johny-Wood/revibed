import TelegramBotConnectForm from '@/components/forms/personal/profile/TelegramBotConnectForm';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageAccountLayout from '@/components/layouts/PersonalPageAccountLayout';

const TITLE = 'Telegram Bot';

function PersonalTelegramBotSettingsPageWrapper() {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: TITLE,
      }}
      shownBanners
    >
      <PersonalPageAccountLayout headerText={TITLE}>
        <div className="w-100pct f_direction_column">
          <TelegramBotConnectForm />
        </div>
      </PersonalPageAccountLayout>
    </BaseWebsiteLayout>
  );
}

export default PersonalTelegramBotSettingsPageWrapper;
