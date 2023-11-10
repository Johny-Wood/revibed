import { GoodsCollectionsActionsConstants } from '@/constants/actions/collections/collections';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getGoodsCollectionsListInProcess: false,
  getGoodsCollectionsListFromApi: false,
  list: [],
};

const createLocalHandlers = () =>
  createHandlers({
    [`${GoodsCollectionsActionsConstants.GET_COLLECTIONS_IN_PROCESS}`]: (state, { getGoodsCollectionsListInProcess }) => ({
      ...state,
      getGoodsCollectionsListInProcess,
    }),

    [`${GoodsCollectionsActionsConstants.GET_COLLECTIONS_SUCCESS}`]: (state, { goodsCollectionsList, pageSettings }) => ({
      ...state,
      getCollectionsListInProcess: false,
      getCollectionsListFromApi: true,
      list: goodsCollectionsList,
      pageSettings,
    }),
  });

const createGoodsCollectionsReducer = (state = initialState, action) => {
  const handlers = createLocalHandlers();

  return createReducer(state, action, handlers);
};

export default createGoodsCollectionsReducer;
