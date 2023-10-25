import { MessagesActionsConstants } from '@/constants/actions/components/messages';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  activeMessageList: [],
};

const handlers = createHandlers({
  [MessagesActionsConstants.SHOW_MESSAGE]: (state, { activeMessageList }) => ({
    ...state,
    activeMessageList,
  }),
  [MessagesActionsConstants.CLOSE_MESSAGE]: (state, { messageKey }) => {
    const indexDeleteMessage = messageKey ? state.activeMessageList.findIndex(({ messageKey: key }) => key === messageKey) : 0;

    const activeMessageList =
      indexDeleteMessage > -1
        ? [...state.activeMessageList.slice(0, indexDeleteMessage), ...state.activeMessageList.slice(indexDeleteMessage + 1)]
        : state.activeMessageList;

    return {
      ...state,
      activeMessageList,
    };
  },
});

const MessageReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default MessageReducer;
