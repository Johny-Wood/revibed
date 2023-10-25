import cloneDeep from 'lodash/cloneDeep';

import ReduxStoreService from '@/services/ReduxStoreService';

import { updateListPageSettingsForDeleteUtil } from '../listUtils';

const updateCartListAfterRemoveUtil = ({ getCartRequest, callback = () => {} }) => {
  const { store } = ReduxStoreService.getInstance();

  const {
    getCartInProcessFromApi = false,
    cart = [],
    pageSettings: { size = 25, totalPages = 0, currentNumber = 0, totalElements = 0 } = {},
  } = store.getState().MarketplaceCartReducer || {};

  const { dispatch } = store;

  if (currentNumber < totalPages - 1) {
    getCartRequest({
      pageSize: 1,
      pageNumber: (currentNumber + 1) * size - 1,
      withInProcess: false,
      position: 'LAST',
      dispatch,
    }).then();
  } else if (cart.length === 0 && currentNumber > 0) {
    getCartRequest({
      pageNumber: currentNumber - 1,
      dispatch,
    }).then();
  } else if (totalElements === 0 && !getCartInProcessFromApi) {
    getCartRequest({
      pageNumber: 0,
      dispatch,
    }).then();
  }

  callback();
};

export const removeGoodsByStoreUtil = ({ goodsId, getCartRequest, updateMarketplaceCartAction, callback = () => {} }) => {
  const { store } = ReduxStoreService.getInstance();
  const { dispatch } = store;

  const {
    getCartInProcessFromApi = false,
    cart: cartFromStore = [],
    pageSettings: { page: listPageSettingsFromStore } = {},
  } = store.getState().MarketplaceCartReducer || {};

  const cart = cloneDeep(cartFromStore);
  const pageSettings = updateListPageSettingsForDeleteUtil(listPageSettingsFromStore);

  const foundProjectDeleteIndex = cart.findIndex(({ id }) => id === goodsId);

  if (!getCartInProcessFromApi || cartFromStore.length === 0 || !goodsId || foundProjectDeleteIndex === -1) {
    return;
  }

  cart.splice(foundProjectDeleteIndex, 1);

  dispatch(
    updateMarketplaceCartAction({
      cart,
      pageSettings,
    })
  );

  updateCartListAfterRemoveUtil({ getCartRequest, callback });
};
