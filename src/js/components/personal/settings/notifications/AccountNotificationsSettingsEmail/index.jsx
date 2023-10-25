import { connect } from 'react-redux';

import AccountNotificationsSettingsTable from '@/components/personal/settings/notifications/AccountNotificationsSettingsTable';
import AccountNotificationsSettingsWrapperLayout from '@/components/personal/settings/notifications/AccountNotificationsSettingsWrapperLayout';
import Preloader from '@/components/ui/Preloader';

function AccountNotificationsSettingsEmail({
  className,
  accountNotificationsSettingsTableClassName,
  token,
  template,
  accountNotificationsSettings,
  saveAccountNotificationsSettingsInProcess,
}) {
  return (
    <AccountNotificationsSettingsWrapperLayout className={className}>
      {accountNotificationsSettings.length > 0 ? (
        <AccountNotificationsSettingsTable
          token={token}
          template={template}
          targetType="EMAIL"
          accountNotificationsSettings={accountNotificationsSettings}
          saveInProcess={saveAccountNotificationsSettingsInProcess}
          accountNotificationsSettingsTableClassName={accountNotificationsSettingsTableClassName}
        />
      ) : (
        <Preloader isShown />
      )}
    </AccountNotificationsSettingsWrapperLayout>
  );
}

export default connect((state) => ({
  accountNotificationsSettings: state.AccountNotificationsSettingsEmailReducer.accountNotificationsSettings,
  saveAccountNotificationsSettingsInProcess:
    state.AccountNotificationsSettingsEmailReducer.saveAccountNotificationsSettingsInProcess,
}))(AccountNotificationsSettingsEmail);
