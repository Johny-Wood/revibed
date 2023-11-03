import { getCollectionsListRequestAction } from '@/redux-actions/collections/collectionsActions';

export const SSRCollectionsRequests = async (ctx) => {
  const {
    req,
    refreshedToken,
    store: { dispatch, getState },
  } = ctx;

  if (req) {
    await getCollectionsListRequestAction({ dispatch }).then().catch();
  } else {
    const { CollectionsListReducer: { getCollectionsListFromApi } = {} } = getState();

    if (!getCollectionsListFromApi) {
      getCollectionsListRequestAction({ dispatch }).then().catch();
    }
  }
};
