import { PersonalActionsConstants } from '@/constants/actions/personal/personal';

import { createHandlers, createReducer } from '../../handler';

const initialState = {
  loadPersonalActivePointsInProcess: false,
  loadPersonalActivePointsFromApi: false,
  personalActivePoints: [],
  pageSettings: {},
};

const createLocalHandlers = (type) =>
  createHandlers({
    [`${type}_${PersonalActionsConstants.LOAD_PERSONAL_ACTIVE_POINTS_IN_PROCESS}`]: (
      state,
      { loadPersonalActivePointsInProcess }
    ) => ({
      ...state,
      loadPersonalActivePointsInProcess,
    }),

    [`${type}_${PersonalActionsConstants.LOAD_PERSONAL_ACTIVE_POINTS_SUCCESS}`]: (
      state,
      { personalActivePoints, pageSettings }
    ) => ({
      ...state,
      loadPersonalActivePointsFromApi: true,
      loadPersonalActivePointsInProcess: false,
      personalActivePoints,
      pageSettings,
    }),

    [`${type}_${PersonalActionsConstants.ADD_PERSONAL_ACTIVE_POINTS}`]: (state, { personalActivePoints }) => ({
      ...state,
      personalActivePoints: [...personalActivePoints, ...state.personalActivePoints],
    }),
  });

const createActivePointsReducer = (state = initialState, action, location) => {
  const handlers = createLocalHandlers(location);

  return createReducer(state, action, handlers);
};

export { createHandlers, createReducer };

export default createActivePointsReducer;
