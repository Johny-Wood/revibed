import qs from 'qs';

import api from '@/api';
import { PaymentsActionsConstants } from '@/constants/actions/payments';
import ReduxStoreService from '@/services/ReduxStoreService';
import { analyticsStandartPush } from '@/utils/analytics/analyticsPushers';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import { resetLoadPersonalBalanceFromApiAction } from './balanceActions';

import createAction from '../actionCreator';

const analyticsBuyCoinsPush = ({ amount, coinsCount }) => {
  analyticsStandartPush({
    event: 'buy_coins',
    quantity: coinsCount,
    value: amount,
    currency: 'EUR',
  });
};

const payPalPaymentExecuteInProcessAction = (payPalPaymentExecuteInProcess) =>
  createAction(PaymentsActionsConstants.PAY_PAL_PAYMENT_EXECUTE_IN_PROCESS, {
    payPalPaymentExecuteInProcess,
  });

export const payPalPaymentExecuteRequestAction = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(payPalPaymentExecuteInProcessAction(true));

    api
      .put('payments/paypal-endpoint/execute', {
        ...params,
      })
      .then(({ data: { payload: { payment: { amount, coinsCount } = {} } = {} } = {} }) => {
        dispatch(payPalPaymentExecuteInProcessAction(false));
        dispatch(resetLoadPersonalBalanceFromApiAction());

        analyticsBuyCoinsPush({ amount, coinsCount });

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        dispatch(payPalPaymentExecuteInProcessAction(false));

        reject(errorData);
      });
  });

const payPalPaymentCancelInProcessAction = (payPalPaymentCancelInProcess) =>
  createAction(PaymentsActionsConstants.PAY_PAL_PAYMENT_CANCEL_IN_PROCESS, {
    payPalPaymentCancelInProcess,
  });

export const payPalPaymentCancelRequestAction = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(payPalPaymentCancelInProcessAction(true));

    api
      .put('payments/paypal-endpoint/cancel', {
        ...params,
      })
      .then(() => {
        dispatch(payPalPaymentCancelInProcessAction(false));

        resolve();
      })
      .catch(() => {
        reject();
      });
  });

const stripePaymentCancelInProcessAction = (stripePaymentCancelInProcess) =>
  createAction(PaymentsActionsConstants.STRIPE_PAYMENT_CANCEL_IN_PROCESS, {
    stripePaymentCancelInProcess,
  });

export const stripePaymentCancelRequestAction = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(stripePaymentCancelInProcessAction(true));

    api
      .delete('payments/stripe/cancel', {
        data: {
          ...params,
        },
      })
      .then(() => {
        dispatch(stripePaymentCancelInProcessAction(false));

        resolve();
      })
      .catch(() => {
        reject();
      });
  });

const stripePaymentExecuteInProcessAction = (stripePaymentExecuteInProcess) =>
  createAction(PaymentsActionsConstants.STRIPE_PAYMENT_EXECUTE_IN_PROCESS, {
    stripePaymentExecuteInProcess,
  });

export const stripePaymentExecuteRequestAction = (params) => (dispatch) =>
  new Promise((resolve, reject) => {
    dispatch(stripePaymentExecuteInProcessAction(true));

    api
      .get('payments/stripe/success', {
        params: {
          ...params,
        },
      })
      .then(({ data: { data: { amount, coinsCount } = {} } = {} }) => {
        dispatch(stripePaymentExecuteInProcessAction(false));
        dispatch(resetLoadPersonalBalanceFromApiAction());

        analyticsBuyCoinsPush({ amount, coinsCount });

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        dispatch(stripePaymentExecuteInProcessAction(false));

        reject(errorData);
      });
  });

const loadPaymentHistoryInProcessAction = (loadPaymentHistoryInProcess) =>
  createAction(PaymentsActionsConstants.LOAD_PAYMENT_HISTORY_IN_PROCESS, {
    loadPaymentHistoryInProcess,
  });

const loadPaymentHistorySuccessAction = ({ paymentHistory, paymentHistoryPageSettings }) =>
  createAction(PaymentsActionsConstants.LOAD_PAYMENT_HISTORY_SUCCESS, {
    paymentHistory,
    paymentHistoryPageSettings,
  });

export const loadPaymentHistoryRequestAction = ({ pageSize, pageNumber, dispatch }) =>
  new Promise((resolve, reject) => {
    const { store } = ReduxStoreService.getInstance();

    const { paymentHistoryPageSettings: { page: { currentNumber: page, size } = {} } = {} } = store.getState().PaymentsReducer;

    dispatch(loadPaymentHistoryInProcessAction(true));

    api
      .get('payments', {
        params: {
          size: pageSize || size,
          page: pageNumber || pageNumber === 0 ? pageNumber : page,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: responseData = {}, payload: payloadData = {} } = {} }) => {
        dispatch(
          loadPaymentHistorySuccessAction({
            paymentHistory: responseData,
            paymentHistoryPageSettings: payloadData,
          })
        );

        resolve();
      })
      .catch((error) => {
        console.error(error);

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        dispatch(loadPaymentHistoryInProcessAction(false));

        reject(errorData);
      });
  });
