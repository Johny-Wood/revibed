import { RulesActionsConstants } from '@/constants/actions/common/rules';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  loadRulesInProcess: false,
  rulesContent: {},
};

const handlers = createHandlers({
  [RulesActionsConstants.LOAD_RULES_IN_PROCESS]: (state, { loadRulesInProcess = false }) => ({
    ...state,
    loadRulesInProcess,
  }),
  [RulesActionsConstants.LOAD_RULES_SUCCESS]: (state, { rulesName = '', rulesContent = {} }) => ({
    ...state,
    rulesContent: {
      ...state.rulesContent,
      [rulesName]: rulesContent,
    },
    loadRulesInProcess: false,
  }),
});

const RulesReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default RulesReducer;
