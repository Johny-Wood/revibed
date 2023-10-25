import { loadFaqRequestAction } from '@/redux-actions/faq/faqActions';

export const SSRLoadFAQ = async ({ req, store, store: { dispatch } = {} }) => {
  if (req) {
    await loadFaqRequestAction()(dispatch).then().catch();
  } else {
    const { FaqReducer: { loadFaqFromApi } = {} } = store.getState();

    if (!loadFaqFromApi) {
      loadFaqRequestAction()(dispatch).then().catch();
    }
  }
};
