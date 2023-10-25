import { DarkOverlayActionsConstants } from '@/constants/actions/components/darkOverlay';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  isShown: false,
};

const handlers = createHandlers({
  [DarkOverlayActionsConstants.TOGGLE_SHOW_DARK_BACKGROUND_OVERLAY]: (state, { isShown }) => ({
    ...state,
    isShown,
  }),
});

const DarkOverlayReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default DarkOverlayReducer;
