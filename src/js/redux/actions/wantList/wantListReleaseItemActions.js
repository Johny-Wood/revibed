import qs from 'qs';

import api from '@/api';
import { WantListReleaseItemActionsConstants } from '@/constants/actions/wantlist/wantListReleaseItem';
import { CommonVariablesConstants } from '@/constants/common/variables';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';

import createAction from '../actionCreator';

export const removeWatchWantListReleaseItemAction = (releaseId) =>
  createAction(WantListReleaseItemActionsConstants.REMOVE_WATCH_WANTLIST_RELEASE_ITEM, {
    releaseId,
  });

export const addWatchWantListReleaseItemAction = (releaseId) =>
  createAction(WantListReleaseItemActionsConstants.ADD_WATCH_WANTLIST_RELEASE_ITEM, {
    releaseId,
  });

export const toggleIsAddReleaseItemAction = ({ releaseIds = [], isAdded, wantItemsInfo }) =>
  createAction(WantListReleaseItemActionsConstants.TOGGLE_IS_ADD_RELEASE_ITEM, {
    releaseIds,
    isAdded,
    wantItemsInfo,
  });

const getWantListReleaseItemInProcessAction = (getWantListReleaseItemInProcess) =>
  createAction(WantListReleaseItemActionsConstants.GET_WANTLIST_RELEASE_ITEM_IN_PROCESS, {
    getWantListReleaseItemInProcess,
  });

const getWantListReleaseItemSuccessAction = ({ wantlistReleaseItem, releaseId }) =>
  createAction(WantListReleaseItemActionsConstants.GET_WANTLIST_RELEASE_ITEM_SUCCESS, {
    wantlistReleaseItem,
    releaseId,
  });

export const getWantListReleaseItemRequestAction =
  ({ cookie, releaseId }) =>
  (dispatch) =>
    new Promise((resolve) => {
      dispatch(getWantListReleaseItemInProcessAction(true));

      api
        .get(`releases/${releaseId}`, {
          headers: cookie
            ? {
                [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
              }
            : undefined,
        })
        .then(({ data: { data: responseData = {} } = {} }) => {
          dispatch(
            getWantListReleaseItemSuccessAction({
              wantlistReleaseItem: responseData,
              releaseId,
            })
          );

          resolve();
        })
        .catch((error) => {
          console.error(error);

          dispatch(getWantListReleaseItemInProcessAction(false));

          resolve();
        });
    });

export const clearWantListReleaseItemsAction = () => createAction(WantListReleaseItemActionsConstants.CLEAR_RELEASE_ITEMS);

export const updateReleaseItemsAvailableAction = ({ releaseId, itemsAvailable }) =>
  createAction(WantListReleaseItemActionsConstants.UPDATE_RELEASE_ITEMS_AVAILABLE, {
    releaseId,
    itemsAvailable,
  });

const loadWantListReleaseItemsInProcessAction = (loadWantListReleaseItemsInProcess) =>
  createAction(WantListReleaseItemActionsConstants.LOAD_WANTLIST_RELEASE_ITEMS_IN_PROCESS, {
    loadWantListReleaseItemsInProcess,
  });

const loadWantListReleaseItemsSuccessAction = ({ wantlistReleaseItems, wantlistReleaseItemsPageSettings }) =>
  createAction(WantListReleaseItemActionsConstants.LOAD_WANTLIST_RELEASE_ITEMS_SUCCESS, {
    wantlistReleaseItems,
    wantlistReleaseItemsPageSettings,
  });

export const loadWantListReleaseItemsRequestAction =
  ({ wantlistReleaseItemId, page, size, type, parseNow }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      const { store } = ReduxStoreService.getInstance();

      const { wantlistReleaseItemsPageSettings: { page: { currentNumber: pageNumber, size: pageSize } = {} } = {} } =
        store.getState().WantListReleaseItemReducer;

      dispatch(loadWantListReleaseItemsInProcessAction(true));

      api
        .get(`releases/${wantlistReleaseItemId}/items`, {
          params: {
            type,
            parseNow,
            size: size || pageSize,
            page: page || page === 0 ? page : pageNumber,
          },
          paramsSerializer(params) {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          },
        })
        .then(({ data: { data: responseData = {}, payload: responsePayload = {} } = {} }) => {
          dispatch(
            loadWantListReleaseItemsSuccessAction({
              wantlistReleaseItems: responseData,
              wantlistReleaseItemsPageSettings: responsePayload,
            })
          );

          resolve();
        })
        .catch((error) => {
          console.error(error);

          const errorData = extractErrorDataFromResponseApiUtil(error);

          dispatch(loadWantListReleaseItemsInProcessAction(false));
          reject(errorData);
        });
    });
