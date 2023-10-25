import { MarketplaceCartActionsConstants } from '@/constants/actions/marketplace/marketplaceCart';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getCartInProcess: false,
  getCartInProcessFromApi: false,
  cart: [],
  pageSettings: {
    page: {
      currentNumber: 0,
      size: 50,
    },
  },

  getCartInfoInProcess: false,
  getCartInfoInProcessFromApi: false,
  cartInfo: {},

  addToCartLastDate: 0,
  addToCartInProcessId: -1,
  deleteFromCartInProcessId: -1,

  buyCartInProcess: false,
};

const handlers = createHandlers({
  [MarketplaceCartActionsConstants.CLEAR_MARKETPLACE_CART]: (state) => ({
    ...state,
    cart: [],
    pageSettings: {
      page: {
        currentNumber: 0,
        size: 50,
      },
    },
    cartInfo: {},
  }),

  [MarketplaceCartActionsConstants.MARKETPLACE_CART_UPDATE]: (
    state,
    {
      cart,
      pageSettings = {
        currentNumber: 0,
        size: undefined,
      },
      getCartInProcessFromApi = state.getCartInProcessFromApi,
    }
  ) => ({
    ...state,
    cart,
    pageSettings: {
      ...state.pageSettings,
      page: pageSettings,
    },
    getCartInProcessFromApi,
  }),

  [MarketplaceCartActionsConstants.GET_CART_INFO_IN_PROCESS]: (state, { getCartInfoInProcess = false }) => ({
    ...state,
    getCartInfoInProcess,
  }),

  [MarketplaceCartActionsConstants.GET_CART_INFO_SUCCESS]: (state, { cartInfo = {} }) => ({
    ...state,
    getCartInfoInProcess: false,
    getCartInfoInProcessFromApi: true,
    cartInfo,
  }),

  [MarketplaceCartActionsConstants.GET_CART_IN_PROCESS]: (state, { getCartInProcess = false }) => ({
    ...state,
    getCartInProcess,
  }),

  [MarketplaceCartActionsConstants.GET_CART_SUCCESS]: (state, { cart = [], pageSettings = {}, position }) => {
    if (position === 'LAST') {
      return {
        ...state,
        getCartInProcess: false,
        cart: [...state.cart, ...cart],
      };
    }

    if (position === 'FIRST') {
      return {
        ...state,
        getCartInProcess: false,
        cart: [...cart, ...state.cart],
      };
    }
    return {
      ...state,
      getCartInProcess: false,
      getCartInProcessFromApi: true,
      cart,
      pageSettings,
    };
  },

  [MarketplaceCartActionsConstants.ADD_TO_CART_IN_PROCESS]: (state, { addToCartInProcessId = -1 }) => ({
    ...state,
    addToCartInProcessId,
  }),

  [MarketplaceCartActionsConstants.ADD_TO_CART_SUCCESS]: (state, { cartInfo = {} }) => ({
    ...state,
    addToCartInProcessId: -1,
    cartInfo,
    addToCartLastDate: new Date().valueOf(),
  }),

  [MarketplaceCartActionsConstants.DELETE_TO_CART_IN_PROCESS]: (state, { deleteFromCartInProcessId = -1 }) => ({
    ...state,
    deleteFromCartInProcessId,
  }),

  [MarketplaceCartActionsConstants.DELETE_TO_CART_SUCCESS]: (state, { cartInfo = {} }) => ({
    ...state,
    deleteFromCartInProcessId: -1,
    cartInfo,
  }),

  [MarketplaceCartActionsConstants.BUY_CART_IN_PROCESS]: (state, { buyCartInProcess = false }) => ({
    ...state,
    buyCartInProcess,
  }),

  [MarketplaceCartActionsConstants.BUY_CART_SUCCESS]: (state) => ({
    ...state,
    buyCartInProcess: false,
  }),
});

const MarketplaceCartReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default MarketplaceCartReducer;
