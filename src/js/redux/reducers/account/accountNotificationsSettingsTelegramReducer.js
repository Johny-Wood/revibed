import CreateAccountNotificationsSettingsReducer from './createAccountNotificationsSettingsReducer';

const AccountNotificationsSettingsTelegramReducer = (state, action) =>
  CreateAccountNotificationsSettingsReducer(state, action, 'TELEGRAM_BOT');

export default AccountNotificationsSettingsTelegramReducer;
