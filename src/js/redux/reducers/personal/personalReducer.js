import { PersonalActionsConstants } from '@/constants/actions/personal/personal';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  changePasswordInProcess: false,

  changePersonalInformationInProcess: false,

  connectTgBotInProcess: false,
  connectTgBotConfirmCode: null,
};

const handlers = createHandlers({
  [PersonalActionsConstants.CHANGE_PASSWORD_IN_PROCESS]: (state, { changePasswordInProcess }) => ({
    ...state,
    changePasswordInProcess,
  }),

  [PersonalActionsConstants.CHANGE_PERSONAL_INFORMATION_IN_PROCESS]: (state, { changePersonalInformationInProcess }) => ({
    ...state,
    changePersonalInformationInProcess,
  }),

  [PersonalActionsConstants.CONNECT_TG_BOT_IN_PROCESS]: (state, { connectTgBotInProcess }) => ({
    ...state,
    connectTgBotInProcess,
  }),

  [PersonalActionsConstants.CONNECT_TG_BOT_SET_CONFIRM_CODE]: (state, { connectTgBotConfirmCode }) => ({
    ...state,
    connectTgBotInProcess: false,
    connectTgBotConfirmCode,
  }),
});

const PersonalReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default PersonalReducer;
