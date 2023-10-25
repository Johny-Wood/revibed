import { WebSocketSubscriptionIdsConstants } from '@/constants/websocket/webSocketSubscriptionIds';
import WebSocketService from '@/services/WebSocketService';

export const unsubscribeProjectPublicUtil = ({ projectsIds = [], unsubscribeCallback = () => {} }) => {
  if (projectsIds.length === 0) {
    return;
  }

  WebSocketService.unsubscribe({
    category: WebSocketSubscriptionIdsConstants.PROJECT_PUBLIC,
    webSocketSubscriptionIds: projectsIds,
    unsubscribeCallback,
  });
};

export const subscribeProjectPublicUtil = ({ projectId }) => {
  if (!projectId) {
    return;
  }

  const webSocketSubscriptions = WebSocketService.getInstance(WebSocketSubscriptionIdsConstants.PROJECT_PUBLIC);

  if (webSocketSubscriptions.includes(projectId)) {
    return;
  }

  WebSocketService.subscribe({
    category: WebSocketSubscriptionIdsConstants.PROJECT_PUBLIC,
    webSocketSubscriptionId: projectId,
    subscribeName: `/public-project/${projectId}`,
  });
};
