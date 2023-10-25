import { ConfirmEmailActionsConstants } from '@/constants/actions/confirm/confirmEmail';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  confirmEmailInProcess: false,
  sendEmailForConfirmInProcess: false,
};

const handlers = createHandlers({
  [ConfirmEmailActionsConstants.CONFIRM_EMAIL_IN_PROCESS]: (state, { confirmEmailInProcess }) => ({
    ...state,
    confirmEmailInProcess,
  }),

  [ConfirmEmailActionsConstants.SEND_EMAIL_FOR_CONFIRM_IN_PROCESS]: (state, { sendEmailForConfirmInProcess }) => ({
    ...state,
    sendEmailForConfirmInProcess,
  }),
});

const ConfirmEmailReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default ConfirmEmailReducer;
