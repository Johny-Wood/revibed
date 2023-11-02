import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import qs from 'qs';

import api from '@/api';
import { MarketplaceListActionsConstants } from '@/constants/actions/marketplace/marketplaceList';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import { MarketplaceReducersConstants } from '@/constants/marketplace/reducers';
import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';
import { getSortAndFiltersRequestAction } from '@/redux-actions/sort-and-filter/sortAndFiltersActions';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';
import { getFilterQueryUtil, getSortQueryUtil } from '@/utils/sort-and-filter/sortAndFilterQueryUtils';

import createAction from '../actionCreator';

export const setMarketplacePreviewPurchasedAction = ({ location, goods }) =>
  createAction(`${location}_${MarketplaceListActionsConstants.SET_MARKETPLACE_PREVIEW_PURCHASED}`, {
    goods,
  });

export const toggleMarketplacePreviewAlbumToCartAction = ({ location, cardId, inCart }) =>
  createAction(`${location}_${MarketplaceListActionsConstants.TOGGLE_MARKETPLACE_PREVIEW_ALBUM_TO_CART}`, {
    cardId,
    inCart,
  });

const getMarketplaceListInProcessAction = ({ location, getMarketplaceListInProcess }) =>
  createAction(`${location}_${MarketplaceListActionsConstants.GET_MARKETPLACE_LIST_IN_PROCESS}`, {
    getMarketplaceListInProcess,
  });

const getMarketplaceListSuccessAction = ({ location, marketplaceList, pageSettings }) =>
  createAction(`${location}_${MarketplaceListActionsConstants.GET_MARKETPLACE_LIST_SUCCESS}`, {
    marketplaceList,
    pageSettings,
  });

let getMarketplaceListRequestActionCancelToken;

export const getMarketplaceListRequestAction = ({
  withCancel = true,
  location,
  pageSize,
  pageNumber,
  pageFilters,
  querySearch,
  pageSort,
  withInProcess = true,
  withFilters = true,
  withSort = true,
  useCustomResponseHandler = false,
  updateSortAndFilters,
  cookie,
  dispatch,
}) =>
  new Promise((resolve) => {
    if (withCancel) {
      if (getMarketplaceListRequestActionCancelToken) {
        getMarketplaceListRequestActionCancelToken.cancel();
      }

      getMarketplaceListRequestActionCancelToken = axios.CancelToken.source();
    }

    const { store } = ReduxStoreService.getInstance();

    if (withInProcess) {
      dispatch(
        getMarketplaceListInProcessAction({
          location,
          getMarketplaceListInProcess: true,
        })
      );
    }

    const {
      MarketplaceListReducer: { search } = {},
      MarketplaceSortAndFiltersReducer: { sortAndFilters: { filter: { filters = [] } = {} } = {} } = {},
    } = store.getState();

    const {
      filtersApplied = {},
      sortSelected,
      pageSettings: { currentNumber: page = 0, size = 25 } = {},
    } = store.getState()[MarketplaceReducersConstants[location]] ?? {};

    const localPageSize = pageSize || size;

    const sortQuery = !isEmpty(pageSort?.sort) ? pageSort : getSortQueryUtil({ sortSelected });

    const filtersQuery = !isEmpty(pageFilters)
      ? pageFilters
      : getFilterQueryUtil({
          filters,
          filtersApplied,
        });

    api
      .get('goods', {
        cancelToken: withCancel ? getMarketplaceListRequestActionCancelToken.token : undefined,
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
        params: {
          size: location !== MarketplaceLocationsConstants.MARKETPLACE ? 8 * 5 : localPageSize,
          page: pageNumber >= 0 ? pageNumber : page,
          ...{ query: location === MarketplaceLocationsConstants.MARKETPLACE ? querySearch || search || undefined : undefined },
          ...(withFilters ? filtersQuery : {}),
          ...(withSort ? sortQuery : {}),
        },
        paramsSerializer(params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      })
      .then(({ data: { data: marketplaceList = [], payload, payload: { page: pageSettings = {}, sort = [] } = {} } = {} }) => {
        if (useCustomResponseHandler) {
          resolve({
            responseData: marketplaceList,
            payload,
          });
          return;
        }

        dispatch(
          getMarketplaceListSuccessAction({
            location,
            marketplaceList,
            pageSettings,
          })
        );

        if (updateSortAndFilters) {
          getSortAndFiltersRequestAction({
            cookie,
            location: SortAndFiltersLocationsConstants.MARKETPLACE,
            query: filtersQuery,
            dispatch,
          }).then(() => {
            resolve({
              sortSelected: sort,
              length: marketplaceList.length,
            });
          });
        } else {
          resolve({
            sortSelected: sort,
            length: marketplaceList.length,
          });
        }
      })
      .catch((error) => {
        console.error(error);

        dispatch(
          getMarketplaceListInProcessAction({
            location,
            getMarketplaceListInProcess: axios.isCancel(error),
          })
        );

        const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

        resolve(errorData);
      });
  });

export const selectMarketplaceFilterAction = ({
  location,
  categoryId,
  selected,
  multi,
  beforeResetCategory,
  beforeResetCategoryNow,
}) =>
  createAction(`${location}_${MarketplaceListActionsConstants.MARKETPLACE_FILTER_SELECT}`, {
    categoryId,
    selected,
    multi,
    beforeResetCategory,
    beforeResetCategoryNow,
  });

export const applyMarketplaceFilterAction = (location) =>
  createAction(`${location}_${MarketplaceListActionsConstants.MARKETPLACE_FILTER_APPLY}`);

export const setMarketplaceSortSelectedAction = (categoryId, selected, location) => (dispatch) => {
  dispatch({
    type: `${location}_${MarketplaceListActionsConstants.SORT_SELECT}`,
    payload: {
      categoryId,
      selected,
    },
  });
};

export const resetMarketplaceCurrentParamsAction = ({ location }) =>
  createAction(`${location}_${MarketplaceListActionsConstants.RESET_MARKETPLACE_CURRENT_PARAMS}`);

export const setMarketplaceSearchAction = ({ location, search }) =>
  createAction(`${location}_${MarketplaceListActionsConstants.MARKETPLACE_SEARCH}`, { search });
