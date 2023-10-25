import cloneDeep from 'lodash/cloneDeep';

import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { ProjectsFilterDestinationsConstants } from '@/constants/projects/filters/projectFilterDestinations';
import { ProjectsReducersMapConstants } from '@/constants/projects/reducersMap';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import { getProjectsRequestAction, updateProjectsAction } from '@/redux-actions/projects/projectsActions';
import ReduxStoreService from '@/services/ReduxStoreService';
import ScrollService from '@/services/scroll/ScrollService';

import { unsubscribeProjectUtil } from './projectsWebsocketUtil';

import { addItemToListByStoreUtil, updateListPageSettingsForDeleteUtil } from '../listUtils';

const updateProjectsListAfterRemove = ({ location, callback = () => {} }) => {
  const { store } = ReduxStoreService.getInstance();

  const {
    loadedProjectsFromApi = false,
    projects = [],
    pageSettings: { size = 25, totalPages = 0, currentNumber = 0, totalElements = 0 } = {},
  } = store.getState()[ProjectsReducersMapConstants[location]];

  const { dispatch } = store;

  if (currentNumber < totalPages - 1) {
    dispatch(
      getProjectsRequestAction({
        location,
        pageNumber: (currentNumber + 1) * size - 1,
        pageSize: 1,
        setProjectPosition: 'LAST',
        withInProcess: false,
        getNewProject: true,
      })
    );
  } else if (projects.length === 0 && currentNumber > 0) {
    dispatch(
      getProjectsRequestAction({
        location,
        pageNumber: currentNumber - 1,
      })
    );
  } else if (totalElements === 0 && !loadedProjectsFromApi) {
    dispatch(
      getProjectsRequestAction({
        location,
        pageNumber: 0,
      })
    );
  }

  callback();
};

export const removeProjectByStoreUtil = ({ location, projectId, callback = () => {} }) => {
  const { store } = ReduxStoreService.getInstance();
  const { dispatch } = store;

  const {
    loadedProjectsFromApi = false,
    projects: projectsFromStore = [],
    pageSettings: projectsPageSettingsFromStore = {},
    filtersSelected: filtersSelectedFromStore = {},
    filtersApplied: filtersAppliedFromStore = {},
  } = store.getState()[ProjectsReducersMapConstants[location]] || {};

  const projects = cloneDeep(projectsFromStore);
  const filtersSelected = cloneDeep(filtersSelectedFromStore);
  const filtersApplied = cloneDeep(filtersAppliedFromStore);
  const pageSettings = updateListPageSettingsForDeleteUtil(projectsPageSettingsFromStore);
  const { totalElements: updatedTotalElements } = pageSettings;
  const foundProjectDeleteIndex = projects.findIndex(({ id }) => id === projectId);
  const canRemoveUnreadable = updatedTotalElements === 0;

  if (!loadedProjectsFromApi || projectsFromStore.length === 0 || !projectId || foundProjectDeleteIndex === -1) {
    return;
  }

  projects.splice(foundProjectDeleteIndex, 1);

  unsubscribeProjectUtil({
    webSocketSubscriptionIds: [projectId],
  });

  if (canRemoveUnreadable) {
    delete filtersSelected[ProjectsFilterDestinationsConstants.UNREADABLE];
    delete filtersApplied[ProjectsFilterDestinationsConstants.UNREADABLE];
  }

  dispatch(
    updateProjectsAction({
      location,
      projects,
      pageSettings,
      filtersSelected,
      filtersApplied,
      loadedProjectsFromApi: !canRemoveUnreadable,
    })
  );

  updateProjectsListAfterRemove({ location, callback });
};

export const removeUnreadableProjectByStoreUtil = ({ location, projectId }) => {
  const { store } = ReduxStoreService.getInstance();

  const { filtersApplied = {} } = store.getState()[ProjectsReducersMapConstants[location]] || {};

  const filtersUnreadable = filtersApplied[ProjectsFilterDestinationsConstants.UNREADABLE] || {};
  let foundFilterUnreadableNew = false;

  Object.keys(filtersUnreadable).forEach((unreadableKey) => {
    const { queryParam } = filtersUnreadable[unreadableKey];
    foundFilterUnreadableNew = queryParam === 'true';
  });

  if (!filtersApplied || !filtersUnreadable || !foundFilterUnreadableNew) {
    return;
  }

  removeProjectByStoreUtil({ location, projectId });
};

export const addProjectToStoreUtil = ({ location, item, updateAction, listRequest }) => {
  const { store } = ReduxStoreService.getInstance();

  const {
    loadedProjectsFromApi = false,
    projects: projectsFromStore = [],
    pageSettings: projectsPageSettingsFromStore = {},
  } = store.getState()[ProjectsReducersMapConstants[location]] || {};

  addItemToListByStoreUtil({
    item,
    list: projectsFromStore,
    listPageSettingsFromStore: projectsPageSettingsFromStore,
    requestFromApi: loadedProjectsFromApi,
    updateAction,
    listRequest,
    location,
  });
};

export const getProjectsUtil = ({
  location,
  getProjectsInProcess,
  userId,
  secondOffset = 80,
  getProjects,

  search,
  isNowSending,
  withScroll = true,
  pageNumber,
  pageSize,
  updateSortAndFilters,
}) =>
  new Promise((resolve, reject) => {
    if (!getProjectsInProcess) {
      getProjects({
        search,
        location,
        userId,
        pageNumber: isNowSending && (!pageNumber || pageNumber <= 0) ? 0 : pageNumber,
        pageSize,
        updateSortAndFilters,
      }).then(() => {
        resolve();

        if (withScroll) {
          setTimeout(() => {
            ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL)
              .scrollToElement({
                sectionId: `${ScrollBlockIdConstants.PROJECTS_BLOCK_ID}_${location}`,
                inRoute: true,
                secondOffset,
              })
              .then();
          }, 60);
        } else {
          reject();
        }
      });
    } else {
      reject();
    }
  });
