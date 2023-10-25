import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';

import { WantListReleaseItemActionsConstants } from '@/constants/actions/wantlist/wantListReleaseItem';

import { createHandlers, createReducer } from '../handler';

const releaseItemsInitialState = {
  loadWantListReleaseItemsInProcess: false,
  wantlistReleaseItems: [],
  wantlistReleaseItemsPageSettings: {
    page: {
      currentNumber: 0,
      size: 15,
    },
  },
};

const initialState = {
  getWantListReleaseItemInProcess: false,
  wantlistReleaseItem: {},

  ...releaseItemsInitialState,
};

const handlers = createHandlers({
  [WantListReleaseItemActionsConstants.REMOVE_WATCH_WANTLIST_RELEASE_ITEM]: (state, { releaseId }) => {
    const wantlistReleaseItem = cloneDeep(state.wantlistReleaseItem);

    if (wantlistReleaseItem[releaseId]) {
      set(wantlistReleaseItem[releaseId], 'wantItemInfo.item.active', false);
    }

    return {
      ...state,
      wantlistReleaseItem,
    };
  },
  [WantListReleaseItemActionsConstants.ADD_WATCH_WANTLIST_RELEASE_ITEM]: (state, { releaseId }) => {
    const wantlistReleaseItem = cloneDeep(state.wantlistReleaseItem);

    if (wantlistReleaseItem[releaseId]) {
      set(wantlistReleaseItem[releaseId], 'wantItemInfo.item.active', true);
    }

    return {
      ...state,
      wantlistReleaseItem,
    };
  },

  [WantListReleaseItemActionsConstants.TOGGLE_IS_ADD_RELEASE_ITEM]: (state, { releaseIds = [], isAdded, wantItemsInfo = {} }) => {
    const wantlistReleaseItem = cloneDeep(state.wantlistReleaseItem);

    releaseIds.forEach((releaseId) => {
      if (wantlistReleaseItem[releaseId]) {
        set(wantlistReleaseItem[releaseId], 'wantItemInfo.isAdded', isAdded);
      }
    });

    Object.keys(wantItemsInfo).forEach((releaseId) => {
      if (wantlistReleaseItem[releaseId]) {
        wantlistReleaseItem[releaseId] = {
          ...wantlistReleaseItem[releaseId],
          wantItemInfo: {
            ...wantlistReleaseItem[releaseId].wantItemInfo,
            item: wantItemsInfo[releaseId],
          },
        };
      }
    });

    return {
      ...state,
      wantlistReleaseItem,
    };
  },

  [WantListReleaseItemActionsConstants.GET_WANTLIST_RELEASE_ITEM_IN_PROCESS]: (
    state,
    { getWantListReleaseItemInProcess = false }
  ) => ({
    ...state,
    getWantListReleaseItemInProcess,
  }),
  [WantListReleaseItemActionsConstants.GET_WANTLIST_RELEASE_ITEM_SUCCESS]: (state, { wantlistReleaseItem, releaseId }) => ({
    ...state,
    wantlistReleaseItem: {
      ...state.wantlistReleaseItem,
      [releaseId]: wantlistReleaseItem,
    },
    getWantListReleaseItemFromApi: true,
    getWantListReleaseItemInProcess: false,
  }),

  [WantListReleaseItemActionsConstants.CLEAR_RELEASE_ITEMS]: (state) => ({
    ...state,
    ...releaseItemsInitialState,
  }),
  [WantListReleaseItemActionsConstants.UPDATE_RELEASE_ITEMS_AVAILABLE]: (state, { releaseId, itemsAvailable }) => {
    const wantlistReleaseItem = cloneDeep(state.wantlistReleaseItem);

    if (wantlistReleaseItem[releaseId]) {
      set(wantlistReleaseItem[releaseId], 'releaseInfo.itemsAvailable', itemsAvailable);
    }

    return {
      ...state,
      wantlistReleaseItem: {
        ...wantlistReleaseItem,
      },
    };
  },
  [WantListReleaseItemActionsConstants.LOAD_WANTLIST_RELEASE_ITEMS_IN_PROCESS]: (
    state,
    { loadWantListReleaseItemsInProcess = false }
  ) => ({
    ...state,
    loadWantListReleaseItemsInProcess,
  }),
  [WantListReleaseItemActionsConstants.LOAD_WANTLIST_RELEASE_ITEMS_SUCCESS]: (
    state,
    { wantlistReleaseItems = [], wantlistReleaseItemsPageSettings = {} }
  ) => ({
    ...state,
    wantlistReleaseItems,
    wantlistReleaseItemsPageSettings,
    loadWantListReleaseItemsInProcess: false,
  }),
});

const WantListReleaseItemReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default WantListReleaseItemReducer;
