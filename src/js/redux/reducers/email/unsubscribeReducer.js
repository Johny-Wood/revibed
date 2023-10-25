import { UnsubscribeActionsConstants } from '@/constants/actions/unsubscribe';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getUnsubscribeTypeInProcess: false,
  unsubscribeType: '',

  unsubscribeInProcess: false,
};

const handlers = createHandlers({
  [UnsubscribeActionsConstants.GET_UNSUBSCRIBE_TYPE_IN_PROCESS]: (state, { getUnsubscribeTypeInProcess = false }) => ({
    ...state,
    getUnsubscribeTypeInProcess,
  }),
  [UnsubscribeActionsConstants.GET_UNSUBSCRIBE_TYPE_SUCCESS]: (state, { unsubscribeType = '' }) => ({
    ...state,
    unsubscribeType,
    getUnsubscribeTypeInProcess: false,
  }),
  [UnsubscribeActionsConstants.CHANGE_UNSUBSCRIBE_TYPE]: (state, { unsubscribeType = '' }) => ({
    ...state,
    unsubscribeType,
  }),

  [UnsubscribeActionsConstants.UNSUBSCRIBE_IN_PROCESS]: (state, { unsubscribeInProcess = false }) => ({
    ...state,
    unsubscribeInProcess,
  }),
});

const UnsubscribeReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default UnsubscribeReducer;
