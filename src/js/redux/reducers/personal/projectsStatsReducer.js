import { PersonalActionsConstants } from '@/constants/actions/personal/personal';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  loadPersonalProjectsStatsInProcess: false,
  loadedPersonalProjectsStatsFromApi: false,
  personalProjectsStats: [],

  page: 0,
  size: 25,

  orders: {},
};

const handlers = createHandlers({
  [PersonalActionsConstants.LOAD_PERSONAL_PROJECTS_STATS_IN_PROCESS]: (state, { loadPersonalProjectsStatsInProcess }) => ({
    ...state,
    loadPersonalProjectsStatsInProcess,
  }),
  [PersonalActionsConstants.LOAD_PERSONAL_PROJECTS_STATS_SUCCESS]: (state, { personalProjectsStats }) => ({
    ...state,
    personalProjectsStats,
    loadPersonalProjectsStatsInProcess: false,
    loadedPersonalProjectsStatsFromApi: true,
    orders:
      personalProjectsStats.length > 0
        ? {
            role: {
              id: 6,
              value: 'DESC',
              label: 'Z-A',
            },
          }
        : {},
  }),

  [PersonalActionsConstants.RESET_LOAD_PERSONAL_PROJECTS_STATS_FROM_API]: (state) => ({
    ...state,
    loadedPersonalProjectsStatsFromApi: false,
  }),
});

const ProjectsStatsReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default ProjectsStatsReducer;
