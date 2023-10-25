import { WebSocketBaseEventsConstants } from '@/constants/websocket/base';
import { loadVarsFromApiRequestAction } from '@/redux-actions/common/variablesActions';
import { loadPromoListRequestAction } from '@/redux-actions/promo/promoActions';
import ReduxStoreService from '@/services/ReduxStoreService';

import { createWebsocketEvent, createWebsocketHandlers } from '../websocketHandler';

const handlers = createWebsocketHandlers({
  [WebSocketBaseEventsConstants.BASE_EVENT_RELOAD_VARIABLES]: () => {
    const {
      store: { dispatch },
    } = ReduxStoreService.getInstance();

    loadVarsFromApiRequestAction({ dispatch })
      .then(() => {})
      .catch(() => {});
  },
  [WebSocketBaseEventsConstants.BASE_EVENT_RELOAD_PROMO]: () => {
    const {
      store: { dispatch },
    } = ReduxStoreService.getInstance();

    loadPromoListRequestAction({ dispatch })
      .then(() => {})
      .catch(() => {});
  },
});

const WebsocketBaseEvents = (eventName, data, callbackData) => createWebsocketEvent(eventName, data, handlers, callbackData);

export default WebsocketBaseEvents;
