import { ScrollActionsConstants } from '@/constants/actions/scroll';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  isDisabled: false,
};

const handlers = createHandlers({
  [ScrollActionsConstants.DISABLE_SCROLL]: (state, { isDisabled }) => ({
    ...state,
    isDisabled,
  }),
});

const ScrollReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default ScrollReducer;
