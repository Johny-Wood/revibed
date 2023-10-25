import cloneDeep from 'lodash/cloneDeep';

import { ProjectsReducersMapConstants } from '@/constants/projects/reducersMap';
import ReduxStoreService from '@/services/ReduxStoreService';

export const updateProjectsInfoUtil = ({ projectId, projectInfo, updateAction }) => {
  const { store } = ReduxStoreService.getInstance();

  Object.keys(ProjectsReducersMapConstants).forEach((location) => {
    const { projects } = store.getState()[ProjectsReducersMapConstants[location]];

    const projectsTmp = cloneDeep(projects);

    const foundProject = projectsTmp.findIndex(({ id }) => id === projectId);

    if (foundProject !== -1) {
      store.dispatch(updateAction({ location, projectInfo, projectId }));
    }
  });
};
