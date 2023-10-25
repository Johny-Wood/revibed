import CreateAccountNotificationsSettingsReducer from './createAccountNotificationsSettingsReducer';

const AccountNotificationsSettingsEmailReducer = (state, action) =>
  CreateAccountNotificationsSettingsReducer(state, action, 'EMAIL');

export default AccountNotificationsSettingsEmailReducer;
