import api from '@/api';
import { ConfirmEmailActionsConstants } from '@/constants/actions/confirm/confirmEmail';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';
import { changeUserInfoAction } from '../auth/authActions';

const confirmEmailInProcessAction = (confirmEmailInProcess) =>
  createAction(ConfirmEmailActionsConstants.CONFIRM_EMAIL_IN_PROCESS, {
    confirmEmailInProcess,
  });

export const confirmEmailRequestAction = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(confirmEmailInProcessAction(true));

    api
      .put('confirm-email', params)
      .then(({ data: { payload = {}, data: responseData = {} } = {} }) => {
        dispatch(confirmEmailInProcessAction(false));
        dispatch(changeUserInfoAction(responseData));

        resolve({
          data: responseData,
          payload,
        });
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(confirmEmailInProcessAction(false));

        reject(errorData);
      });
  });

const sendEmailForConfirmInProcessAction = (sendEmailForConfirmInProcess) =>
  createAction(ConfirmEmailActionsConstants.SEND_EMAIL_FOR_CONFIRM_IN_PROCESS, {
    sendEmailForConfirmInProcess,
  });

export const sendEmailForConfirmRequestAction = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(sendEmailForConfirmInProcessAction(true));

    api
      .post('confirm-email', params)
      .then(() => {
        dispatch(sendEmailForConfirmInProcessAction(false));
        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(sendEmailForConfirmInProcessAction(false));

        reject(errorData);
      });
  });
