import { PromoActionsConstants } from '@/constants/actions/promo';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  promoActions: {
    BLACK_CAT_CARD: {},
    REFERRAL_PROGRAM: {},
  },

  makePromoCodeInProcess: false,
  getPromoCodeInfoInProcess: false,
};

const handlers = createHandlers({
  [PromoActionsConstants.LOAD_PROMO_LIST_SUCCESS]: (state, { promoActions }) => ({
    ...state,
    promoActions,
  }),
  [PromoActionsConstants.MAKE_PROMO_CODE_IN_PROCESS]: (state, { makePromoCodeInProcess }) => ({
    ...state,
    makePromoCodeInProcess,
  }),
  [PromoActionsConstants.MAKE_PROMO_CODE_SUCCESS]: (state, { promoName, data }) => ({
    ...state,
    makePromoCodeInProcess: false,
    promoActions: {
      ...state.promoActions,
      [promoName]: {
        ...state.promoActions[promoName],
        ...data,
      },
    },
  }),

  [PromoActionsConstants.GET_PROMO_CODE_INFO_IN_PROCESS]: (state, { getPromoCodeInfoInProcess = false }) => ({
    ...state,
    getPromoCodeInfoInProcess,
  }),
  [PromoActionsConstants.GET_PROMO_CODE_INFO_SUCCESS]: (state) => ({
    ...state,
    getPromoCodeInfoInProcess: false,
  }),
});

const PromoReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default PromoReducer;
