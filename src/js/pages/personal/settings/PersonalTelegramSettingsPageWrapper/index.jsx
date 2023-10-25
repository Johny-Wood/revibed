import TabContent from '@/components/common/tabs/TabContent';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageAccountLayout from '@/components/layouts/PersonalPageAccountLayout';
import AccountNotificationsSettingsTelegram from '@/components/personal/settings/notifications/AccountNotificationsSettingsTelegram';
import AccountSettingsNotificationsPageWrapper from '@/components/personal/settings/notifications/AccountSettingsNotificationsPageWrapper';

const TITLE = 'Telegram Bot Notifications';

function PersonalTelegramSettingsPageWrapper() {
  return (
    <BaseWebsiteLayout
      headSettings={{
        title: TITLE,
      }}
      shownBanners
    >
      <PersonalPageAccountLayout>
        <AccountSettingsNotificationsPageWrapper>
          <TabContent>
            <AccountNotificationsSettingsTelegram />
          </TabContent>
        </AccountSettingsNotificationsPageWrapper>
      </PersonalPageAccountLayout>
    </BaseWebsiteLayout>
  );
}

export default PersonalTelegramSettingsPageWrapper;
