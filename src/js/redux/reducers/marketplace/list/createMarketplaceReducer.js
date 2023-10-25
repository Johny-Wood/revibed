import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import { MarketplaceListActionsConstants } from '@/constants/actions/marketplace/marketplaceList';
import { filterSelectUtil } from '@/utils/sort-and-filter/filterUtils';
import { sortSelectUtil } from '@/utils/sort-and-filter/sortUtils';

import { createHandlers, createReducer } from '../../handler';

const initialState = {
  getMarketplaceListInProcess: false,
  getMarketplaceListFromApi: false,
  list: [],
  pageSettings: {
    currentNumber: 0,
    size: 25,
  },

  sortSelected: {},

  filtersSelected: {},
  filtersApplied: {},
  filterApplied: false,
};

const createLocalHandlers = (location) =>
  createHandlers({
    [`${location}_${MarketplaceListActionsConstants.SET_MARKETPLACE_PREVIEW_PURCHASED}`]: (state, { goods = [] }) => {
      const list = cloneDeep(state.list);

      if (list.length === 0 || goods.length === 0) {
        return {
          ...state,
        };
      }

      goods.forEach(({ id: goodsId, albumPurchased, rootGoodsId }) => {
        const foundItemIndex = list.findIndex(({ id }) => id === goodsId);

        if (foundItemIndex > -1) {
          const { realPurchaseAvailable } = list[foundItemIndex] || {};

          list[foundItemIndex].alreadyPurchased = true;
          list[foundItemIndex].inCart = false;
          list[foundItemIndex].purchaseAvailable = realPurchaseAvailable;
        }

        if (albumPurchased) {
          const foundItemIndexByRootId = list.findIndex(({ id }) => id === rootGoodsId);

          if (foundItemIndexByRootId > -1) {
            const { realPurchaseAvailable } = list[foundItemIndexByRootId] || {};
            list[foundItemIndexByRootId].alreadyPurchased = true;
            list[foundItemIndexByRootId].inCart = false;
            list[foundItemIndexByRootId].purchaseAvailable = realPurchaseAvailable;
          }
        }
      });

      return {
        ...state,
        list,
      };
    },

    [`${location}_${MarketplaceListActionsConstants.TOGGLE_MARKETPLACE_PREVIEW_ALBUM_TO_CART}`]: (state, { cardId, inCart }) => {
      const list = cloneDeep(state.list);
      const foundCardIdx = list.findIndex(({ id }) => id === cardId);

      if (foundCardIdx === -1) {
        return { ...state };
      }

      const { realPurchaseAvailable } = list[foundCardIdx] || {};

      list[foundCardIdx].inCart = inCart;
      list[foundCardIdx].purchaseAvailable = realPurchaseAvailable;

      return {
        ...state,
        list,
      };
    },

    [`${location}_${MarketplaceListActionsConstants.GET_MARKETPLACE_LIST_IN_PROCESS}`]: (
      state,
      { getMarketplaceListInProcess }
    ) => ({
      ...state,
      getMarketplaceListInProcess,
    }),

    [`${location}_${MarketplaceListActionsConstants.GET_MARKETPLACE_LIST_SUCCESS}`]: (
      state,
      { marketplaceList, pageSettings }
    ) => ({
      ...state,
      getMarketplaceListInProcess: false,
      getMarketplaceListFromApi: true,
      list: marketplaceList,
      pageSettings,
    }),

    [`${location}_${MarketplaceListActionsConstants.MARKETPLACE_FILTER_SELECT}`]: (
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
        beforeResetCategoryNow,
        selectedArr,
      }),
    }),

    [`${location}_${MarketplaceListActionsConstants.MARKETPLACE_FILTER_APPLY}`]: (state) => {
      const filtersApplied = cloneDeep(state.filtersSelected);

      return {
        ...state,
        filterApplied: !isEmpty(filtersApplied),
        filtersApplied,
      };
    },

    [`${location}_${MarketplaceListActionsConstants.SORT_SELECT}`]: (state, { categoryId, selected }) => ({
      ...state,
      ...sortSelectUtil({
        sortSelectedFromStore: state.sortSelected,
        categoryId,
        selected,
      }),
    }),

    [`${location}_${MarketplaceListActionsConstants.CHANGE_MARKETPLACE_CURRENT_PAGE}`]: (state, { currentNumber }) => ({
      ...state,
      pageSettings: {
        ...state.pageSettings,
        currentNumber,
      },
    }),

    [`${location}_${MarketplaceListActionsConstants.RESET_MARKETPLACE_CURRENT_PARAMS}`]: (state) => ({
      ...state,
      pageSettings: {
        currentNumber: 0,
        size: 25,
      },

      sortSelected: {},

      filtersSelected: {},
      filtersApplied: {},
      filterApplied: false,
    }),
  });

const createMarketplaceReducer = (state = initialState, action, location) => {
  const handlers = createLocalHandlers(location);

  return createReducer(state, action, handlers);
};

export default createMarketplaceReducer;
