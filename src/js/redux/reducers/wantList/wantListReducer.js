import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import { WantListActionsConstants } from '@/constants/actions/wantlist/wantList';
import { filterSelectUtil } from '@/utils/sort-and-filter/filterUtils';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getWantListInfoInProcess: false,
  getWantListInfoFromApi: false,
  wantListInfo: {},

  importWantListInProcess: false,

  changePlanWantListInProcess: false,

  loadPlanWantListInProcess: false,
  loadPlanWantListFromApi: false,
  plansWantList: [],

  loadWantListInProcess: false,
  loadWantListFromApi: false,
  wantList: [],
  wantListPageSettings: {
    page: {
      size: 50,
    },
  },
  selectedWantListItems: [],

  removeWantListReleaseInProcess: false,

  addWantListReleaseInProcess: false,

  addWatchWantListReleaseInProcess: false,
  deleteWatchWantListReleaseInProcess: false,

  searchQuery: '',

  sortQuery: {},
  filtersSelected: {},
  filtersApplied: {},
  filterApplied: false,
};

const handlers = createHandlers({
  [WantListActionsConstants.SEARCH_WANT_LIST]: (state, { searchQuery = '' }) => ({
    ...state,
    searchQuery,
  }),

  [WantListActionsConstants.CHANGE_WANT_LIST_ACTIVE_RELEASES_COUNT]: (state, { activeReleasesNew = 0 }) => ({
    ...state,
    wantListInfo: {
      ...state.wantListInfo,
      subscriptionInfo: {
        ...state.wantListInfo.subscriptionInfo,
        activeReleases: state.wantListInfo.subscriptionInfo.activeReleases + activeReleasesNew,
      },
    },
  }),

  [WantListActionsConstants.GET_WANT_LIST_INFO_IN_PROCESS]: (state, { getWantListInfoInProcess = false }) => ({
    ...state,
    getWantListInfoInProcess,
  }),
  [WantListActionsConstants.GET_WANT_LIST_INFO_SUCCESS]: (state, { wantListInfo = {} }) => ({
    ...state,
    wantListInfo,
    getWantListInfoInProcess: false,
    getWantListInfoFromApi: true,
  }),

  [WantListActionsConstants.IMPORT_WANT_LIST_IN_PROCESS]: (state, { importWantListInProcess = false }) => ({
    ...state,
    importWantListInProcess,
  }),
  [WantListActionsConstants.IMPORT_WANT_LIST_SUCCESS]: (state, { status = {} }) => ({
    ...state,
    wantListInfo: {
      ...state.wantListInfo,
      ...status,
    },
    loadWantListFromApi: false,
    wantList: [],
    importWantListInProcess: false,
  }),

  [WantListActionsConstants.WANTLIST_UPLOAD_CHANGE_STATUS]: (state, { status = {} }) => ({
    ...state,
    wantListInfo: {
      ...state.wantListInfo,
      status,
    },
  }),

  [WantListActionsConstants.LOAD_PLANS_WANT_LIST_IN_PROCESS]: (state, { loadPlanWantListInProcess = false }) => ({
    ...state,
    loadPlanWantListInProcess,
  }),
  [WantListActionsConstants.LOAD_PLANS_WANT_LIST_SUCCESS]: (state, { plansWantList = [] }) => ({
    ...state,
    plansWantList,
    loadPlanWantListInProcess: false,
    loadPlanWantListFromApi: true,
  }),

  [WantListActionsConstants.CHANGE_PLAN_WANT_LIST_IN_PROCESS]: (state, { changePlanWantListInProcess = false }) => ({
    ...state,
    changePlanWantListInProcess,
  }),
  [WantListActionsConstants.CHANGE_PLAN_WANT_LIST_SUCCESS]: (state, { wantListInfo = {} }) => ({
    ...state,
    wantListInfo,
    changePlanWantListInProcess: false,
  }),

  [WantListActionsConstants.LOAD_WANT_LIST_IN_PROCESS]: (state, { loadWantListInProcess = false }) => ({
    ...state,
    loadWantListInProcess,
  }),
  [WantListActionsConstants.LOAD_WANT_LIST_SUCCESS]: (
    state,
    { wantList = [], wantListPageSettings: { sort: sortInitial = [] } = {}, wantListPageSettings = {}, wantListSort = [] }
  ) => {
    let { sortQuery } = state;

    if (!state.loadWantListFromApi && !!sortInitial.length) {
      const [firstSort] = sortInitial;
      const sortTmp = cloneDeep(wantListSort);
      const findInitialSort = sortTmp.find(({ property }) => property === firstSort.property);

      if (findInitialSort) {
        const { items: findInitialSortItems = [] } = findInitialSort;
        const findInitialSortValue = findInitialSortItems.find(
          ({ value }) => value === `${firstSort.property},${firstSort.direction}`
        );

        if (findInitialSortValue) {
          sortQuery = {
            [findInitialSort.name]: findInitialSortValue,
          };
        }
      }
    }

    return {
      ...state,
      wantList,
      loadWantListInProcess: false,
      loadWantListFromApi: true,
      wantListPageSettings,
      sortQuery,
    };
  },

  [WantListActionsConstants.REMOVE_ALL_WANT_LIST_IN_PROCESS]: (state, { removeAllWantListInProcess = false }) => ({
    ...state,
    removeAllWantListInProcess,
  }),
  [WantListActionsConstants.REMOVE_ALL_WANT_LIST_SUCCESS]: (state, { wantListInfo }) => ({
    ...state,
    wantList: [],
    loadWantListFromApi: false,
    removeAllWantListInProcess: false,
    wantListInfo,
  }),

  [WantListActionsConstants.REMOVE_WANT_LIST_RELEASE_IN_PROCESS]: (state, { removeWantListReleaseInProcess }) => ({
    ...state,
    removeWantListReleaseInProcess,
  }),
  [WantListActionsConstants.REMOVE_WANT_LIST_RELEASE_SUCCESS]: (state) => ({
    ...state,
    removeWantListReleaseInProcess: false,
    selectedWantListItems: [],
  }),

  [WantListActionsConstants.ADD_WANT_LIST_RELEASE_IN_PROCESS]: (state, { addWantListReleaseInProcess }) => ({
    ...state,
    addWantListReleaseInProcess,
  }),
  [WantListActionsConstants.ADD_WANT_LIST_RELEASE_SUCCESS]: (state) => ({
    ...state,
    addWantListReleaseInProcess: false,
  }),

  [WantListActionsConstants.ADD_WATCH_WANT_LIST_RELEASE_IN_PROCESS]: (state, { addWatchWantListReleaseInProcess }) => ({
    ...state,
    addWatchWantListReleaseInProcess,
  }),
  [WantListActionsConstants.ADD_WATCH_WANT_LIST_RELEASE_FAILED]: (state) => ({
    ...state,
    addWatchWantListReleaseInProcess: false,
    selectedWantListItems: [],
  }),
  [WantListActionsConstants.ADD_WATCH_WANT_LIST_RELEASE_SUCCESS]: (state, { ids }) => {
    const wantList = cloneDeep(state.wantList);

    ids.forEach((addWantListItemId) => {
      const findAddWantListItemIdx = wantList.findIndex(({ id }) => id === addWantListItemId);

      if (findAddWantListItemIdx > -1) {
        wantList[findAddWantListItemIdx].active = true;
      }
    });

    return {
      ...state,
      addWatchWantListReleaseInProcess: false,
      wantList,
      selectedWantListItems: [],
    };
  },

  [WantListActionsConstants.DELETE_WATCH_WANT_LIST_RELEASE_IN_PROCESS]: (state, { deleteWatchWantListReleaseInProcess }) => ({
    ...state,
    deleteWatchWantListReleaseInProcess,
  }),
  [WantListActionsConstants.DELETE_WATCH_WANT_LIST_RELEASE_SUCCESS]: (state, { ids = [] }) => {
    const wantList = cloneDeep(state.wantList);

    ids.forEach((deleteWantListItemId) => {
      const findDeleteWantListItemIdx = wantList.findIndex(({ id }) => id === deleteWantListItemId);

      if (findDeleteWantListItemIdx > -1) {
        wantList[findDeleteWantListItemIdx].active = false;
      }
    });

    return {
      ...state,
      deleteWatchWantListReleaseInProcess: false,
      wantList,
      selectedWantListItems: [],
    };
  },

  [WantListActionsConstants.SELECT_WANT_LIST_ITEM]: (state, { wantListRelease, isRemove = true }) => {
    const selectedWantListItems = cloneDeep(state.selectedWantListItems);

    const selectWantList = ({ item, isAll = false }) => {
      const { id } = item;
      const isCheckedItem = () => selectedWantListItems.findIndex(({ id: itemId }) => id === itemId) !== -1;

      if (id && id > 0) {
        if (!isCheckedItem()) {
          selectedWantListItems.push(item);
        } else if (!isAll || isRemove) {
          const selectedIdx = selectedWantListItems.findIndex(({ id: selectedId }) => selectedId === id);
          selectedWantListItems.splice(selectedIdx, 1);
        }
      }
    };

    if (Array.isArray(wantListRelease)) {
      wantListRelease.forEach((item) => {
        selectWantList({ item, isAll: true });
      });
    } else {
      selectWantList({ item: wantListRelease });
    }

    return {
      ...state,
      selectedWantListItems,
    };
  },

  [WantListActionsConstants.WANT_LIST_SORT_SELECT]: (state, { sortQuery }) => ({
    ...state,
    sortQuery,

    wantListPageSettings: {
      ...state.wantListPageSettings,
      page: {
        ...state.wantListPageSettings.page,
        currentNumber: 0,
      },
    },
  }),

  [WantListActionsConstants.WANT_LIST_FILTER_SELECT]: (
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

  [WantListActionsConstants.WANT_LIST_FILTER_APPLY]: (state) => {
    const filtersApplied = cloneDeep(state.filtersSelected);

    return {
      ...state,
      filterApplied: !isEmpty(filtersApplied),
      filtersApplied,
    };
  },
});

const WantListReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default WantListReducer;
