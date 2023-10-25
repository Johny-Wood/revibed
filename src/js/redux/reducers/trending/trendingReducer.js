import cloneDeep from 'lodash/cloneDeep';

import { ProjectsActionsConstants } from '@/constants/actions/projects/projects';
import { TrendingActionsConstants } from '@/constants/actions/trending';
import { updateBaseInfoHandlersUtil } from '@/utils/projects/actions/updateBaseInfoHandlersUtil';
import { updateNewContributorInfoHandlersUtil } from '@/utils/projects/actions/updateNewContributorInfoHandlersUtil';
import { updateNewEventInfoHandlersUtil } from '@/utils/projects/actions/updateNewEventInfoHandlersUtil';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getTrendingListInProcess: false,
  getTrendingListFromApi: false,
  projects: [],
  trendingInfo: [],
  pageSettings: {
    currentNumber: 0,
    size: 25,
  },
};

const handlers = createHandlers({
  [TrendingActionsConstants.GET_TRENDING_LIST_IN_PROCESS]: (state, { getTrendingListInProcess = false }) => ({
    ...state,
    getTrendingListInProcess,
  }),
  [TrendingActionsConstants.GET_TRENDING_LIST_SUCCESS]: (
    state,
    { projectsInfo: projects = [], trendingInfo = [], pageSettings, setProjectPosition, savePageSettings }
  ) => {
    if (setProjectPosition === 'LAST') {
      return {
        ...state,
        getTrendingListInProcess: false,
        projects: [...state.projects, ...projects],
        pageSettings: savePageSettings ? pageSettings : state.pageSettings,
      };
    }

    if (setProjectPosition === 'FIRST') {
      return {
        ...state,
        getTrendingListInProcess: false,
        projects: [...projects, ...state.projects],
        pageSettings: savePageSettings ? pageSettings : state.pageSettings,
      };
    }

    return {
      ...state,
      trendingInfo,

      getTrendingListInProcess: false,
      getTrendingListFromApi: true,
      projects,
      pageSettings,
    };
  },
  [TrendingActionsConstants.PROJECTS_TRENDING_DELETE]: (state, { trendingInfo = [] }) => {
    const newTrendingInfo = cloneDeep(state.trendingInfo).filter(
      ({ projectId }) => !trendingInfo.map(({ projectId: trendingProjectId }) => trendingProjectId).includes(projectId)
    );

    return {
      ...state,
      trendingInfo: newTrendingInfo,
    };
  },
  [TrendingActionsConstants.PROJECTS_TRENDING_REORDER]: (state, { trendingInfo = [], projectsInfo = [] }) => {
    const newTrendingInfo = cloneDeep(state.trendingInfo).filter(
      ({ projectId }) => !trendingInfo.map(({ projectId: trendingProjectId }) => trendingProjectId).includes(projectId)
    );

    return {
      ...state,
      trendingInfo: [...newTrendingInfo, ...trendingInfo],
      projects: [...state.projects, ...projectsInfo],
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
  [ProjectsActionsConstants.PROJECT_NEW_EVENT]: (state, { userIdStore, projectId, data: { type, value } = {} }) => {
    const projectsTmp = cloneDeep(state.projects);
    const projectFindIdx = projectsTmp.findIndex(({ id }) => id === projectId);
    const { to } = value || {};

    const data = updateNewEventInfoHandlersUtil({
      data: projectsTmp,
      projectFindIdx,
      type,
      value: to,
      location: 'PROJECTS',
      userIdStore,
    });

    return {
      ...state,
      projects: data,
    };
  },
  [ProjectsActionsConstants.PROJECT_NEW_CONTRIBUTOR]: (state, { projectId, data: { type } = {} }) => {
    const projectsTmp = cloneDeep(state.projects);
    const projectFindIdx = projectsTmp.findIndex(({ id }) => id === projectId);

    const data = updateNewContributorInfoHandlersUtil({
      data: projectsTmp,
      projectFindIdx,
      type,
      location: 'TRENDING',
    });

    return {
      ...state,
      projects: data,
    };
  },
});

const TrendingReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default TrendingReducer;
