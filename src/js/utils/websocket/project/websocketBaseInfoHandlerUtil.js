import { ProjectsActionsConstants } from '@/constants/actions/projects/projects';
import ReduxStoreService from '@/services/ReduxStoreService';

export const websocketBaseInfoHandlerUtil = ({ projectId, data }) => {
  const { store } = ReduxStoreService.getInstance();

  store.dispatch({
    type: ProjectsActionsConstants.PROJECT_UPDATE_BASE_INFO,
    payload: {
      projectId,
      data,
    },
  });
};
