import { ProjectBaseInfoConstants } from '@/constants/projects/baseInfo';
import { WebSocketProjectEventsConstants } from '@/constants/websocket/project';
import { WebSocketSubscriptionIdsConstants } from '@/constants/websocket/webSocketSubscriptionIds';
import WebSocketService from '@/services/WebSocketService';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';
import { websocketBaseInfoHandlerUtil } from '@/utils/websocket/project/websocketBaseInfoHandlerUtil';
import { websocketNewContributorHandlerUtil } from '@/utils/websocket/project/websocketNewContributorHandlerUtil';
import { websocketNewEventsHandlerUtil } from '@/utils/websocket/project/websocketNewEventsHandlerUtil';

import { createWebsocketEvent, createWebsocketHandlers } from '../websocketHandler';

const handlers = createWebsocketHandlers({
  [WebSocketProjectEventsConstants.PROJECT_UPDATE_BASE_INFO]: (data, { webSocketSubscriptionId: projectId }) => {
    const { type, value: { to = {} } = {} } = data;
    const webSocketSubscriptions = WebSocketService.getInstance(WebSocketSubscriptionIdsConstants.PROJECT);

    if (type === ProjectBaseInfoConstants.PROJECT_STATUS_CHANGED) {
      const { name: nameTo } = to;

      if (projectsStatusesUtil.isLegacyStatus(nameTo) || projectsStatusesUtil.isRejectedStatus(nameTo)) {
        if (webSocketSubscriptions.includes(projectId)) {
          WebSocketService.unsubscribe({
            category: WebSocketSubscriptionIdsConstants.PROJECT,
            webSocketSubscriptionIds: [projectId],
          });
        }
      }
    }

    websocketBaseInfoHandlerUtil({ data, projectId });
  },

  [WebSocketProjectEventsConstants.PROJECT_NEW_EVENT]: (data, { webSocketSubscriptionId: projectId }) => {
    websocketNewEventsHandlerUtil({ data, projectId });
  },

  [WebSocketProjectEventsConstants.PROJECT_NEW_CONTRIBUTOR]: (data, { webSocketSubscriptionId: projectId }) => {
    websocketNewContributorHandlerUtil({ data, projectId });
  },
});

const WebsocketProjectEvents = (eventName, data, callbackData) => createWebsocketEvent(eventName, data, handlers, callbackData);

export default WebsocketProjectEvents;
