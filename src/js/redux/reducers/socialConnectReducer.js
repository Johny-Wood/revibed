import { SocialConnectActionsConstants } from '@/constants/actions/socialConnect';

import { createHandlers, createReducer } from './handler';

const initialState = {
  discogsSocialConnectGenerateRedirectUrlInProcess: false,
  discogsSocialConnectInProcess: false,
  discogsSocialDisconnectInProcess: false,
};

const handlers = createHandlers({
  [SocialConnectActionsConstants.DISCOGS_SOCIAL_CONNECT_GENERATE_URL_IN_PROCESS]: (
    state,
    { discogsSocialConnectGenerateRedirectUrlInProcess }
  ) => ({
    ...state,
    discogsSocialConnectGenerateRedirectUrlInProcess,
  }),
  [SocialConnectActionsConstants.DISCOGS_SOCIAL_CONNECT_IN_PROCESS]: (state, { discogsSocialConnectInProcess }) => ({
    ...state,
    discogsSocialConnectInProcess,
  }),

  [SocialConnectActionsConstants.DISCOGS_SOCIAL_DISCONNECT_IN_PROCESS]: (state, { discogsSocialDisconnectInProcess }) => ({
    ...state,
    discogsSocialDisconnectInProcess,
  }),
});

const SocialConnectReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default SocialConnectReducer;
