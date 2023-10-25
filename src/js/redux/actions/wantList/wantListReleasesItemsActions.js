import axios from 'axios';
import qs from 'qs';

import api from '@/api';
import { WantListReleasesItemsActionsConstants } from '@/constants/actions/wantlist/wantListReleasesItems';
import { CommonVariablesConstants } from '@/constants/common/variables';
import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';
import { setQueryPageParamsUtil } from '@/utils/routeUtils';
import { getFilterQueryUtil, getSortQueryUtil } from '@/utils/sort-and-filter/sortAndFilterQueryUtils';

import createAction from '../actionCreator';
import { getSortAndFiltersRequestAction } from '../sort-and-filter/sortAndFiltersActions';

export const resetWantListReleasesItemsAction = () =>
  createAction(WantListReleasesItemsActionsConstants.RESET_WANTLIST_RELEASE_ITEMS);

export const searchWantListReleasesItemsAction = (searchQuery) =>
  createAction(WantListReleasesItemsActionsConstants.SEARCH_WANTLIST_RELEASE_ITEMS, {
    searchQuery,
  });

const getWantListReleasesItemInProcessAction = (getWantListReleasesItemInProcess) =>
  createAction(WantListReleasesItemsActionsConstants.GET_WANTLIST_RELEASES_ITEM_IN_PROCESS, {
    getWantListReleasesItemInProcess,
  });

const getWantListReleasesItemSuccessAction = ({ wantlistReleasesItem }) =>
  createAction(WantListReleasesItemsActionsConstants.GET_WANTLIST_RELEASES_ITEM_SUCCESS, {
    wantlistReleasesItem,
  });

export const getWantListReleasesItemRequestAction =
  ({ wantlistReleasesItemId }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(getWantListReleasesItemInProcessAction(true));

      api
        .get(`personal/wantlist/release-items/${wantlistReleasesItemId}`)
        .then(({ data: { data: responseData = {} } = {} }) => {
          dispatch(
            getWantListReleasesItemSuccessAction({
              wantlistReleasesItem: responseData,
            })
          );

          resolve();
        })
        .catch((error) => {
          console.error(error);

          const errorData = extractErrorDataFromResponseApiUtil(error);

          dispatch(getWantListReleasesItemInProcessAction(false));
          reject(errorData);
        });
    });

const loadWantListReleasesItemsInProcessAction = (loadWantListReleasesItemsInProcess) =>
  createAction(WantListReleasesItemsActionsConstants.LOAD_WANTLIST_RELEASES_ITEMS_IN_PROCESS, {
    loadWantListReleasesItemsInProcess,
  });

const loadWantListReleasesItemsSuccessAction = ({ wantlistReleasesItems, wantlistReleasesItemsPageSettings }) =>
  createAction(WantListReleasesItemsActionsConstants.LOAD_WANTLIST_RELEASES_ITEMS_SUCCESS, {
    wantlistReleasesItems,
    wantlistReleasesItemsPageSettings,
  });

let cancelTokenLoadWantListReleasesItemsRequest;
export const loadWantListReleasesItemsRequestAction =
  ({ searchQuery, cookie, pageSize, pageNumber, pageFilters, pageSort }) =>
  (dispatch) =>
    new Promise((resolve) => {
      if (cancelTokenLoadWantListReleasesItemsRequest) {
        cancelTokenLoadWantListReleasesItemsRequest.cancel();
      }

      cancelTokenLoadWantListReleasesItemsRequest = axios.CancelToken.source();

      const { store } = ReduxStoreService.getInstance();

      const {
        sortQuery: sortSelected = {},
        filtersApplied = {},
        searchQuery: searchQueryStore,
        wantlistReleasesItemsPageSettings: { page: { currentNumber: page, size } = {} } = {},
      } = store.getState().WantListReleasesItemsReducer;

      let sortQueryNew = {};

      Object.keys(sortSelected).forEach((sortKey) => {
        const sortSelectedItem = sortSelected[sortKey];

        const { value: queryParam } = sortSelectedItem;

        sortQueryNew = {
          ...sortQueryNew,
          sort: sortSelected.sort ? [...sortQueryNew.sort, queryParam] : [queryParam],
        };
      });

      let query;

      if (searchQuery) {
        query = searchQuery;
      }

      if (searchQueryStore) {
        query = searchQueryStore;
      }

      const { sortAndFilters: { filter: { filters = [] } = {} } = {} } =
        store.getState().WantListReleasesItemsSortAndFiltersReducer;
      const filtersQuery = pageFilters || getFilterQueryUtil({ filters, filtersApplied });
      const sortQuery = pageSort || getSortQueryUtil({ sortSelected });

      dispatch(loadWantListReleasesItemsInProcessAction(true));

      getSortAndFiltersRequestAction({
        cookie,
        location: SortAndFiltersLocationsConstants.WANT_LIST_ITEMS,
        query: filtersQuery,
        dispatch,
      });

      api
        .get('personal/wantlist/release-items', {
          headers: cookie
            ? {
                [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
              }
            : undefined,
          params: {
            size: pageSize || size,
            page: pageNumber || pageNumber === 0 ? pageNumber : page,
            query,
            ...filtersQuery,
            ...sortQueryNew,
          },

          paramsSerializer(params) {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          },
        })
        .then(({ data: { data: responseData = {}, payload: responsePayload = {} } = {} }) => {
          setQueryPageParamsUtil({
            filtersQuery,
            sortQuery,
            pageSize: pageSize || size,
            pageNumber: pageNumber || page,
          });

          dispatch(
            loadWantListReleasesItemsSuccessAction({
              wantlistReleasesItems: responseData,
              wantlistReleasesItemsPageSettings: responsePayload,
            })
          );

          resolve();
        })
        .catch(() => {
          dispatch(loadWantListReleasesItemsInProcessAction(false));

          resolve();
        });
    });

export const setWantListReleasesItemsSortSelectedAction = (sortQuery) => (dispatch) => {
  dispatch({
    type: WantListReleasesItemsActionsConstants.WANT_LIST_RELEASES_ITEMS_SORT_SELECT,
    payload: {
      sortQuery,
    },
  });
};

export const selectWantListReleasesItemsFilterAction =
  ({ categoryId, selected, multi, beforeResetCategory }) =>
  (dispatch) => {
    dispatch({
      type: WantListReleasesItemsActionsConstants.WANT_LIST_RELEASES_ITEMS_FILTER_SELECT,
      payload: {
        categoryId,
        selected,
        multi,
        beforeResetCategory,
      },
    });
  };

export const applyWantListReleasesItemsFilterAction = () => (dispatch) => {
  dispatch({
    type: WantListReleasesItemsActionsConstants.WANT_LIST_RELEASES_ITEMS_FILTER_APPLY,
  });
};
