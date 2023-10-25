import axios from 'axios';
import qs from 'qs';

import api from '@/api';
import { WantedActionsConstants } from '@/constants/actions/wanted';
import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';
import ReduxStoreService from '@/services/ReduxStoreService';
import { getFilterQueryUtil } from '@/utils/sort-and-filter/sortAndFilterQueryUtils';

import createAction from '../actionCreator';
import { getSortAndFiltersRequestAction } from '../sort-and-filter/sortAndFiltersActions';

export const selectWantedFilterAction = ({ categoryId, selected, multi, beforeResetCategory, beforeResetCategoryNow }) =>
  createAction(WantedActionsConstants.WANTED_FILTER_SELECT, {
    categoryId,
    selected,
    multi,
    beforeResetCategory,
    beforeResetCategoryNow,
  });

export const applyWantedFilterAction = () => createAction(WantedActionsConstants.WANTED_FILTER_APPLY);

const loadWantedInProcessAction = (loadWantedInProcess) =>
  createAction(WantedActionsConstants.LOAD_WANTED_IN_PROCESS, {
    loadWantedInProcess,
  });

const loadWantedSuccessAction = ({ wantedList, pageSettings }) =>
  createAction(WantedActionsConstants.LOAD_WANTED_SUCCESS, {
    wantedList,
    pageSettings,
  });

let cancelTokenLoadWantedRequest;
export const loadWantedRequestAction = ({
  searchQuery,
  pageSize,
  pageNumber,
  pageFilters,
  updateSortAndFilters,
  withInProcess = true,
  useCustomResponseHandler,

  dispatch,
}) =>
  new Promise((resolve) => {
    if (cancelTokenLoadWantedRequest) {
      cancelTokenLoadWantedRequest.cancel();
    }

    cancelTokenLoadWantedRequest = axios.CancelToken.source();

    const { store } = ReduxStoreService.getInstance();

    const {
      filtersApplied = {},
      searchQuery: searchQueryStore,
      pageSettings: { page: { currentNumber: page, size } = {} } = {},
    } = store.getState().WantedReducer;

    let query;
    if (searchQuery) {
      query = searchQuery;
    }
    if (searchQueryStore) {
      query = searchQueryStore;
    }

    const { sortAndFilters: { filter: { filters = [] } = {} } = {} } = store.getState().WantedSortAndFiltersReducer;
    const filtersQuery = pageFilters || getFilterQueryUtil({ filters, filtersApplied });

    if (updateSortAndFilters) {
      getSortAndFiltersRequestAction({
        location: SortAndFiltersLocationsConstants.SYSTEM_WANT_LIST_ITEMS,
        query: filtersQuery,
        dispatch,
      }).then();
    }

    if (withInProcess) {
      dispatch(loadWantedInProcessAction(true));
    }

    api
      .get('wanted-items', {
        params: {
          size: pageSize || size,
          page: pageNumber || pageNumber === 0 ? pageNumber : page,
          query,
          ...filtersQuery,
        },

        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: responseData = [], payload: responsePayload = {} } = {} }) => {
        if (useCustomResponseHandler) {
          resolve({ responseData, payload: responsePayload });
          return;
        }

        dispatch(
          loadWantedSuccessAction({
            wantedList: responseData,
            pageSettings: responsePayload,
          })
        );

        resolve();
      })
      .catch(() => {
        dispatch(loadWantedInProcessAction(false));

        resolve();
      });
  });
