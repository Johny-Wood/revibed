import { NotificationsSettingsActionsConstants } from '@/constants/actions/notificationsSettings';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  accountNotificationsSettings: [],
  getAccountNotificationsSettingsInProcess: false,
  getAccountNotificationsSettingsFromApi: false,
  saveAccountNotificationsSettingsInProcess: false,
};

const createLocalHandlers = (type) =>
  createHandlers({
    [`${type}_${NotificationsSettingsActionsConstants.GET_ACCOUNT_NOTIFICATIONS_SETTINGS_IN_PROCESS}`]: (
      state,
      { getAccountNotificationsSettingsInProcess = false }
    ) => ({
      ...state,
      getAccountNotificationsSettingsInProcess,
    }),
    [`${type}_${NotificationsSettingsActionsConstants.GET_ACCOUNT_NOTIFICATIONS_SETTINGS_SUCCESS}`]: (
      state,
      { accountNotificationsSettings = [] }
    ) => ({
      ...state,
      getAccountNotificationsSettingsInProcess: false,
      getAccountNotificationsSettingsFromApi: true,
      accountNotificationsSettings,
    }),

    [`${type}_${NotificationsSettingsActionsConstants.SAVE_ACCOUNT_NOTIFICATIONS_SETTINGS_IN_PROCESS}`]: (
      state,
      { saveAccountNotificationsSettingsInProcess = false }
    ) => ({
      ...state,
      saveAccountNotificationsSettingsInProcess,
    }),
    [`${type}_${NotificationsSettingsActionsConstants.SAVE_ACCOUNT_NOTIFICATIONS_SETTINGS_SUCCESS}`]: (state) => ({
      ...state,
      saveAccountNotificationsSettingsInProcess: false,
    }),

    [`${type}_${NotificationsSettingsActionsConstants.CHANGE_ACCOUNT_NOTIFICATIONS_SETTINGS}`]: (
      state,
      { accountNotificationsSettings = {} }
    ) => ({
      ...state,
      saveAccountNotificationsSettingsInProcess: false,
      accountNotificationsSettings,
    }),
  });

const CreateAccountNotificationsSettingsReducer = (state = initialState, action, type) => {
  const handlers = createLocalHandlers(type);

  return createReducer(state, action, handlers);
};

export { createHandlers, createReducer };

export default CreateAccountNotificationsSettingsReducer;
