import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import { EventsActionsConstants } from '@/constants/actions/common/events';
import { ProjectsActionsConstants } from '@/constants/actions/projects/projects';
import { ProjectsPreviewTypesConstants } from '@/constants/projects/previewTypes';
import { deleteFreeBonusUtil } from '@/utils/project/projectBonusesUtil';
import { updateBaseInfoHandlersUtil } from '@/utils/projects/actions/updateBaseInfoHandlersUtil';
import { updateNewContributorInfoHandlersUtil } from '@/utils/projects/actions/updateNewContributorInfoHandlersUtil';
import { updateNewEventInfoHandlersUtil } from '@/utils/projects/actions/updateNewEventInfoHandlersUtil';
import { filterSelectUtil } from '@/utils/sort-and-filter/filterUtils';
import { sortSelectUtil } from '@/utils/sort-and-filter/sortUtils';

import { createHandlers, createReducer } from '../../handler';

const initialState = {
  getProjectsInProcess: false,
  loadedProjectsFromApi: false,

  projects: [],
  pageSettings: {
    currentNumber: 0,
    size: 25,
  },

  previewType: ProjectsPreviewTypesConstants.CARD,

  filtersSelected: {},
  filtersApplied: {},
  filterApplied: false,

  sortSelected: {},

  search: '',
};

const createLocalHandlers = (location) =>
  createHandlers({
    [`${location}_${ProjectsActionsConstants.PROJECTS_RESET_FILTERS_AND_SORT}`]: (state) => ({
      ...state,
      filtersSelected: {},
      filtersApplied: {},
      filterApplied: false,
      sortSelected: {},
    }),

    [`${location}_${ProjectsActionsConstants.PROJECTS_UPDATE}`]: (
      state,
      {
        projects,
        pageSettings = {
          currentNumber: 0,
          size: undefined,
        },
        filtersApplied = {},
        filtersSelected = {},
        loadedProjectsFromApi = state.loadedProjectsFromApi,
      }
    ) => ({
      ...state,
      projects,
      pageSettings,
      filtersApplied,
      filtersSelected,
      loadedProjectsFromApi,
    }),

    [`${location}_${ProjectsActionsConstants.GET_PROJECTS_IN_PROCESS}`]: (state, { getProjectsInProcess }) => ({
      ...state,
      getProjectsInProcess,
    }),

    [`${location}_${ProjectsActionsConstants.RESET_GET_PROJECTS_FROM_API}`]: (state, { resetPageSettings = false }) => {
      if (resetPageSettings) {
        return {
          ...state,
          search: '',
          loadedProjectsFromApi: false,
          pageSettings: {},

          projects: [],

          page: 0,
          filtersSelected: {},
          filtersApplied: {},
          filterApplied: false,

          sortSelected: {},
        };
      }

      return {
        ...state,
        loadedProjectsFromApi: false,
      };
    },

    [`${location}_${ProjectsActionsConstants.GET_PROJECTS_SUCCESS}`]: (
      state,
      { projects, pageSettings, setProjectPosition, withoutSave, savePageSettings }
    ) => {
      if (withoutSave) {
        return {
          ...state,
          getProjectsInProcess: false,
        };
      }

      if (setProjectPosition === 'LAST') {
        return {
          ...state,
          getProjectsInProcess: false,
          projects: [...state.projects, ...projects],
          pageSettings: savePageSettings ? pageSettings : state.pageSettings,
        };
      }

      if (setProjectPosition === 'FIRST') {
        return {
          ...state,
          getProjectsInProcess: false,
          projects: [...projects, ...state.projects],
          pageSettings: savePageSettings ? pageSettings : state.pageSettings,
        };
      }

      return {
        ...state,
        getProjectsInProcess: false,
        projects,
        pageSettings,
        loadedProjectsFromApi: true,
      };
    },

    [`${location}_${ProjectsActionsConstants.SORT_SELECT}`]: (state, { categoryId, selected }) => ({
      ...state,
      ...sortSelectUtil({
        sortSelectedFromStore: state.sortSelected,
        categoryId,
        selected,
      }),
    }),

    [`${location}_${ProjectsActionsConstants.FILTER_SELECT}`]: (
      state,
      { categoryId, selected: selectedArr = [], multi, beforeResetCategory, beforeResetCategoryNow }
    ) => ({
      ...state,
      ...filterSelectUtil({
        filterAppliedFromStore: state.filterApplied,
        filtersAppliedFromStore: state.filtersApplied,
        filtersSelectedFromStore: state.filtersSelected,
        multi,
        categoryId,
        beforeResetCategory,
        beforeResetCategoryNow,
        selectedArr,
      }),
    }),

    [`${location}_${ProjectsActionsConstants.FILTER_APPLY}`]: (state) => {
      const filtersApplied = cloneDeep(state.filtersSelected);

      return {
        ...state,
        filterApplied: !isEmpty(filtersApplied),
        filtersApplied,
      };
    },

    [ProjectsActionsConstants.PROJECT_UPDATE_BASE_INFO]: (state, { projectId, data: { type, value } = {} }) => {
      const projectsTmp = cloneDeep(state.projects);
      const projectFindIdx = projectsTmp.findIndex(({ id }) => id === projectId);

      const data = updateBaseInfoHandlersUtil({
        data: projectsTmp,
        projectFindIdx,
        type,
        value,
        location: 'PROJECTS',
      });

      return {
        ...state,
        projects: data,
      };
    },

    [ProjectsActionsConstants.PROJECT_NEW_EVENT]: (state, { projectId, data: { type, value } = {} }) => {
      const projectsTmp = cloneDeep(state.projects);
      const projectFindIdx = projectsTmp.findIndex(({ id }) => id === projectId);
      const { to } = value || {};

      const data = updateNewEventInfoHandlersUtil({
        data: projectsTmp,
        projectFindIdx,
        type,
        value: to,
        location: 'PROJECTS',
      });

      return {
        ...state,
        projects: data,
      };
    },

    [ProjectsActionsConstants.PROJECT_NEW_CONTRIBUTOR]: (state, { projectId, data: { type, value } = {} }) => {
      const projectsTmp = cloneDeep(state.projects);
      const projectFindIdx = projectsTmp.findIndex(({ id }) => id === projectId);

      const data = updateNewContributorInfoHandlersUtil({
        data: projectsTmp,
        projectFindIdx,
        type,
        value,
        location: 'PROJECTS',
      });

      return {
        ...state,
        projects: data,
      };
    },

    [`${location}_${EventsActionsConstants.PROJECT_PUBLISHED}`]: (state, { projects = [] }) => ({
      ...state,
      projects,
    }),

    [`${location}_${ProjectsActionsConstants.CHANGE_PREVIEW_TYPE}`]: (
      state,
      { previewType = ProjectsPreviewTypesConstants.CARD }
    ) => ({
      ...state,
      previewType,
    }),

    [`${location}_${ProjectsActionsConstants.UPDATE_PROJECTS_PAGE_SETTINGS}`]: (
      state,
      { filters, sort, size, page, filterApplied }
    ) => ({
      ...state,
      pageSettings: {
        currentNumber: page,
        size,
      },
      size,
      page,
      filtersSelected: filters,
      filtersApplied: filters,
      filterApplied,
      sortSelected: sort,
    }),

    [`${location}_${ProjectsActionsConstants.UPDATE_PROJECTS_PROJECT}`]: (state, { projectId, projectInfo = {} }) => {
      const projects = cloneDeep(state.projects);

      const foundProjectIdx = projects.findIndex(({ id }) => id === projectId);

      if (foundProjectIdx === -1) {
        return {
          ...state,
        };
      }

      projects[foundProjectIdx] = projectInfo;

      return {
        ...state,
        projects,
      };
    },

    [`${location}_${ProjectsActionsConstants.PROJECTS_UPDATE_LIST_PAGE}`]: (state, { items, pageSettings }) => ({
      ...state,
      projects: items,
      pageSettings,
    }),

    [`${location}_${ProjectsActionsConstants.RESET_PROJECTS_CURRENT_PARAMS}`]: (state) => ({
      ...state,
      search: '',
      projects: [],
      pageSettings: {
        currentNumber: 0,
        size: 25,
      },

      previewType: ProjectsPreviewTypesConstants.CARD,

      filtersSelected: {},
      filtersApplied: {},
      filterApplied: false,

      sortSelected: {},
    }),

    [`${location}_${ProjectsActionsConstants.PROJECTS_SEARCH}`]: (state, { search = '' }) => ({
      ...state,
      search,
    }),

    [ProjectsActionsConstants.PROJECT_PREVIEW_DELETE_FREE_BONUS_SLOT]: (state, { type, projectCardId, removeAll }) => {
      const projectsTmp = cloneDeep(state.projects);
      const projectFindIdx = projectsTmp.findIndex(({ id }) => id === projectCardId);

      if (projectFindIdx === -1 || !projectsTmp || !projectsTmp[projectFindIdx] || !projectsTmp[projectFindIdx]?.freeBonuses) {
        return { ...state };
      }

      projectsTmp[projectFindIdx] = {
        ...projectsTmp[projectFindIdx],
        freeBonuses: deleteFreeBonusUtil({
          removeAll,
          type,
          freeBonuses: projectsTmp[projectFindIdx].freeBonuses,
        }),
      };

      return {
        ...state,
        projects: projectsTmp,
      };
    },
  });

const createProjectsReducer = (state = initialState, action, location) => {
  const handlers = createLocalHandlers(location);

  return createReducer(state, action, handlers);
};

export { createHandlers, createReducer };

export default createProjectsReducer;
