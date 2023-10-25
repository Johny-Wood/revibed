import api from '@/api';
import { PersonalActionsConstants } from '@/constants/actions/personal/personal';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';
import { changeUserInfoAction, updateUserInfoAction } from '../auth/authActions';

const changePasswordInProcessAction = (changePasswordInProcess) =>
  createAction(PersonalActionsConstants.CHANGE_PASSWORD_IN_PROCESS, {
    changePasswordInProcess,
  });

const changePersonalInformationInProcessAction = (changePersonalInformationInProcess) =>
  createAction(PersonalActionsConstants.CHANGE_PERSONAL_INFORMATION_IN_PROCESS, {
    changePersonalInformationInProcess,
  });

export const changePasswordRequestAction = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(changePasswordInProcessAction(true));

    api
      .put('personal/change-password', params)
      .then(() => {
        dispatch(changePasswordInProcessAction(false));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(changePasswordInProcessAction(false));

        reject(errorData);
      });
  });

export const changePersonalInformationRequestAction = (formData) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(changePersonalInformationInProcessAction(true));

    api
      .put('personal/info', formData)
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(changePersonalInformationInProcessAction(false));
        dispatch(changeUserInfoAction(responseData));

        resolve(responseData);
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(changePersonalInformationInProcessAction(false));

        reject(errorData);
      });
  });

const connectTgBotInProcessAction = (connectTgBotInProcess) =>
  createAction(PersonalActionsConstants.CONNECT_TG_BOT_IN_PROCESS, {
    connectTgBotInProcess,
  });

const connectTgBotSetConfirmCodeAction = (connectTgBotConfirmCode) =>
  createAction(PersonalActionsConstants.CONNECT_TG_BOT_SET_CONFIRM_CODE, {
    connectTgBotConfirmCode,
  });

export const connectTgBotRequestAction = () => (dispatch) => {
  dispatch(connectTgBotInProcessAction(true));

  api
    .put('personal/tg-code')
    .then(({ data: { data: { code } = {} } = {} }) => {
      dispatch(connectTgBotSetConfirmCodeAction(code));
    })
    .catch((error) => {
      console.error(error);

      dispatch(updateUserInfoAction({ tgActive: true }));
      dispatch(connectTgBotInProcessAction(false));
    });
};
