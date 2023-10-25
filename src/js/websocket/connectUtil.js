import { WebSocketSubscriptionIdsConstants } from '@/constants/websocket/webSocketSubscriptionIds';
import WebSocketService from '@/services/WebSocketService';
import WebsocketBaseEvents from '@/websocket/events/baseEvents';
import WebsocketChatEvents from '@/websocket/events/chatEvents';
import WebsocketGlobalEvents from '@/websocket/events/globalEvents';
import WebsocketProjectEvents from '@/websocket/events/projectEvents';
import WebsocketProjectPublicEvents from '@/websocket/events/projectPublicEvents';
import WebsocketTrendingProjectsEvents from '@/websocket/events/trendingProjectsEvents';
import WebsocketUserEvents from '@/websocket/events/userEvents';
import VotingWebsocketEvents from '@/websocket/events/votingEvents';

export const websocketConnectUtil = (callback) => {
  WebSocketService.connect({
    callback,
    subscribeHandlers: {
      [WebSocketSubscriptionIdsConstants.USER_INFO]: WebsocketUserEvents,
      [WebSocketSubscriptionIdsConstants.CHAT]: WebsocketChatEvents,
      [WebSocketSubscriptionIdsConstants.PROJECT]: WebsocketProjectEvents,
      [WebSocketSubscriptionIdsConstants.PROJECT_PUBLIC]: WebsocketProjectPublicEvents,
      [WebSocketSubscriptionIdsConstants.BASE]: WebsocketBaseEvents,
      [WebSocketSubscriptionIdsConstants.VOTING]: VotingWebsocketEvents,
      [WebSocketSubscriptionIdsConstants.EVENTS]: WebsocketGlobalEvents,
      [WebSocketSubscriptionIdsConstants.TRENDING_PROJECTS]: WebsocketTrendingProjectsEvents,
    },
  });

  WebSocketService.subscribe({
    category: WebSocketSubscriptionIdsConstants.BASE,
    subscribeName: '/base',
  });

  WebSocketService.subscribe({
    category: WebSocketSubscriptionIdsConstants.EVENTS,
    subscribeName: '/events',
  });

  WebSocketService.subscribe({
    category: WebSocketSubscriptionIdsConstants.TRENDING_PROJECTS,
    subscribeName: '/trending-projects',
  });
};
