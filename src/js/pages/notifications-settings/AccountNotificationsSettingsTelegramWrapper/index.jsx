import BaseWebsiteLayout from '@/components/layouts/BaseWebsiteLayout';
import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import AccountNotificationsSettingsTelegram from '@/components/personal/settings/notifications/AccountNotificationsSettingsTelegram';

import styles from './styles.module.scss';

function AccountNotificationsSettingsTelegramWrapper({ token }) {
  return (
    <BaseWebsiteLayout
      withoutHeader
      withoutFooter
      headSettings={{
        title: 'Telegram notification settings',
      }}
      pageName={styles.pageTelegramNotificationSettings}
    >
      <SiteWrapperLayout firstInPage withPadding={false}>
        <AccountNotificationsSettingsTelegram
          token={token}
          className={styles.accountNotificationsSettingsWrapper}
          accountNotificationsSettingsTableClassName={styles.accountNotificationsSettings}
          accountNotificationsTreeClassName={styles.accountNotificationsTree}
          accountNotificationsTreeBranchClassName={styles.accountNotificationsTree__branch}
          accountNotificationsSettingsButtonSaveClassName={styles.buttonSave}
        />
      </SiteWrapperLayout>
    </BaseWebsiteLayout>
  );
}

export default AccountNotificationsSettingsTelegramWrapper;
