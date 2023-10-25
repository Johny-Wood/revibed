import { connect } from 'react-redux';

import AccountNotificationsSettingsTable from '@/components/personal/settings/notifications/AccountNotificationsSettingsTable';
import AccountNotificationsSettingsWrapperLayout from '@/components/personal/settings/notifications/AccountNotificationsSettingsWrapperLayout';
import Preloader from '@/components/ui/Preloader';

function AccountNotificationsSettingsTelegram({
  token,
  accountNotificationsSettings,
  saveAccountNotificationsSettingsInProcess,
  className,
  accountNotificationsSettingsTableClassName,
  accountNotificationsTreeClassName,
  accountNotificationsTreeBranchClassName,
  accountNotificationsSettingsButtonSaveClassName,
}) {
  return (
    <AccountNotificationsSettingsWrapperLayout className={className}>
      {accountNotificationsSettings.length > 0 ? (
        <AccountNotificationsSettingsTable
          token={token}
          targetType="TELEGRAM_BOT"
          accountNotificationsSettings={accountNotificationsSettings}
          saveInProcess={saveAccountNotificationsSettingsInProcess}
          accountNotificationsSettingsTableClassName={accountNotificationsSettingsTableClassName}
          accountNotificationsTreeClassName={accountNotificationsTreeClassName}
          accountNotificationsTreeBranchClassName={accountNotificationsTreeBranchClassName}
          accountNotificationsSettingsButtonSaveClassName={accountNotificationsSettingsButtonSaveClassName}
        />
      ) : (
        <Preloader isShown />
      )}
    </AccountNotificationsSettingsWrapperLayout>
  );
}

export default connect((state) => ({
  accountNotificationsSettings: state.AccountNotificationsSettingsTelegramReducer.accountNotificationsSettings,
  saveAccountNotificationsSettingsInProcess:
    state.AccountNotificationsSettingsTelegramReducer.saveAccountNotificationsSettingsInProcess,
}))(AccountNotificationsSettingsTelegram);
