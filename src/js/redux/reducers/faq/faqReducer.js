import { FaqActionsConstants } from '@/constants/actions/faq';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  loadFaqInProcess: false,
  loadFaqFromApi: false,
  faqList: [],
  activeCategory: '',
  activeTitle: '',
};

const handlers = createHandlers({
  [FaqActionsConstants.SET_FAQ_ACTIVE_CATEGORY]: (state, { activeCategory, activeTitle }) => ({
    ...state,
    activeCategory,
    activeTitle,
  }),

  [FaqActionsConstants.LOAD_FAQ_IN_PROCESS]: (state, { loadFaqInProcess }) => ({
    ...state,
    loadFaqInProcess,
  }),
  [FaqActionsConstants.LOAD_FAQ_SUCCESS]: (state, { faqList }) => ({
    ...state,
    faqList,
    loadFaqFromApi: true,
    loadFaqInProcess: false,
  }),
});

const FaqReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default FaqReducer;
