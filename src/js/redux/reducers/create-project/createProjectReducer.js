import { CreateProjectActionsConstants } from '@/constants/actions/projects/createProject';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  createProjectAutoFillInProcess: false,
  createProjectData: {},
  externalInfo: {
    description: '',
  },

  createProjectInProcess: false,

  editProjectInProcess: false,

  deleteProjectInProcess: false,

  costCalculationInProcess: false,
};

const handlers = createHandlers({
  [CreateProjectActionsConstants.COST_CALCULATION_IN_PROCESS]: (state, { costCalculationInProcess = false }) => ({
    ...state,
    costCalculationInProcess,
  }),

  [CreateProjectActionsConstants.CREATE_PROJECT_UPDATE_AUTO_FILL]: (state, { createProjectData }) => ({
    ...state,
    createProjectData,
  }),

  [CreateProjectActionsConstants.CREATE_PROJECT_AUTO_FILL_IN_PROCESS]: (state, { createProjectAutoFillInProcess }) => ({
    ...state,
    createProjectAutoFillInProcess,
  }),

  [CreateProjectActionsConstants.CREATE_PROJECT_AUTO_FILL_SUCCESS]: (state, { createProjectData }) => ({
    ...state,
    createProjectAutoFillInProcess: false,
    createProjectData,
  }),

  [CreateProjectActionsConstants.CREATE_PROJECT_IN_PROCESS]: (state, { createProjectInProcess }) => ({
    ...state,
    createProjectInProcess,
  }),

  [CreateProjectActionsConstants.CREATE_PROJECT_SUCCESS]: (state) => ({
    ...state,
    createProjectInProcess: false,
  }),

  [CreateProjectActionsConstants.EDIT_PROJECT_IN_PROCESS]: (state, { editProjectInProcess }) => ({
    ...state,
    editProjectInProcess,
  }),

  [CreateProjectActionsConstants.DELETE_PROJECT_IN_PROCESS]: (state, { deleteProjectInProcess }) => ({
    ...state,
    deleteProjectInProcess,
  }),
  [CreateProjectActionsConstants.DELETE_PROJECT_SUCCESS]: (state) => ({
    ...state,
    deleteProjectInProcess: false,
  }),

  [CreateProjectActionsConstants.UPDATE_PROJECT_EXTERNAL_INFO]: (state, { externalInfo = {} }) => ({
    ...state,
    externalInfo: {
      ...state.externalInfo,
      ...externalInfo,
    },
  }),
});

const CreateProjectReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default CreateProjectReducer;
