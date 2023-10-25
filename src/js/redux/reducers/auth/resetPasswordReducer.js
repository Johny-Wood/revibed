import { ResetPasswordActionsConstants } from '@/constants/actions/auth/resetPassword';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  resetPasswordLinkInProcess: false,
  resetPasswordInProcess: false,
};

const handlers = createHandlers({
  [ResetPasswordActionsConstants.RESET_PASSWORD_LINK_IN_PROCESS]: (state, { resetPasswordLinkInProcess }) => ({
    ...state,
    resetPasswordLinkInProcess,
  }),
  [ResetPasswordActionsConstants.RESET_PASSWORD_IN_PROCESS]: (state, { resetPasswordInProcess }) => ({
    ...state,
    resetPasswordInProcess,
  }),
});

const ResetPasswordReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default ResetPasswordReducer;
