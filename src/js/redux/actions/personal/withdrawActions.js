import axios from 'axios';
import qs from 'qs';

import api from '@/api';
import { WithdrawActionsConstants } from '@/constants/actions/personal/withdraw';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

const loadWithdrawHistoryInProcessAction = (loadWithdrawHistoryInProcess) =>
  createAction(WithdrawActionsConstants.LOAD_WITHDRAW_HISTORY_IN_PROCESS, {
    loadWithdrawHistoryInProcess,
  });

const loadWithdrawHistorySuccessAction = (withdrawHistory, withdrawHistoryPageSettings) =>
  createAction(WithdrawActionsConstants.LOAD_WITHDRAW_HISTORY_SUCCESS, {
    withdrawHistory,
    withdrawHistoryPageSettings,
  });

export const loadWithdrawHistoryRequestAction = ({ pageSize, pageNumber, dispatch }) =>
  new Promise((resolve, reject) => {
    const { store } = ReduxStoreService.getInstance();

    const { withdrawHistoryPageSettings: { page: { currentNumber: page, size } = {} } = {} } = store.getState().WithdrawReducer;

    dispatch(loadWithdrawHistoryInProcessAction(true));

    api
      .get('personal/withdraws', {
        params: {
          size: pageSize || size,
          page: pageNumber || pageNumber === 0 ? pageNumber : page,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: responseData = {}, payload: payloadData = {} } = {} }) => {
        dispatch(loadWithdrawHistorySuccessAction(responseData, payloadData));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(loadWithdrawHistoryInProcessAction(false));

        reject(errorData);
      });
  });

const getWithdrawInfoInProcessAction = (getWithdrawInfoInProcess) =>
  createAction(WithdrawActionsConstants.GET_WITHDRAW_INFO_IN_PROCESS, {
    getWithdrawInfoInProcess,
  });

let cancelGetWithdrawInfoRequest;
export const getWithdrawInfoRequestAction = ({ amount, dispatch }) =>
  new Promise((resolve) => {
    if (cancelGetWithdrawInfoRequest) {
      cancelGetWithdrawInfoRequest.cancel();
    }

    cancelGetWithdrawInfoRequest = axios.CancelToken.source();

    dispatch(getWithdrawInfoInProcessAction(true));

    api
      .get('personal/withdraws/info', {
        cancelToken: cancelGetWithdrawInfoRequest.token,
        params: {
          amount: amount || 0,
        },
      })
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(getWithdrawInfoInProcessAction(false));

        resolve(responseData);
      })
      .catch((error) => {
        dispatch(getWithdrawInfoInProcessAction(axios.isCancel(error)));
      });
  });

const withdrawInProcessAction = (withdrawInProcess) =>
  createAction(WithdrawActionsConstants.WITHDRAW_IN_PROCESS, {
    withdrawInProcess,
  });

export const withdrawRequestAction = ({ payPalAccount, withdrawalAmount, saveAccount, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(withdrawInProcessAction(true));

    api
      .post('personal/withdraws', {
        payPalAccount,
        withdrawalAmount,
        saveAccount,
      })
      .then(() => {
        dispatch(withdrawInProcessAction(false));

        loadWithdrawHistoryRequestAction({ dispatch }).then();

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(withdrawInProcessAction(false));

        reject(errorData);
      });
  });

const confirmWithdrawInProcessAction = (confirmWithdrawInProcess) =>
  createAction(WithdrawActionsConstants.CONFIRM_WITHDRAW_IN_PROCESS, {
    confirmWithdrawInProcess,
  });

const confirmWithdrawSuccessAction = ({ withdrawId, withdrawItem }) =>
  createAction(WithdrawActionsConstants.CONFIRM_WITHDRAW_SUCCESS, {
    withdrawItem,
    withdrawId,
  });

export const confirmWithdrawRequestAction = ({ confirmWithdrawId, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(confirmWithdrawInProcessAction(true));

    api
      .put(`personal/withdraws/${confirmWithdrawId}`)
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(
          confirmWithdrawSuccessAction({
            withdrawId: confirmWithdrawId,
            withdrawItem: responseData,
          })
        );

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        dispatch(confirmWithdrawInProcessAction(false));

        reject(errorData);
      });
  });
