import { FeedbackActionsConstants } from '@/constants/actions/feedback';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  loadFeedbackTopicsInProcess: false,
  loadFeedbackTopicsFromApi: false,
  feedbackTopics: [],

  sendFeedbackTicketInProcess: false,
};

const handlers = createHandlers({
  [FeedbackActionsConstants.LOAD_FEEDBACK_TOPICS_IN_PROCESS]: (state, { loadFeedbackTopicsInProcess = false }) => ({
    ...state,
    loadFeedbackTopicsInProcess,
  }),
  [FeedbackActionsConstants.LOAD_FEEDBACK_TOPICS_SUCCESS]: (state, { feedbackTopics = [] }) => ({
    ...state,
    feedbackTopics,
    loadFeedbackTopicsInProcess: false,
    loadFeedbackTopicsFromApi: true,
  }),

  [FeedbackActionsConstants.SEND_FEEDBACK_TICKET_IN_PROCESS]: (state, { sendFeedbackTicketInProcess = false }) => ({
    ...state,
    sendFeedbackTicketInProcess,
  }),
  [FeedbackActionsConstants.SEND_FEEDBACK_TICKET_SUCCESS]: (state) => ({
    ...state,
    sendFeedbackTicketInProcess: false,
  }),
});

const FeedbackReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default FeedbackReducer;
