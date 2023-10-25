import { WebsocketActionsConstants } from '@/constants/actions/websocket';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  webSocketSubscriptionsBeforeConnect: {},
};

const handlers = createHandlers({
  [WebsocketActionsConstants.ADD_SUBSCRIBE_BEFORE_CONNECT]: (state, { subscribe, category }) => ({
    ...state,
    webSocketSubscriptionsBeforeConnect: {
      ...state.webSocketSubscriptionsBeforeConnect,
      [category]: state.webSocketSubscriptionsBeforeConnect[category]
        ? [...state.webSocketSubscriptionsBeforeConnect[category], subscribe]
        : [subscribe],
    },
  }),

  [WebsocketActionsConstants.CLEAR_SUBSCRIBES_BEFORE_CONNECT]: (state) => ({
    ...state,
    webSocketSubscriptionsBeforeConnect: [],
  }),
});

const WebsocketSubscribeReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default WebsocketSubscribeReducer;
