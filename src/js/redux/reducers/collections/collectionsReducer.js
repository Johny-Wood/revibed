// import { CollectionsActionsConstants } from '@/constants/actions/collections/collections';

import createCollectionsReducer from '@/js/redux/reducers/collections/createCollectionsReducer';

const CollectionsListReducer = (state, action) => createCollectionsReducer(state, action);

export default CollectionsListReducer;

// import { createHandlers, createReducer } from '../handler';
//
// const initialState = {
//   loadCollectionsInProcess: false,
//   loadCollectionsFromApi: false,
//   collectionsList: [],
//   pageSettings: {
//     // page: {
//     //   size: 25,
//     // },
//   },
//
//   sortQuery: {},
//   filtersSelected: {},
//   filtersApplied: {},
//   filterApplied: false,
// };
//
// const handlers = createHandlers({
//   [CollectionsActionsConstants.LOAD_COLLECTIONS_IN_PROCESS]: (state, { loadCollectionsInProcess = false }) => ({
//     ...state,
//     loadCollectionsInProcess,
//   }),
//   [CollectionsActionsConstants.LOAD_COLLECTIONS_SUCCESS]: (state, { collectionsList = [], pageSettings = {} }) => ({
//     ...state,
//     collectionsList,
//     loadCollectionsInProcess: false,
//     loadCollectionsFromApi: true,
//     pageSettings,
//   }),
// });
//
// const CollectionsReducer = (state = initialState, action) => createReducer(state, action, handlers);
//
// export default CollectionsReducer;
