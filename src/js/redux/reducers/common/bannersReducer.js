import { BannersActionsConstants } from '@/constants/actions/common/banners';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getBannersInProcess: false,
  getBannersInProcessFromApi: false,
  banners: [],
  activeBanner: {},
};

const handlers = createHandlers({
  [BannersActionsConstants.GET_BANNERS_IN_PROCESS]: (state, { getBannersInProcess = false }) => ({
    ...state,
    getBannersInProcess,
  }),

  [BannersActionsConstants.GET_BANNERS_SUCCESS]: (state, { banners = [] }) => ({
    ...state,
    banners,
    getBannersInProcess: false,
    getBannersInProcessFromApi: true,
  }),

  [BannersActionsConstants.SET_ACTIVE_BANNER]: (state, { activeBanner = {} }) => ({
    ...state,
    activeBanner,
  }),
});

const BannersReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default BannersReducer;
