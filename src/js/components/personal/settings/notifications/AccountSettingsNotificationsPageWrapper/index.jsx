import AccountSettingsNotificationsTabs from '@/components/personal/settings/notifications/AccountSettingsNotificationsTabs';

function AccountSettingsNotificationsPageWrapper({ children }) {
  return (
    <>
      <AccountSettingsNotificationsTabs />
      {children}
    </>
  );
}

export default AccountSettingsNotificationsPageWrapper;
