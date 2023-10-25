import { ReactionsConstants } from '@/constants/actions/reactions';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  updateInProcess: {},
  reactions: {},
};

const handlers = createHandlers({
  [ReactionsConstants.UPDATE_IN_PROCESS]: (state, { updateInProcess, targetId, targetType }) => ({
    ...state,
    updateInProcess: {
      ...state.updateInProcess,
      [targetType]: {
        ...state.updateInProcess[targetType],
        [targetId]: updateInProcess,
      },
    },
  }),
  [ReactionsConstants.UPDATE_REACTIONS]: (state, { targetType, targetId, data }) => ({
    ...state,
    reactions: {
      ...state.reactions,
      [targetType]: {
        ...state.reactions[targetType],
        [targetId]: data,
      },
    },
    updateInProcess: {
      ...state.updateInProcess,
      [targetType]: {
        ...state.updateInProcess[targetType],
        [targetId]: false,
      },
    },
  }),
});

const ReactionsReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default ReactionsReducer;
