import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import { WantListReleasesItemsActionsConstants } from '@/constants/actions/wantlist/wantListReleasesItems';
import { filterSelectUtil } from '@/utils/sort-and-filter/filterUtils';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  loadWantListReleasesItemsInProcess: false,
  loadWantListReleasesItemsFromApi: false,
  wantlistReleasesItems: [],
  wantlistReleasesItemsPageSettings: {
    page: {
      currentNumber: 0,
      size: 50,
    },
  },

  searchQuery: '',

  sortQuery: {},
  filtersSelected: {},
  filtersApplied: {},
  filterApplied: false,

  getWantListReleasesItemInProcess: false,
};

const handlers = createHandlers({
  [WantListReleasesItemsActionsConstants.RESET_WANTLIST_RELEASE_ITEMS]: () => ({
    ...initialState,
  }),

  [WantListReleasesItemsActionsConstants.SEARCH_WANTLIST_RELEASE_ITEMS]: (state, { searchQuery = '' }) => ({
    ...state,
    searchQuery,
  }),

  [WantListReleasesItemsActionsConstants.GET_WANTLIST_RELEASES_ITEM_IN_PROCESS]: (
    state,
    { getWantListReleasesItemInProcess = false }
  ) => ({
    ...state,
    getWantListReleasesItemInProcess,
  }),
  [WantListReleasesItemsActionsConstants.GET_WANTLIST_RELEASES_ITEM_SUCCESS]: (state, { wantlistReleasesItem }) => {
    const wantlistReleasesItems = cloneDeep(state.wantlistReleasesItems).filter(({ id }) => id !== wantlistReleasesItem.id);

    if (state.wantlistReleasesItemsPageSettings.page.currentNumber === 0 && wantlistReleasesItem) {
      wantlistReleasesItems.unshift(wantlistReleasesItem);
    }

    return {
      ...state,
      wantlistReleasesItems,
      getWantListReleasesItemInProcess: false,
    };
  },

  [WantListReleasesItemsActionsConstants.LOAD_WANTLIST_RELEASES_ITEMS_IN_PROCESS]: (
    state,
    { loadWantListReleasesItemsInProcess = false }
  ) => ({
    ...state,
    loadWantListReleasesItemsInProcess,
  }),

  [WantListReleasesItemsActionsConstants.LOAD_WANTLIST_RELEASES_ITEMS_SUCCESS]: (
    state,
    { wantlistReleasesItems = [], wantlistReleasesItemsPageSettings = {} }
  ) => ({
    ...state,
    wantlistReleasesItems,
    wantlistReleasesItemsPageSettings,
    loadWantListReleasesItemsInProcess: false,
    loadWantListReleasesItemsFromApi: true,
  }),

  [WantListReleasesItemsActionsConstants.WANT_LIST_RELEASES_ITEMS_SORT_SELECT]: (state, { sortQuery }) => ({
    ...state,
    sortQuery,

    wantlistReleasesItemsPageSettings: {
      ...state.wantlistReleasesItemsPageSettings,
      page: {
        ...state.wantlistReleasesItemsPageSettings.page,
        currentNumber: 0,
      },
    },
  }),

  [WantListReleasesItemsActionsConstants.WANT_LIST_RELEASES_ITEMS_FILTER_SELECT]: (
    state,
    { categoryId, selected: selectedArr = [], multi, beforeResetCategory }
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
    }),
  }),

  [WantListReleasesItemsActionsConstants.WANT_LIST_RELEASES_ITEMS_FILTER_APPLY]: (state) => {
    const filtersApplied = cloneDeep(state.filtersSelected);

    return {
      ...state,
      filterApplied: !isEmpty(filtersApplied),
      filtersApplied,
    };
  },
});

const WantListReleasesItemsReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default WantListReleasesItemsReducer;
