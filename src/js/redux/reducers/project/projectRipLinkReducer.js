import { ProjectRipLinkActionsConstants } from '@/constants/actions/project/ripLink';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getProjectRipLinkBeforeConfirmInProcess: false,

  getProjectRipLinkConfirmInProcess: false,
};

const handlers = createHandlers({
  [ProjectRipLinkActionsConstants.GET_PROJECT_RIP_LINK_BEFORE_CONFIRM_IN_PROCESS]: (
    state,
    { getProjectRipLinkBeforeConfirmInProcess }
  ) => ({
    ...state,
    getProjectRipLinkBeforeConfirmInProcess,
  }),
  [ProjectRipLinkActionsConstants.GET_PROJECT_RIP_LINK_BEFORE_CONFIRM_SUCCESS]: (state) => ({
    ...state,
    getProjectRipLinkBeforeConfirmInProcess: false,
  }),

  [ProjectRipLinkActionsConstants.GET_PROJECT_RIP_LINK_CONFIRM_IN_PROCESS]: (state, { getProjectRipLinkConfirmInProcess }) => ({
    ...state,
    getProjectRipLinkConfirmInProcess,
  }),
  [ProjectRipLinkActionsConstants.GET_PROJECT_RIP_LINK_CONFIRM_SUCCESS]: (state) => ({
    ...state,
    getProjectRipLinkConfirmInProcess: false,
  }),
});

const ProjectRipLinkReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default ProjectRipLinkReducer;
