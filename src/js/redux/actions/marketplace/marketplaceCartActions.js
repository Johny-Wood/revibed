import qs from 'qs';

import api from '@/api';
import { MarketplaceCartActionsConstants } from '@/constants/actions/marketplace/marketplaceCart';
import { CommonVariablesConstants } from '@/constants/common/variables';
import {
  setMarketplacePreviewPurchasedAction,
  toggleMarketplacePreviewAlbumToCartAction,
} from '@/redux-actions/marketplace/marketplaceActions';
import {
  setMarketplaceCardPurchasedAction,
  toggleMarketplaceAlbumToCartAction,
  toggleMarketplaceTrackToCartAction,
} from '@/redux-actions/marketplace/marketplaceCardActions';
import { getPurchasesRequestAction, updatePurchasesAction } from '@/redux-actions/personal/purchasesActions';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';
import { removeGoodsByStoreUtil } from '@/utils/marketplace/marketplaceCartUtil';
import { marketplaceDispatchActionInAllLocationsUtil } from '@/utils/marketplace/marketplaceDispatchActionInAllLocationsUtil';
import { addPurchaseItemToStoreUtil } from '@/utils/purchases/purchasesUtil';

import createAction from '../actionCreator';

const clearMarketplaceCartAction = () => createAction(MarketplaceCartActionsConstants.CLEAR_MARKETPLACE_CART);

const updateMarketplaceCartAction = ({ cart, pageSettings, getCartInProcessFromApi }) =>
  createAction(MarketplaceCartActionsConstants.MARKETPLACE_CART_UPDATE, {
    cart,
    pageSettings,
    getCartInProcessFromApi,
  });

const getCartInfoInProcessAction = (getCartInfoInProcess) =>
  createAction(MarketplaceCartActionsConstants.GET_CART_INFO_IN_PROCESS, {
    getCartInfoInProcess,
  });

const getCartInfoSuccessAction = (cartInfo) =>
  createAction(MarketplaceCartActionsConstants.GET_CART_INFO_SUCCESS, {
    cartInfo,
  });

export const getCartInfoRequestAction = ({ cookie, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(getCartInfoInProcessAction(true));

    api
      .get('personal/cart/info', {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
      })
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(getCartInfoSuccessAction(responseData));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        dispatch(getCartInfoInProcessAction(false));

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        reject(errorData);
      });
  });

const getCartInProcessAction = (getCartInProcess) =>
  createAction(MarketplaceCartActionsConstants.GET_CART_IN_PROCESS, {
    getCartInProcess,
  });

const getCartSuccessAction = (cart, pageSettings, position) =>
  createAction(MarketplaceCartActionsConstants.GET_CART_SUCCESS, {
    cart,
    pageSettings,
    position,
  });

export const getCartRequestAction = ({ pageSize, pageNumber, withInProcess = true, position, cookie, dispatch }) =>
  new Promise((resolve, reject) => {
    const { store } = ReduxStoreService.getInstance();

    const { pageSettings: { page: { currentNumber: page, size } = {} } = {} } = store.getState().MarketplaceCartReducer;

    if (withInProcess) {
      dispatch(getCartInProcessAction(true));
    }

    api
      .get('personal/cart', {
        params: {
          size: pageSize || size,
          page: pageNumber || pageNumber === 0 ? pageNumber : page,
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
      })
      .then(({ data: { data: cart = [], payload: pageSettings } = {} }) => {
        dispatch(getCartSuccessAction(cart, pageSettings, position));

        resolve();
      })
      .catch((error) => {
        console.error(error);

        dispatch(getCartInProcessAction(false));

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        reject(errorData);
      });
  });

const addToCartInProcessAction = (addToCartInProcessId) =>
  createAction(MarketplaceCartActionsConstants.ADD_TO_CART_IN_PROCESS, {
    addToCartInProcessId,
  });

const addToCartSuccessAction = (cartInfo) =>
  createAction(MarketplaceCartActionsConstants.ADD_TO_CART_SUCCESS, {
    cartInfo,
  });

export const addToCartRequestAction = ({ goodsId, marketplaceCardId, targetType, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(addToCartInProcessAction(goodsId));

    api
      .put('personal/cart', {
        goodsId,
      })
      .then(({ data: { payload: { totalCartInfo: cartInfo = {} } = {} } = {} }) => {
        dispatch(addToCartSuccessAction(cartInfo));

        if (targetType === 'TRACK') {
          dispatch(
            toggleMarketplaceTrackToCartAction({
              cardId: marketplaceCardId,
              goodsId,
              inCart: true,
            })
          );
        } else {
          dispatch(
            toggleMarketplaceAlbumToCartAction({
              cardId: marketplaceCardId,
              inCart: true,
            })
          );

          marketplaceDispatchActionInAllLocationsUtil((location) => {
            dispatch(
              toggleMarketplacePreviewAlbumToCartAction({
                cardId: marketplaceCardId,
                inCart: true,
                location,
              })
            );
          });
        }

        resolve();
      })
      .catch((error) => {
        console.error(error);

        dispatch(addToCartInProcessAction([]));

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        reject(errorData);
      });
  });

const deleteToCartInProcessAction = (deleteFromCartInProcessId) =>
  createAction(MarketplaceCartActionsConstants.DELETE_TO_CART_IN_PROCESS, {
    deleteFromCartInProcessId,
  });

const deleteToCartSuccessAction = (cartInfo) =>
  createAction(MarketplaceCartActionsConstants.DELETE_TO_CART_SUCCESS, {
    cartInfo,
  });

export const deleteToCartRequestAction = ({ goodsId, marketplaceCardId, targetType, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(deleteToCartInProcessAction(goodsId));

    api
      .delete('personal/cart', {
        data: {
          goodsIds: [goodsId],
        },
      })
      .then(({ data: { payload: { totalCartInfo: cartInfo = {} } = {} } = {} }) => {
        dispatch(deleteToCartSuccessAction(cartInfo));

        removeGoodsByStoreUtil({
          goodsId,
          updateMarketplaceCartAction,
          getCartRequest: getCartRequestAction,
        });

        if (targetType === 'TRACK') {
          dispatch(
            toggleMarketplaceTrackToCartAction({
              cardId: marketplaceCardId,
              goodsId,
              inCart: false,
            })
          );
        } else {
          dispatch(
            toggleMarketplaceAlbumToCartAction({
              cardId: marketplaceCardId,
              inCart: false,
            })
          );

          marketplaceDispatchActionInAllLocationsUtil((location) => {
            dispatch(
              toggleMarketplacePreviewAlbumToCartAction({
                cardId: marketplaceCardId,
                inCart: false,
                location,
              })
            );
          });
        }

        resolve({});
      })
      .catch((error) => {
        console.error(error);

        dispatch(deleteToCartInProcessAction([]));

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        reject(errorData);
      });
  });

const buyCartInProcessAction = (buyCartInProcess) =>
  createAction(MarketplaceCartActionsConstants.BUY_CART_IN_PROCESS, {
    buyCartInProcess,
  });

const buyCartSuccessAction = () => createAction(MarketplaceCartActionsConstants.BUY_CART_SUCCESS);

export const buyCartRequestAction = ({ dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(buyCartInProcessAction(true));

    api
      .post('personal/purchase')
      .then(({ data: { data: item, data: { goods = [] } = {} } = {} }) => {
        dispatch(buyCartSuccessAction());
        dispatch(clearMarketplaceCartAction());
        dispatch(setMarketplaceCardPurchasedAction({ goods }));

        marketplaceDispatchActionInAllLocationsUtil((location) => {
          dispatch(setMarketplacePreviewPurchasedAction({ goods, location }));
        });

        addPurchaseItemToStoreUtil({
          item,
          updateAction: updatePurchasesAction,
          listRequest: getPurchasesRequestAction,
        });

        resolve();
      })
      .catch((error) => {
        console.error(error);

        dispatch(buyCartInProcessAction(false));

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        reject(errorData);
      });
  });
