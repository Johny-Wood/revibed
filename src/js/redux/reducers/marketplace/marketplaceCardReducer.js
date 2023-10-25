import cloneDeep from 'lodash/cloneDeep';
import size from 'lodash/size';

import { MarketplaceCardActionsConstants } from '@/constants/actions/marketplace/marketplaceCard';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getMarketplaceCardInProcess: false,
  marketplaceCards: {},

  addMarketplaceCardToWantInProcess: false,
  removeMarketplaceCardToWantInProcess: false,
};

const handlers = createHandlers({
  [MarketplaceCardActionsConstants.SET_MARKETPLACE_CARD_PURCHASED]: (state, { goods = [] }) => {
    const marketplaceCards = cloneDeep(state.marketplaceCards);
    const goodsIds = goods.map(({ id }) => id);

    if (size(marketplaceCards) === 0) {
      return {
        ...state,
      };
    }

    Object.keys(marketplaceCards).forEach((cardId) => {
      if (goodsIds.includes(+cardId)) {
        const { realPurchaseAvailable } = marketplaceCards[cardId] || {};

        marketplaceCards[cardId].alreadyPurchased = true;
        marketplaceCards[cardId].inCart = false;
        marketplaceCards[cardId].purchaseAvailable = realPurchaseAvailable;
      }

      if (marketplaceCards[cardId]?.target?.tracksGoods.length > 0) {
        marketplaceCards[cardId].target.tracksGoods.forEach((trackGoods, idx) => {
          if (goodsIds.includes(+trackGoods.id)) {
            const { realPurchaseAvailable: trackRealPurchaseAvailable } = marketplaceCards[cardId].target.tracksGoods[idx] || {};

            marketplaceCards[cardId].target.tracksGoods[idx].alreadyPurchased = true;
            marketplaceCards[cardId].target.tracksGoods[idx].inCart = false;
            marketplaceCards[cardId].target.tracksGoods[idx].purchaseAvailable = trackRealPurchaseAvailable;
          }

          if (marketplaceCards[cardId].target.tracksGoods.length - 1 === idx) {
            const { rootGoodsId, albumPurchased } = goods.find(({ id: trackId }) => trackId === trackGoods.id) || {};

            if (rootGoodsId > -1 && albumPurchased) {
              const { realPurchaseAvailable: trackRealPurchaseAvailable } = marketplaceCards[rootGoodsId] || {};

              marketplaceCards[rootGoodsId].alreadyPurchased = true;
              marketplaceCards[rootGoodsId].inCart = false;
              marketplaceCards[rootGoodsId].purchaseAvailable = trackRealPurchaseAvailable;
            }
          }
        });
      }
    });

    return {
      ...state,
      marketplaceCards,
    };
  },

  [MarketplaceCardActionsConstants.TOGGLE_MARKETPLACE_ALBUM_TO_CART]: (state, { cardId, inCart = false }) => {
    const card = cloneDeep(state.marketplaceCards[cardId]);

    if (!card) {
      return { ...state };
    }

    const { realPurchaseAvailable } = card || {};

    card.inCart = inCart;
    card.purchaseAvailable = realPurchaseAvailable;

    if (card?.target?.tracksGoods.length > 0 && inCart) {
      card.target.tracksGoods.forEach((trackGoods, idx) => {
        if (trackGoods.inCart) {
          const { realPurchaseAvailable: trackRealPurchaseAvailable } = card.target.tracksGoods[idx] || {};

          card.target.tracksGoods[idx].inCart = !inCart;
          card.target.tracksGoods[idx].purchaseAvailable = trackRealPurchaseAvailable;
        }
      });
    }

    return {
      ...state,
      marketplaceCards: {
        ...state.marketplaceCards,
        [cardId]: {
          ...card,
        },
      },
    };
  },

  [MarketplaceCardActionsConstants.TOGGLE_MARKETPLACE_TRACK_TO_CART]: (state, { cardId, goodsId, inCart = false }) => {
    const card = cloneDeep(state.marketplaceCards[cardId]);

    if (!card) {
      return { ...state };
    }

    const { target: { tracksGoods = [] } = {} } = card || {};

    if (tracksGoods.length === 0) {
      return { ...state };
    }

    const foundTracksGoodsIdx = tracksGoods.findIndex(({ id }) => id === goodsId);

    if (foundTracksGoodsIdx === -1) {
      return { ...state };
    }

    const { realPurchaseAvailable } = card || {};

    const { realPurchaseAvailable: tracksRealPurchaseAvailable } = card.target.tracksGoods[foundTracksGoodsIdx] || {};

    card.target.tracksGoods[foundTracksGoodsIdx].inCart = inCart;
    card.target.tracksGoods[foundTracksGoodsIdx].purchaseAvailable = tracksRealPurchaseAvailable;

    const isAlbumInCart = tracksGoods.filter(({ inCart: trackInCart }) => trackInCart).length === tracksGoods.length;

    if (inCart && isAlbumInCart) {
      card.target.tracksGoods.forEach((trackGoods, idx) => {
        if (trackGoods.inCart) {
          const { realPurchaseAvailable: trackRealPurchaseAvailable } = card.target.tracksGoods[idx] || {};

          card.target.tracksGoods[idx].inCart = !inCart;
          card.target.tracksGoods[idx].purchaseAvailable = trackRealPurchaseAvailable;
        }
      });

      card.inCart = inCart;
      card.purchaseAvailable = realPurchaseAvailable;
    }

    return {
      ...state,
      marketplaceCards: {
        ...state.marketplaceCards,
        [cardId]: {
          ...card,
        },
      },
    };
  },

  [MarketplaceCardActionsConstants.GET_MARKETPLACE_CARD_IN_PROCESS]: (state, { getMarketplaceCardInProcess }) => ({
    ...state,
    getMarketplaceCardInProcess,
  }),

  [MarketplaceCardActionsConstants.GET_MARKETPLACE_CARD_SUCCESS]: (state, { marketplaceCard, marketplaceCardId }) => ({
    ...state,
    getMarketplaceCardInProcess: false,
    marketplaceCards: {
      ...state.marketplaceCards,
      [marketplaceCardId]: { ...marketplaceCard },
    },
  }),

  [MarketplaceCardActionsConstants.ADD_MARKETPLACE_CARD_TO_WANT_IN_PROCESS]: (state, { addMarketplaceCardToWantInProcess }) => ({
    ...state,
    addMarketplaceCardToWantInProcess,
  }),

  [MarketplaceCardActionsConstants.ADD_MARKETPLACE_CARD_TO_WANT_SUCCESS]: (state, { goodsId }) => ({
    ...state,
    addMarketplaceCardToWantInProcess: false,
    marketplaceCards: {
      ...state.marketplaceCards,
      [goodsId]: {
        ...state.marketplaceCards[goodsId],
        inWishlist: true,
        wantCount: (state.marketplaceCards[goodsId].wantCount || 0) + 1,
      },
    },
  }),

  [MarketplaceCardActionsConstants.DELETE_MARKETPLACE_CARD_TO_WANT_IN_PROCESS]: (
    state,
    { removeMarketplaceCardToWantInProcess }
  ) => ({
    ...state,
    removeMarketplaceCardToWantInProcess,
  }),

  [MarketplaceCardActionsConstants.DELETE_MARKETPLACE_CARD_TO_WANT_SUCCESS]: (state, { goodsId }) => ({
    ...state,
    removeMarketplaceCardToWantInProcess: false,
    marketplaceCards: {
      ...state.marketplaceCards,
      [goodsId]: {
        ...state.marketplaceCards[goodsId],
        inWishlist: false,
        wantCount: (state.marketplaceCards[goodsId].wantCount || 1) - 1,
      },
    },
  }),
});

const MarketplaceCardReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default MarketplaceCardReducer;
