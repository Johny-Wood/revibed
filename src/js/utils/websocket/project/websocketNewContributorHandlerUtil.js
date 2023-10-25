import { ProjectsActionsConstants } from '@/constants/actions/projects/projects';
import ReduxStoreService from '@/services/ReduxStoreService';

export const websocketNewContributorHandlerUtil = ({ projectId, data }) => {
  const { store } = ReduxStoreService.getInstance();

  store.dispatch({
    type: ProjectsActionsConstants.PROJECT_NEW_CONTRIBUTOR,
    payload: {
      projectId,
      data,
    },
  });
};
