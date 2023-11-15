import { getGoodsCollectionsListRequestAction } from '@/js/redux/actions/collections/goodsCollectionsActions';

export const SSRCollectionsRequests = async (ctx) => {
  const {
    req,
    store: { dispatch, getState },
  } = ctx;

  if (req) {
    await getGoodsCollectionsListRequestAction({ dispatch }).then().catch();
  } else {
    const { CollectionsListReducer: { getCollectionsListFromApi } = {} } = getState();

    if (!getCollectionsListFromApi) {
      getGoodsCollectionsListRequestAction({ dispatch }).then().catch();
    }
  }
};
