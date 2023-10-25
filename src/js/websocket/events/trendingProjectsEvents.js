import { TrendingActionsConstants } from '@/constants/actions/trending';
import { WebSocketTrendingProjectsEventsConstants } from '@/constants/websocket/trendingProjects';
import { getShortProjectCardRequestAction } from '@/redux-actions/project/projectCardActions';
import ReduxStoreService from '@/services/ReduxStoreService';
import { unsubscribeProjectUtil } from '@/utils/project/projectsWebsocketUtil';

import { createWebsocketEvent, createWebsocketHandlers } from '../websocketHandler';

const handlers = createWebsocketHandlers({
  [WebSocketTrendingProjectsEventsConstants.PROJECTS_TRENDING_DELETE]: (trendingInfo) => {
    const { store } = ReduxStoreService.getInstance();
    const webSocketSubscriptionIds = trendingInfo.map(({ projectId }) => projectId);

    unsubscribeProjectUtil({ webSocketSubscriptionIds });

    store.dispatch({
      type: TrendingActionsConstants.PROJECTS_TRENDING_DELETE,
      payload: {
        trendingInfo,
      },
    });
  },
  [WebSocketTrendingProjectsEventsConstants.PROJECTS_TRENDING_REORDER]: (trendingInfo) => {
    const { store } = ReduxStoreService.getInstance();

    const { TrendingReducer: { projectsInfo = [] } = {} } = store.getState();

    const withoutProjectsInfoIds = trendingInfo
      .filter(({ projectId }) => !projectsInfo.map(({ id: trendingProjectId }) => trendingProjectId).includes(projectId))
      .map(({ projectId: newProjectId }) => newProjectId);

    if (withoutProjectsInfoIds.length > 0) {
      const awaitPromises = [];

      withoutProjectsInfoIds.forEach((projectId) => {
        awaitPromises.push(
          getShortProjectCardRequestAction({
            projectId,
            type: 'SHORT',
            dispatch: store.dispatch,
          })
        );
      });

      Promise.all(awaitPromises).then((promisePramsArray = []) => {
        store.dispatch({
          type: TrendingActionsConstants.PROJECTS_TRENDING_REORDER,
          payload: {
            trendingInfo,
            projectsInfo: promisePramsArray.map(({ newProject }) => ({ ...newProject })),
          },
        });
      });
    } else {
      store.dispatch({
        type: TrendingActionsConstants.PROJECTS_TRENDING_REORDER,
        payload: {
          trendingInfo,
        },
      });
    }
  },
});

const WebsocketTrendingProjectsEvents = (eventName, data, callbackData) =>
  createWebsocketEvent(eventName, data, handlers, callbackData);

export default WebsocketTrendingProjectsEvents;
