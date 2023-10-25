import { ProjectRipperActionsConstants } from '@/constants/actions/projects/projectRipper';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  addProjectCardRipperInfoInProcess: false,
};

const handlers = createHandlers({
  [ProjectRipperActionsConstants.ADD_PROJECT_CARD_RIPPER_INFO_IN_PROCESS]: (
    state,
    { addProjectCardRipperInfoInProcess = false }
  ) => ({
    ...state,
    addProjectCardRipperInfoInProcess,
  }),
  [ProjectRipperActionsConstants.ADD_PROJECT_CARD_RIPPER_INFO_SUCCESS]: (state) => ({
    ...state,
    addProjectCardRipperInfoInProcess: false,
  }),
});

const ProjectRipperReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default ProjectRipperReducer;
