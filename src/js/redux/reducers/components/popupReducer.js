import { PopupActionsConstants } from '@/constants/actions/components/popup';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  activePopupList: [],
};

const handlers = createHandlers({
  [PopupActionsConstants.SHOW_POPUP]: (state, { activePopupList }) => ({
    ...state,
    activePopupList,
  }),
  [PopupActionsConstants.CLOSE_POPUP]: (state, { popupId }) => {
    let indexDeletePopup = 0;

    if (popupId) {
      indexDeletePopup = state.activePopupList.findIndex(({ popupId: key }) => key === popupId);
    } else if (state.activePopupList.length > 0) {
      indexDeletePopup = state.activePopupList.length - 1;
    }

    const activePopupList =
      indexDeletePopup > -1
        ? [...state.activePopupList.slice(0, indexDeletePopup), ...state.activePopupList.slice(indexDeletePopup + 1)]
        : state.activePopupList;

    return {
      ...state,
      activePopupList,
    };
  },
});

const PopupReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default PopupReducer;
