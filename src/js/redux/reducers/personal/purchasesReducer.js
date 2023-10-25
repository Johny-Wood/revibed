import cloneDeep from 'lodash/cloneDeep';

import { PurchasesActionsConstants } from '@/constants/actions/personal/purchases';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getPurchasesInProcess: false,
  getPurchasesFromApi: false,
  list: [],
  pageSettings: {
    currentNumber: 0,
    size: 25,
  },

  getPurchaseInProcess: false,
  cards: {},

  downloadPurchasesInProcessIds: [],
};

const handlers = createHandlers({
  [PurchasesActionsConstants.UPDATE_PURCHASES_REQUESTS]: (state, { list = [], pageSettings = {} }) => ({
    ...state,
    list,
    pageSettings,
  }),

  [PurchasesActionsConstants.GET_PURCHASES_IN_PROCESS]: (state, { getPurchasesInProcess }) => ({
    ...state,
    getPurchasesInProcess,
  }),

  [PurchasesActionsConstants.GET_PURCHASES_SUCCESS]: (state, { list = [], pageSettings = {}, position }) => {
    if (position === 'LAST') {
      return {
        ...state,
        getPurchasesInProcess: false,
        list: [...state.list, ...list],
      };
    }

    if (position === 'FIRST') {
      return {
        ...state,
        getPurchasesInProcess: false,
        list: [...list, ...state.list],
      };
    }

    return {
      ...state,
      getPurchasesInProcess: false,
      getPurchasesFromApi: true,
      list,
      pageSettings,
    };
  },

  [PurchasesActionsConstants.GET_PURCHASE_IN_PROCESS]: (state, { getPurchaseInProcess }) => ({
    ...state,
    getPurchaseInProcess,
  }),

  [PurchasesActionsConstants.GET_PURCHASE_SUCCESS]: (state, { card, id }) => ({
    ...state,
    getPurchaseInProcess: false,
    cards: {
      ...state.cards,
      [id]: { ...card },
    },
  }),

  [PurchasesActionsConstants.DOWNLOAD_PURCHASES_IN_PROCESS]: (state, { downloadPurchasesInProcessId, isEnd }) => {
    const downloadPurchasesInProcessIds = cloneDeep(state.downloadPurchasesInProcessIds);

    if (isEnd) {
      const foundIdIdx = downloadPurchasesInProcessIds.findIndex((id) => id === downloadPurchasesInProcessId);

      if (foundIdIdx > -1) {
        downloadPurchasesInProcessIds.splice(foundIdIdx, 1);
      }
    } else {
      downloadPurchasesInProcessIds.push(downloadPurchasesInProcessId);
    }

    return {
      ...state,
      downloadPurchasesInProcessIds,
    };
  },
});

const PurchasesReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default PurchasesReducer;
