import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';

import { ProjectsReducersMapConstants } from '@/constants/projects/reducersMap';
import { WebSocketSubscriptionIdsConstants } from '@/constants/websocket/webSocketSubscriptionIds';
import ReduxStoreService from '@/services/ReduxStoreService';
import WebSocketService from '@/services/WebSocketService';
import { subscribeProjectPublicUtil, unsubscribeProjectPublicUtil } from '@/utils/project/projectsPublicWebsocketUtil';
import projectsStatusesUtil from '@/utils/project/projectsStatusesUtil';

export const unsubscribeProjectUtil = ({ webSocketSubscriptionIds = [], unsubscribeCallback = () => {} }) => {
  const projectsIds = cloneDeep(webSocketSubscriptionIds);
  const { store } = ReduxStoreService.getInstance();

  const { projectCards } = store.getState().ProjectCardReducer;

  const projectsCardsIds = Object.keys(projectCards[0]).map((id) => +id);

  const projectsCollected = Object.keys(ProjectsReducersMapConstants)
    .map((projectLocation) => store.getState()[ProjectsReducersMapConstants[projectLocation]])
    .map(({ projects }) => projects.map(({ id }) => id))
    .reduce((prev, curr) => [...prev, ...curr], []);

  if (projectsCardsIds.length > 0) {
    projectsCollected.push(...projectsCardsIds);
  }

  const projectsDuplicated = projectsCollected.filter((item, index) => projectsCollected.indexOf(item) !== index);

  projectsDuplicated.forEach((projectDuplicated) => {
    if (projectsIds.includes(projectDuplicated)) {
      remove(projectsIds, (projectCurrentLocation) => projectCurrentLocation === projectDuplicated);
    }
  });

  WebSocketService.unsubscribe({
    category: WebSocketSubscriptionIdsConstants.PROJECT,
    webSocketSubscriptionIds: projectsIds,
    unsubscribeCallback,
  });

  unsubscribeProjectPublicUtil({ projectsIds, unsubscribeCallback });
};

export const subscribeProjectUtil = ({ projectId, status = {}, subscribeNow }) => {
  const { name } = status;

  subscribeProjectPublicUtil({ projectId });

  if (
    (!subscribeNow && (projectsStatusesUtil.isLegacyStatus(name) || projectsStatusesUtil.isRejectedStatus(name))) ||
    !projectId
  ) {
    return;
  }

  const webSocketSubscriptions = WebSocketService.getInstance(WebSocketSubscriptionIdsConstants.PROJECT);

  if (webSocketSubscriptions.includes(projectId)) {
    return;
  }

  WebSocketService.subscribe({
    category: WebSocketSubscriptionIdsConstants.PROJECT,
    webSocketSubscriptionId: projectId,
    subscribeName: `/project/${projectId}`,
  });
};
