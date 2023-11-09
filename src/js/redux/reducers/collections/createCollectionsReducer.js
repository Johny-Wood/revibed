import { CollectionsActionsConstants } from '@/constants/actions/collections/collections';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  getCollectionsListInProcess: false,
  getCollectionsListFromApi: false,
  list: [],
};

const createLocalHandlers = () =>
  createHandlers({
    [`${CollectionsActionsConstants.GET_COLLECTIONS_IN_PROCESS}`]: (state, { getCollectionsListInProcess }) => ({
      ...state,
      getCollectionsListInProcess,
    }),

    [`${CollectionsActionsConstants.GET_COLLECTIONS_SUCCESS}`]: (state, { collectionsList, pageSettings }) => ({
      ...state,
      getCollectionsListInProcess: false,
      getCollectionsListFromApi: true,
      list: collectionsList,
      pageSettings,
    }),
  });

const createCollectionsReducer = (state = initialState, action) => {
  const handlers = createLocalHandlers();

  return createReducer(state, action, handlers);
};

export default createCollectionsReducer;
