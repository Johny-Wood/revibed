import { ReferralActionsConstants } from '@/constants/actions/personal/referral';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getReferralHistoryInProcess: false,
  getReferralHistoryFromApi: false,
  referralHistory: [],
  referralHistoryPageSettings: {
    page: {
      totalElements: 0,
      totalPages: 0,
      currentNumber: 0,
      size: 15,
    },
  },
};

const handlers = createHandlers({
  [ReferralActionsConstants.GET_REFERRAL_HISTORY_IN_PROCESS]: (state, { getReferralHistoryInProcess = false }) => ({
    ...state,
    getReferralHistoryInProcess,
  }),
  [ReferralActionsConstants.GET_REFERRAL_HISTORY_SUCCESS]: (
    state,
    { referralHistory = [], referralHistoryPageSettings = {} }
  ) => ({
    ...state,
    referralHistory,
    referralHistoryPageSettings,
    getReferralHistoryFromApi: true,
    getReferralHistoryInProcess: false,
  }),
});

const ReferralReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default ReferralReducer;
