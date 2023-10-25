import { PersonalActionsConstants } from '@/constants/actions/personal/personal';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  loadPersonalBalanceInProcess: false,
  loadedPersonalBalanceFromApi: false,
  personalBalanceList: [],

  personalBalanceListSettings: {},
  sortQuery: {},

  loadPersonalTopUpBalanceList: [],
  loadPersonalTopUpBalanceInProcess: false,
  loadPersonalTopUpBalanceFromApi: false,

  personalTopUpBalanceInProcess: false,
  personalTopUpBalanceSuccess: false,
};

const handlers = createHandlers({
  [PersonalActionsConstants.RESET_LOAD_PERSONAL_BALANCE_FROM_API]: (state) => ({
    ...state,
    loadedPersonalBalanceFromApi: false,
  }),
  [PersonalActionsConstants.LOAD_PERSONAL_BALANCE_IN_PROCESS]: (state, { loadPersonalBalanceInProcess }) => ({
    ...state,
    loadPersonalBalanceInProcess,
  }),
  [PersonalActionsConstants.LOAD_PERSONAL_BALANCE_SUCCESS]: (
    state,
    { personalBalanceList, personalBalanceListSettings = {}, personalBalanceListSettings: { sort = [] } = {} }
  ) => ({
    ...state,
    loadPersonalBalanceInProcess: false,
    loadedPersonalBalanceFromApi: true,
    personalBalanceList,

    personalBalanceListSettings,
    sortQuery: !state.loadedPersonalBalanceFromApi ? { [sort[0].property]: { value: sort[0].direction } } : state.sortQuery,
  }),

  [PersonalActionsConstants.PERSONAL_BALANCE_SORT_SELECT]: (state, { sortQuery }) => ({
    ...state,
    sortQuery,
  }),

  [PersonalActionsConstants.LOAD_PERSONAL_TOP_UP_BALANCE_IN_PROCESS]: (state, { loadPersonalTopUpBalanceInProcess }) => ({
    ...state,
    loadPersonalTopUpBalanceInProcess,
  }),
  [PersonalActionsConstants.LOAD_PERSONAL_TOP_UP_BALANCE_SUCCESS]: (state, { loadPersonalTopUpBalanceList }) => ({
    ...state,
    loadPersonalTopUpBalanceList,
    loadPersonalTopUpBalanceInProcess: false,
    loadPersonalTopUpBalanceFromApi: true,
  }),

  [PersonalActionsConstants.PERSONAL_TOP_UP_BALANCE_IN_PROCESS]: (state, { personalTopUpBalanceInProcess }) => ({
    ...state,
    personalTopUpBalanceInProcess,
  }),
  [PersonalActionsConstants.PERSONAL_TOP_UP_BALANCE_SUCCESS]: (state) => ({
    ...state,
    personalTopUpBalanceInProcess: true,
    personalTopUpBalanceSuccess: true,
  }),
});

const BalanceReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default BalanceReducer;
