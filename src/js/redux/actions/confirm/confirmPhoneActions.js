import api from '@/api';
import { ConfirmPhoneActionsConstants } from '@/constants/actions/confirm/confirmPhone';
import { PointsTypesConstants } from '@/constants/points/type';
import { addPersonalActivePointsAction } from '@/redux-actions/personal/activePointsActions';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';
import { changeUserInfoAction } from '../auth/authActions';

const getConfirmPhoneCodeInProcessAction = (getConfirmPhoneCodeInProcess) =>
  createAction(ConfirmPhoneActionsConstants.GET_CONFIRM_PHONE_CODE_IN_PROCESS, {
    getConfirmPhoneCodeInProcess,
  });

const getConfirmPhoneCodeSuccessAction = () => createAction(ConfirmPhoneActionsConstants.GET_CONFIRM_PHONE_CODE_SUCCESS);

export const getConfirmPhoneCodeRequestAction = (params, dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(getConfirmPhoneCodeInProcessAction(true));

    api
      .post('personal/confirm-phone/send-code', params)
      .then(({ data: { data: { confirmByEmail, updatedUser } = {} } = {} }) => {
        dispatch(getConfirmPhoneCodeSuccessAction());
        dispatch(changeUserInfoAction(updatedUser));

        resolve(confirmByEmail);
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        dispatch(getConfirmPhoneCodeInProcessAction(false));

        reject(errorData);
      });
  });

const sendConfirmPhoneCodeInProcessAction = (sendConfirmPhoneCodeInProcess) =>
  createAction(ConfirmPhoneActionsConstants.SEND_CONFIRM_PHONE_CODE_IN_PROCESS, {
    sendConfirmPhoneCodeInProcess,
  });

const sendConfirmPhoneCodeSuccessAction = () => createAction(ConfirmPhoneActionsConstants.SEND_CONFIRM_PHONE_CODE_SUCCESS);

export const sendConfirmPhoneCodeRequestAction = (params, dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(sendConfirmPhoneCodeInProcessAction(true));

    api
      .post('personal/confirm-phone/verify', params)
      .then(({ data: { data: updatedUser = {}, payload: { accruedGoldenCoin } = {} } = {} }) => {
        dispatch(sendConfirmPhoneCodeSuccessAction());
        dispatch(changeUserInfoAction(updatedUser));
        dispatch(
          addPersonalActivePointsAction({
            type: PointsTypesConstants.GOLDEN_COIN,
            personalActivePoints: [accruedGoldenCoin],
          })
        );

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        dispatch(sendConfirmPhoneCodeInProcessAction(false));

        reject(errorData);
      });
  });

const cancelConfirmPhoneCodeInProcessAction = (cancelConfirmPhoneCodeInProcess) =>
  createAction(ConfirmPhoneActionsConstants.CANCEL_CONFIRM_PHONE_CODE_IN_PROCESS, {
    cancelConfirmPhoneCodeInProcess,
  });

const cancelConfirmPhoneCodeSuccessAction = () => createAction(ConfirmPhoneActionsConstants.CANCEL_CONFIRM_PHONE_CODE_SUCCESS);

export const changeConfirmPhoneEmailRequestLastDateAction = (confirmPhoneEmailRequestLastDate) =>
  createAction(ConfirmPhoneActionsConstants.CHANGE_CONFIRM_PHONE_EMAIL_REQUEST_LAST_DATE, {
    confirmPhoneEmailRequestLastDate,
  });

export const cancelConfirmPhoneCodeRequestAction = (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(cancelConfirmPhoneCodeInProcessAction(true));

    api
      .delete('personal/confirm-phone')
      .then(({ data: { data: updatedUser = {} } = {} }) => {
        dispatch(cancelConfirmPhoneCodeSuccessAction());
        dispatch(changeUserInfoAction(updatedUser));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        dispatch(cancelConfirmPhoneCodeInProcessAction(false));

        reject(errorData);
      });
  });
