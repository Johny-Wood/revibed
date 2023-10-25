import { PersonalCashbackActionsConstants } from '@/constants/actions/personal/personalCashback';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getPersonalCashbackInProcess: false,
  getPersonalCashbackFromApi: false,
  personalCashback: {},
};

const handlers = createHandlers({
  [PersonalCashbackActionsConstants.GET_PERSONAL_CASHBACK_IN_PROCESS]: (state, { getPersonalCashbackInProcess }) => ({
    ...state,
    getPersonalCashbackInProcess,
  }),
  [PersonalCashbackActionsConstants.GET_PERSONAL_CASHBACK_SUCCESS]: (state, { personalCashback }) => ({
    ...state,
    getPersonalCashbackInProcess: false,
    getPersonalCashbackFromApi: true,
    personalCashback,
  }),
});

const CashbackReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default CashbackReducer;
