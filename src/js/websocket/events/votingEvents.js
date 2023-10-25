import { WebSocketVotingEventsConstants } from '@/constants/websocket/voting';
import ReduxStoreService from '@/services/ReduxStoreService';

import { createWebsocketEvent, createWebsocketHandlers } from '../websocketHandler';

const handlers = createWebsocketHandlers({
  [WebSocketVotingEventsConstants.VOTING_EVENT_REFRESH]: (data, { votingId, loadVotingRequestAction }) => {
    const {
      store: { dispatch },
    } = ReduxStoreService.getInstance();

    loadVotingRequestAction({ votingId, dispatch })
      .then(() => {})
      .catch(() => {});
  },
});

const VotingWebsocketEvents = (eventName, data, callbackData) => createWebsocketEvent(eventName, data, handlers, callbackData);

export default VotingWebsocketEvents;
