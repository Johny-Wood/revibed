import TabContent from '@/components/common/tabs/TabContent';
import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import PersonalPageAccountLayout from '@/components/layouts/PersonalPageAccountLayout';
import AccountNotificationsSettingsEmail from '@/components/personal/settings/notifications/AccountNotificationsSettingsEmail';
import AccountSettingsNotificationsPageWrapper from '@/components/personal/settings/notifications/AccountSettingsNotificationsPageWrapper';

const TITLE = 'Email Notifications';

function PersonalEmailSettingsPageWrapper() {
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
            <AccountNotificationsSettingsEmail />
          </TabContent>
        </AccountSettingsNotificationsPageWrapper>
      </PersonalPageAccountLayout>
    </BaseWebsiteLayout>
  );
}

export default PersonalEmailSettingsPageWrapper;
