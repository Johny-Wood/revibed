import cloneDeep from 'lodash/cloneDeep';

import { WithdrawActionsConstants } from '@/constants/actions/personal/withdraw';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getWithdrawInfoInProcess: false,

  withdrawInProcess: false,

  loadWithdrawHistoryInProcess: false,
  loadWithdrawHistoryFromApi: false,
  withdrawHistory: [],
  withdrawHistoryPageSettings: {
    page: {
      totalElements: 0,
      totalPages: 0,
      currentNumber: 0,
      size: 15,
    },
  },

  confirmWithdrawInProcess: false,
};

const handlers = createHandlers({
  [WithdrawActionsConstants.GET_WITHDRAW_INFO_IN_PROCESS]: (state, { getWithdrawInfoInProcess = false }) => ({
    ...state,
    getWithdrawInfoInProcess,
  }),

  [WithdrawActionsConstants.WITHDRAW_IN_PROCESS]: (state, { withdrawInProcess }) => ({
    ...state,
    withdrawInProcess,
  }),

  [WithdrawActionsConstants.LOAD_WITHDRAW_HISTORY_IN_PROCESS]: (state, { loadWithdrawHistoryInProcess = false }) => ({
    ...state,
    loadWithdrawHistoryInProcess,
  }),
  [WithdrawActionsConstants.LOAD_WITHDRAW_HISTORY_SUCCESS]: (
    state,
    { withdrawHistory = [], withdrawHistoryPageSettings = {} }
  ) => ({
    ...state,
    withdrawHistory,
    withdrawHistoryPageSettings,
    loadWithdrawHistoryFromApi: true,
    loadWithdrawHistoryInProcess: false,
  }),

  [WithdrawActionsConstants.WITHDRAW_CHANGE_STATUS]: (state, { withdrawId, withdrawStatus, textRejection = '' }) => {
    const withdrawHistoryTmp = cloneDeep(state.withdrawHistory);

    const withdrawFindIdx = withdrawHistoryTmp.findIndex(({ id }) => id === withdrawId);

    if (withdrawFindIdx > -1) {
      withdrawHistoryTmp[withdrawFindIdx].withdrawStatus = withdrawStatus;

      if (textRejection) {
        withdrawHistoryTmp[withdrawFindIdx].textRejection = textRejection;
      }
    }

    return {
      ...state,
      withdrawHistory: withdrawHistoryTmp,
    };
  },

  [WithdrawActionsConstants.CONFIRM_WITHDRAW_IN_PROCESS]: (state, { confirmWithdrawInProcess = false }) => ({
    ...state,
    confirmWithdrawInProcess,
  }),
  [WithdrawActionsConstants.CONFIRM_WITHDRAW_SUCCESS]: (state, { withdrawId, withdrawItem = {} }) => {
    const withdrawHistoryTmp = cloneDeep(state.withdrawHistory);

    const withdrawFindIdx = withdrawHistoryTmp.findIndex(({ id }) => id === withdrawId);

    if (withdrawFindIdx > -1) {
      withdrawHistoryTmp[withdrawFindIdx] = withdrawItem;
    }

    return {
      ...state,
      confirmWithdrawInProcess: false,
      withdrawHistory: withdrawHistoryTmp,
    };
  },
});

const WithdrawReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default WithdrawReducer;
