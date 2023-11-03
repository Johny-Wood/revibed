import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import qs from 'qs';

import api from '@/api';
import { CollectionsActionsConstants } from '@/constants/actions/collections/collections';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import { MarketplaceReducersConstants } from '@/constants/marketplace/reducers';
import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';
import { getSortAndFiltersRequestAction } from '@/redux-actions/sort-and-filter/sortAndFiltersActions';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';
import { getFilterQueryUtil, getSortQueryUtil } from '@/utils/sort-and-filter/sortAndFilterQueryUtils';

import createAction from '../actionCreator';

// export const setMarketplacePreviewPurchasedAction = ({ location, goods }) =>
//   createAction(`${location}_${CollectionsActionsConstants.SET_MARKETPLACE_PREVIEW_PURCHASED}`, {
//     goods,
//   });
//
// export const toggleMarketplacePreviewAlbumToCartAction = ({ location, cardId, inCart }) =>
//   createAction(`${location}_${CollectionsActionsConstants.TOGGLE_MARKETPLACE_PREVIEW_ALBUM_TO_CART}`, {
//     cardId,
//     inCart,
//   });

const getCollectionsListInProcessAction = ({ getCollectionsListInProcess }) =>
  createAction(`${CollectionsActionsConstants.GET_COLLECTIONS_IN_PROCESS}`, {
    getCollectionsListInProcess,
  });

const getCollectionsListSuccessAction = ({ collectionsList, pageSettings }) =>
  createAction(`${CollectionsActionsConstants.GET_COLLECTIONS_SUCCESS}`, {
    collectionsList,
    pageSettings,
  });

let getCollectionsListRequestActionCancelToken;

export const getCollectionsListRequestAction = ({
  withCancel = true,
  // location,
  // pageSize,
  // pageNumber,
  // pageFilters,
  // querySearch,
  // pageSort,
  withInProcess = true,
  // withFilters = true,
  // withSort = true,
  useCustomResponseHandler = false,
  // updateSortAndFilters,
  // cookie,
  dispatch,
}) =>
  new Promise((resolve) => {
    if (withCancel) {
      if (getCollectionsListRequestActionCancelToken) {
        getCollectionsListRequestActionCancelToken.cancel();
      }

      getCollectionsListRequestActionCancelToken = axios.CancelToken.source();
    }

    console.log("hello")
    const { store } = ReduxStoreService.getInstance();

    if (withInProcess) {
      dispatch(
        getCollectionsListInProcessAction({
          getCollectionsListInProcess: true,
        })
      );
    }

    // const {
    //   CollectionsListReducer: { search } = {},
    //   // MarketplaceSortAndFiltersReducer: { sortAndFilters: { filter: { filters = [] } = {} } = {} } = {},
    // } = store.getState();

    // const {
    //   // filtersApplied = {},
    //   // sortSelected,
    //   // pageSettings: { currentNumber: page = 0, size = 25 } = {},
    // } = store.getState().CollectionsListReducer;

    // const localPageSize = pageSize || size;

    // const sortQuery = !isEmpty(pageSort?.sort) ? pageSort : getSortQueryUtil({ sortSelected });

    // const filtersQuery = !isEmpty(pageFilters)
    //   ? pageFilters
    //   : getFilterQueryUtil({
    //       filters,
    //       filtersApplied,
    //     });

    api
      .get('collections', {
        baseURL: "https://new-kollektive.undv.ru/api/"
        // cancelToken: withCancel ? getCollectionsListRequestActionCancelToken.token : undefined,
        // headers: cookie
        //   ? {
        //       [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
        //     }
        //   : undefined,
        // params: {
        //   size: location !== MarketplaceLocationsConstants.MARKETPLACE ? 8 * 5 : localPageSize,
        //   page: pageNumber >= 0 ? pageNumber : page,
        //   ...{ query: location === MarketplaceLocationsConstants.MARKETPLACE ? querySearch || search || undefined : undefined },
        //   ...(withFilters ? filtersQuery : {}),
        //   ...(withSort ? sortQuery : {}),
        // },
        // paramsSerializer(params) {
        //   return qs.stringify(params, { arrayFormat: 'repeat' });
        // },
      })
      // .then((e) => console.log(e))
      .then(({ data: { data: collectionsList = [], payload, payload: { page: pageSettings = {}} = {} } = {} }) => {
        if (useCustomResponseHandler) {
          resolve({
            responseData: collectionsList,
            payload,
          });
          return;
        }

        dispatch(
          getCollectionsListSuccessAction({
            collectionsList,
            pageSettings,
          })
        );

        // if (updateSortAndFilters) {
        //   getSortAndFiltersRequestAction({
        //     cookie,
        //     location: SortAndFiltersLocationsConstants.MARKETPLACE,
        //     query: filtersQuery,
        //     dispatch,
        //   }).then(() => {
        //     resolve({
        //       sortSelected: sort,
        //       length: marketplaceList.length,
        //     });
        //   });
        // } else {
        resolve({
          // sortSelected: sort,
          length: collectionsList.length,
        });
        // }
      })
      .catch((error) => {
        console.error(error);

        dispatch(
          getCollectionsListInProcessAction({
            getCollectionsListInProcess: axios.isCancel(error),
          })
        );

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        resolve(errorData);
      });
  });

// export const selectMarketplaceFilterAction = ({
//   location,
//   categoryId,
//   selected,
//   multi,
//   beforeResetCategory,
//   beforeResetCategoryNow,
// }) =>
//   createAction(`${location}_${CollectionsActionsConstants.MARKETPLACE_FILTER_SELECT}`, {
//     categoryId,
//     selected,
//     multi,
//     beforeResetCategory,
//     beforeResetCategoryNow,
//   });
//
// export const applyMarketplaceFilterAction = (location) =>
//   createAction(`${location}_${CollectionsActionsConstants.MARKETPLACE_FILTER_APPLY}`);
//
// export const setMarketplaceSortSelectedAction = (categoryId, selected, location) => (dispatch) => {
//   dispatch({
//     type: `${location}_${CollectionsActionsConstants.SORT_SELECT}`,
//     payload: {
//       categoryId,
//       selected,
//     },
//   });
// };
//
// export const resetMarketplaceCurrentParamsAction = ({ location }) =>
//   createAction(`${location}_${CollectionsActionsConstants.RESET_MARKETPLACE_CURRENT_PARAMS}`);
//
// export const setMarketplaceSearchAction = ({ location, search }) =>
//   createAction(`${location}_${CollectionsActionsConstants.MARKETPLACE_SEARCH}`, { search });

// import axios from 'axios';
// // import qs from 'qs';
//
// import api from '@/api';
// import { CollectionsActionsConstants } from '@/constants/actions/collections/collections';
// // import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';
// import ReduxStoreService from '@/services/ReduxStoreService';
// // import { getFilterQueryUtil } from '@/utils/sort-and-filter/sortAndFilterQueryUtils';
//
// import createAction from '../actionCreator';
// // import { getSortAndFiltersRequestAction } from '../sort-and-filter/sortAndFiltersActions';
//
// // export const selectWantedFilterAction = ({ categoryId, selected, multi, beforeResetCategory, beforeResetCategoryNow }) =>
// //   createAction(WantedActionsConstants.WANTED_FILTER_SELECT, {
// //     categoryId,
// //     selected,
// //     multi,
// //     beforeResetCategory,
// //     beforeResetCategoryNow,
// //   });
// //
// // export const applyWantedFilterAction = () => createAction(WantedActionsConstants.WANTED_FILTER_APPLY);
//
// const loadCollectionsInProcessAction = (loadCollectionsInProcess) =>
//   createAction(CollectionsActionsConstants.LOAD_COLLECTIONS_IN_PROCESS, {
//     loadCollectionsInProcess,
//   });
//
// const loadCollectionsSuccessAction = ({ collectionsList, pageSettings }) =>
//   createAction(CollectionsActionsConstants.LOAD_COLLECTIONS_SUCCESS, {
//     collectionsList,
//     pageSettings,
//   });
//
// let cancelTokenLoadCollectionsRequest;
// export const loadCollectionsRequestAction = ({
//   searchQuery,
//   pageSize,
//   pageNumber,
//   pageFilters,
//   updateSortAndFilters,
//   withInProcess = true,
//   useCustomResponseHandler,
//
//   dispatch,
// }) =>
//   new Promise((resolve) => {
//     if (cancelTokenLoadCollectionsRequest) {
//       cancelTokenLoadCollectionsRequest.cancel();
//     }
//
//     cancelTokenLoadCollectionsRequest = axios.CancelToken.source();
//
//     const { store } = ReduxStoreService.getInstance();
//
//     const {
//       filtersApplied = {},
//       searchQuery: searchQueryStore,
//       pageSettings: { page: { currentNumber: page, size } = {} } = {},
//     } = store.getState().CollectionsReducer;
//
//     let query;
//     if (searchQuery) {
//       query = searchQuery;
//     }
//     if (searchQueryStore) {
//       query = searchQueryStore;
//     }
//
//     // const { sortAndFilters: { filter: { filters = [] } = {} } = {} } = store.getState().WantedSortAndFiltersReducer;
//     // const filtersQuery = pageFilters || getFilterQueryUtil({ filters, filtersApplied });
//     //
//     // if (updateSortAndFilters) {
//     //   getSortAndFiltersRequestAction({
//     //     location: SortAndFiltersLocationsConstants.SYSTEM_WANT_LIST_ITEMS,
//     //     query: filtersQuery,
//     //     dispatch,
//     //   }).then();
//     // }
//     //
//     // if (withInProcess) {
//     //   dispatch(loadWantedInProcessAction(true));
//     // }
//
//     api
//       .get('goods', {
//         // params: {
//         //   size: pageSize || size,
//         //   page: pageNumber || pageNumber === 0 ? pageNumber : page,
//         //   query,
//         //   ...filtersQuery,
//         // },
//         // paramsSerializer(params) {
//         //   return qs.stringify(params, { arrayFormat: 'repeat' });
//         // },
//       })
//       .then(({ data: { data: responseData = [], payload: responsePayload = {} } = {} }) => {
//         if (useCustomResponseHandler) {
//           resolve({ responseData, payload: responsePayload });
//           return;
//         }
//
//         dispatch(
//           loadCollectionsSuccessAction({
//             collectionsList: responseData,
//             pageSettings: responsePayload,
//           })
//         );
//
//         resolve();
//       })
//       .catch(() => {
//         dispatch(loadCollectionsInProcessAction(false));
//
//         resolve();
//       });
//   });
