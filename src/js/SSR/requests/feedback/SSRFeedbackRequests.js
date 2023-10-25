import { loadFeedbackTopicsRequestAction } from '@/redux-actions/feedback/feedbackActions';

export const SSRLoadFeedbackTopics = async ({ req, store, store: { dispatch } = {} }) => {
  if (req) {
    await loadFeedbackTopicsRequestAction()(dispatch).then().catch();
  } else {
    const { FeedbackReducer: { loadFeedbackTopicsFromApi } = {} } = store.getState();

    if (!loadFeedbackTopicsFromApi) {
      loadFeedbackTopicsRequestAction()(dispatch).then().catch();
    }
  }
};
