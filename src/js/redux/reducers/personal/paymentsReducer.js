import { PaymentsActionsConstants } from '@/constants/actions/payments';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  payPalPaymentExecuteInProcess: false,
  payPalPaymentCancelInProcess: false,

  stripePaymentExecuteInProcess: false,
  stripePaymentCancelInProcess: false,

  loadPaymentHistoryInProcess: false,
  loadPaymentHistoryFromApi: false,
  paymentHistory: [],
  paymentHistoryPageSettings: {},
};

const handlers = createHandlers({
  [PaymentsActionsConstants.PAY_PAL_PAYMENT_EXECUTE_IN_PROCESS]: (state, { payPalPaymentExecuteInProcess }) => ({
    ...state,
    payPalPaymentExecuteInProcess,
  }),
  [PaymentsActionsConstants.PAY_PAL_PAYMENT_CANCEL_IN_PROCESS]: (state, { payPalPaymentCancelInProcess }) => ({
    ...state,
    payPalPaymentCancelInProcess,
  }),

  [PaymentsActionsConstants.STRIPE_PAYMENT_EXECUTE_IN_PROCESS]: (state, { stripePaymentExecuteInProcess }) => ({
    ...state,
    stripePaymentExecuteInProcess,
  }),
  [PaymentsActionsConstants.STRIPE_PAYMENT_CANCEL_IN_PROCESS]: (state, { stripePaymentCancelInProcess }) => ({
    ...state,
    stripePaymentCancelInProcess,
  }),

  [PaymentsActionsConstants.LOAD_PAYMENT_HISTORY_IN_PROCESS]: (state, { loadPaymentHistoryInProcess = false }) => ({
    ...state,
    loadPaymentHistoryInProcess,
  }),
  [PaymentsActionsConstants.LOAD_PAYMENT_HISTORY_SUCCESS]: (state, { paymentHistory = [], paymentHistoryPageSettings = {} }) => ({
    ...state,
    paymentHistory,
    paymentHistoryPageSettings,
    loadPaymentHistoryFromApi: true,
    loadPaymentHistoryInProcess: false,
  }),
});

const PaymentsReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default PaymentsReducer;
