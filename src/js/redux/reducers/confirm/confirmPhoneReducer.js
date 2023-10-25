import { ConfirmPhoneActionsConstants } from '@/constants/actions/confirm/confirmPhone';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getConfirmPhoneCodeInProcess: false,
  sendConfirmPhoneCodeInProcess: false,
  cancelConfirmPhoneCodeInProcess: false,

  confirmPhoneEmailRequestLastDate: 0,
};

const handlers = createHandlers({
  [ConfirmPhoneActionsConstants.GET_CONFIRM_PHONE_CODE_IN_PROCESS]: (state, { getConfirmPhoneCodeInProcess }) => ({
    ...state,
    getConfirmPhoneCodeInProcess,
  }),
  [ConfirmPhoneActionsConstants.GET_CONFIRM_PHONE_CODE_SUCCESS]: (state) => ({
    ...state,
    getConfirmPhoneCodeInProcess: false,
  }),

  [ConfirmPhoneActionsConstants.SEND_CONFIRM_PHONE_CODE_IN_PROCESS]: (state, { sendConfirmPhoneCodeInProcess }) => ({
    ...state,
    sendConfirmPhoneCodeInProcess,
  }),
  [ConfirmPhoneActionsConstants.SEND_CONFIRM_PHONE_CODE_SUCCESS]: (state) => ({
    ...state,
    sendConfirmPhoneCodeInProcess: false,
  }),

  [ConfirmPhoneActionsConstants.CANCEL_CONFIRM_PHONE_CODE_IN_PROCESS]: (state, { cancelConfirmPhoneCodeInProcess }) => ({
    ...state,
    cancelConfirmPhoneCodeInProcess,
  }),
  [ConfirmPhoneActionsConstants.CANCEL_CONFIRM_PHONE_CODE_SUCCESS]: (state) => ({
    ...state,
    cancelConfirmPhoneCodeInProcess: false,
  }),

  [ConfirmPhoneActionsConstants.CHANGE_CONFIRM_PHONE_EMAIL_REQUEST_LAST_DATE]: (
    state,
    { confirmPhoneEmailRequestLastDate = state.confirmPhoneEmailRequestLastDate }
  ) => ({
    ...state,
    confirmPhoneEmailRequestLastDate,
  }),
});

const ConfirmPhoneReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default ConfirmPhoneReducer;
