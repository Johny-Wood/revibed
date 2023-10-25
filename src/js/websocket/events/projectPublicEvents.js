import { WebSocketProjectEventsConstants } from '@/constants/websocket/project';
import { websocketBaseInfoHandlerUtil } from '@/utils/websocket/project/websocketBaseInfoHandlerUtil';
import { websocketNewContributorHandlerUtil } from '@/utils/websocket/project/websocketNewContributorHandlerUtil';
import { websocketNewEventsHandlerUtil } from '@/utils/websocket/project/websocketNewEventsHandlerUtil';

import { createWebsocketEvent, createWebsocketHandlers } from '../websocketHandler';

const handlers = createWebsocketHandlers({
  [WebSocketProjectEventsConstants.PROJECT_UPDATE_BASE_INFO]: (data, { webSocketSubscriptionId: projectId }) => {
    websocketBaseInfoHandlerUtil({ data, projectId });
  },
  [WebSocketProjectEventsConstants.PROJECT_NEW_EVENT]: (data, { webSocketSubscriptionId: projectId }) => {
    websocketNewEventsHandlerUtil({ data, projectId });
  },
  [WebSocketProjectEventsConstants.PROJECT_NEW_CONTRIBUTOR]: (data, { webSocketSubscriptionId: projectId }) => {
    websocketNewContributorHandlerUtil({ data, projectId });
  },
});

const WebsocketProjectPublicEvents = (eventName, data, callbackData) =>
  createWebsocketEvent(eventName, data, handlers, callbackData);

export default WebsocketProjectPublicEvents;
