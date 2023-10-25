import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import { WantedActionsConstants } from '@/constants/actions/wanted';
import { filterSelectUtil } from '@/utils/sort-and-filter/filterUtils';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  loadWantedInProcess: false,
  loadWantedFromApi: false,
  wantedList: [],
  pageSettings: {
    page: {
      size: 25,
    },
  },

  sortQuery: {},
  filtersSelected: {},
  filtersApplied: {},
  filterApplied: false,
};

const handlers = createHandlers({
  [WantedActionsConstants.LOAD_WANTED_IN_PROCESS]: (state, { loadWantedInProcess = false }) => ({
    ...state,
    loadWantedInProcess,
  }),
  [WantedActionsConstants.LOAD_WANTED_SUCCESS]: (state, { wantedList = [], pageSettings = {} }) => ({
    ...state,
    wantedList,
    loadWantedInProcess: false,
    loadWantedFromApi: true,
    pageSettings,
  }),

  [WantedActionsConstants.WANTED_FILTER_SELECT]: (
    state,
    { categoryId, selected: selectedArr = [], multi, beforeResetCategory, beforeResetCategoryNow }
  ) => ({
    ...state,
    ...filterSelectUtil({
      filterAppliedFromStore: state.filterApplied,
      filtersAppliedFromStore: state.filtersApplied,
      filtersSelectedFromStore: state.filtersSelected,
      multi,
      categoryId,
      beforeResetCategory,
      selectedArr,
      beforeResetCategoryNow,
    }),
  }),

  [WantedActionsConstants.WANTED_FILTER_APPLY]: (state) => {
    const filtersApplied = cloneDeep(state.filtersSelected);

    return {
      ...state,
      filterApplied: !isEmpty(filtersApplied),
      filtersApplied,
    };
  },
});

const WantedReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default WantedReducer;
