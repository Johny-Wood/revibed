import api from '@/api';
import { ResetPasswordActionsConstants } from '@/constants/actions/auth/resetPassword';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import { changeUserInfoAction } from './authActions';

import createAction from '../actionCreator';

const resetPasswordLinkInProcessAction = (resetPasswordLinkInProcess) =>
  createAction(ResetPasswordActionsConstants.RESET_PASSWORD_LINK_IN_PROCESS, {
    resetPasswordLinkInProcess,
  });

const resetPasswordInProcessAction = (resetPasswordInProcess) =>
  createAction(ResetPasswordActionsConstants.RESET_PASSWORD_IN_PROCESS, {
    resetPasswordInProcess,
  });

export const resetPasswordLinkRequestAction = (email) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(resetPasswordLinkInProcessAction(true));

    api
      .post('reset-password', { email })
      .then(() => {
        dispatch(resetPasswordLinkInProcessAction(false));
        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(resetPasswordLinkInProcessAction(false));

        reject(errorData);
      });
  });

export const resetPasswordRequestAction = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(resetPasswordInProcessAction(true));

    api
      .put('reset-password', params)
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(resetPasswordInProcessAction(false));
        dispatch(changeUserInfoAction(responseData));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(resetPasswordInProcessAction(false));

        reject(errorData);
      });
  });
