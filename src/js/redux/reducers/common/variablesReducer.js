import { VariablesActionsConstants } from '@/constants/actions/common/variables';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  variablesList: {
    FRIENDS_DISABLE: true,
    START_PROJECT_ENABLED: true,
    START_PROJECT_SUB_TEXT:
      'The Discogs API service has some issues right now. That’s why creating new projects is temporarily' +
      ' unavailable. We apologize for the inconvenience.',
    CONFIRM_PHONE_REQUEST_INTERVAL_SECONDS: 180,
    REQUIRE_PHONE_CONFIRMATION_FOR_TARGET_ACTIONS: false,
    PROJECT_AVAILABLE_SELL_ITEMS_LOADER_ENABLED: false,
    FUNDING_NOW_PROJECTS_LIMIT: 8,
    // NEW_ARRIVALS_PROJECTS_LIMIT: 12,
    LAST_RIPPED_PROJECTS_LIMIT: 12,
    emails: {
      CONTACT: 'contact@revibed.com',
    },
  },
};

const handlers = createHandlers({
  [VariablesActionsConstants.LOAD_VARIABLES_LIST]: (state, { variablesList }) => ({
    ...state,
    variablesList: {
      ...state.variablesList,
      ...variablesList,
    },
  }),
});

const VariablesReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default VariablesReducer;
