import { ProjectBalanceActionsConstants } from '@/constants/actions/projects/projectBalance';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  loadProjectBalanceInProcess: false,
  projectBalance: [],
  projectBalancePageSettings: {},
};

const handlers = createHandlers({
  [ProjectBalanceActionsConstants.LOAD_PROJECT_BALANCE_IN_PROCESS]: (state, { loadProjectBalanceInProcess = false }) => ({
    ...state,
    loadProjectBalanceInProcess,
  }),
  [ProjectBalanceActionsConstants.LOAD_PROJECT_BALANCE_SUCCESS]: (
    state,
    { projectBalance = [], projectBalancePageSettings = {} }
  ) => ({
    ...state,
    projectBalance,
    projectBalancePageSettings,
    loadProjectBalanceInProcess: false,
  }),
});

const ProjectBalanceReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default ProjectBalanceReducer;
