import qs from 'qs';

import api from '@/api';
import { MarketplaceCardActionsConstants } from '@/constants/actions/marketplace/marketplaceCard';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

export const setMarketplaceCardPurchasedAction = ({ goods }) =>
  createAction(MarketplaceCardActionsConstants.SET_MARKETPLACE_CARD_PURCHASED, {
    goods,
  });

export const toggleMarketplaceTrackToCartAction = ({ cardId, goodsId, inCart }) =>
  createAction(MarketplaceCardActionsConstants.TOGGLE_MARKETPLACE_TRACK_TO_CART, {
    cardId,
    goodsId,
    inCart,
  });

export const toggleMarketplaceAlbumToCartAction = ({ cardId, inCart }) =>
  createAction(MarketplaceCardActionsConstants.TOGGLE_MARKETPLACE_ALBUM_TO_CART, {
    cardId,
    inCart,
  });

const getMarketplaceCardInProcessAction = (getMarketplaceCardInProcess) =>
  createAction(MarketplaceCardActionsConstants.GET_MARKETPLACE_CARD_IN_PROCESS, {
    getMarketplaceCardInProcess,
  });

const getMarketplaceCardSuccessAction = (marketplaceCard, marketplaceCardId) =>
  createAction(MarketplaceCardActionsConstants.GET_MARKETPLACE_CARD_SUCCESS, {
    marketplaceCard,
    marketplaceCardId,
  });

export const getMarketplaceCardRequestAction = ({ marketplaceCardId, cookie, dispatch }) =>
  new Promise((resolve) => {
    dispatch(getMarketplaceCardInProcessAction(true));

    api
      .get(`goods/${marketplaceCardId}`, {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: card = {}, data: { id } = {} } = {} }) => {
        dispatch(getMarketplaceCardSuccessAction(card, id));

        resolve({});
      })
      .catch((error) => {
        console.error(error);

        dispatch(getMarketplaceCardInProcessAction(false));

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        resolve(errorData);
      });
  });

const addMarketplaceCardToWantInProcessAction = (addMarketplaceCardToWantInProcess) =>
  createAction(MarketplaceCardActionsConstants.ADD_MARKETPLACE_CARD_TO_WANT_IN_PROCESS, {
    addMarketplaceCardToWantInProcess,
  });

const addMarketplaceCardToWantSuccessAction = (goodsId) =>
  createAction(MarketplaceCardActionsConstants.ADD_MARKETPLACE_CARD_TO_WANT_SUCCESS, {
    goodsId,
  });

export const addMarketplaceCardToWantRequestAction = ({ goodsId, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(addMarketplaceCardToWantInProcessAction(true));

    api
      .post(`goods/${goodsId}/want`)
      .then(() => {
        dispatch(addMarketplaceCardToWantSuccessAction(goodsId));

        resolve({});
      })
      .catch((error) => {
        console.error(error);

        dispatch(addMarketplaceCardToWantInProcessAction(false));

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        reject(errorData);
      });
  });

const removeMarketplaceCardToWantInProcessAction = (removeMarketplaceCardToWantInProcess) =>
  createAction(MarketplaceCardActionsConstants.DELETE_MARKETPLACE_CARD_TO_WANT_IN_PROCESS, {
    removeMarketplaceCardToWantInProcess,
  });

const removeMarketplaceCardToWantSuccessAction = (goodsId) =>
  createAction(MarketplaceCardActionsConstants.DELETE_MARKETPLACE_CARD_TO_WANT_SUCCESS, {
    goodsId,
  });

export const removeMarketplaceCardToWantRequestAction = ({ goodsId, dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(removeMarketplaceCardToWantInProcessAction(true));

    api
      .delete(`goods/${goodsId}/want`)
      .then(() => {
        dispatch(removeMarketplaceCardToWantSuccessAction(goodsId));

        resolve({});
      })
      .catch((error) => {
        console.error(error);

        dispatch(removeMarketplaceCardToWantInProcessAction(false));

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);
        reject(errorData);
      });
  });
