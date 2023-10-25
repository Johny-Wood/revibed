import { ProjectInviteActionsConstants } from '@/constants/actions/projects/projectInvite';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  projectInviteInProcess: false,
};

const handlers = createHandlers({
  [ProjectInviteActionsConstants.PROJECT_INVITE_IN_PROCESS]: (state, { projectInviteInProcess = false }) => ({
    ...state,
    projectInviteInProcess,
  }),
  [ProjectInviteActionsConstants.PROJECT_INVITE_SUCCESS]: (state) => ({
    ...state,
    projectInviteInProcess: false,
  }),
});

const ProjectInviteReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default ProjectInviteReducer;
