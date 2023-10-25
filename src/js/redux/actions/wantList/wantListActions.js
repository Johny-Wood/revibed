import axios from 'axios';
import qs from 'qs';

import api from '@/api';
import { WantListActionsConstants } from '@/constants/actions/wantlist/wantList';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { MessagesSuccessConstants } from '@/constants/messages/success';
import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import { PopupWantListIdsConstants } from '@/constants/popups/id';
import { RoutePathsConstants } from '@/constants/routes/routes';
import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';
import WantListImportStatusConstants from '@/constants/wantList/status';
import NextRouter from '@/services/NextRouter';
import ReduxStoreService from '@/services/ReduxStoreService';
import { analyticsWantListChangePlanPush, analyticsWantListImportPush } from '@/utils/analytics/analyticsPushers';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';
import { getFilterQueryUtil } from '@/utils/sort-and-filter/sortAndFilterQueryUtils';
import { textForLotsOfUtil } from '@/utils/textUtils';

import { toggleIsAddReleaseItemAction } from './wantListReleaseItemActions';
import { resetWantListReleasesItemsAction } from './wantListReleasesItemsActions';

import createAction from '../actionCreator';
import { showMessageAction } from '../components/messageActions';
import { closePopupAction } from '../components/popupActions';
import { deleteUnreadPersonalNotificationCountsEventSectionAction } from '../personal/personalNotificationCountsActions';
import { getSortAndFiltersRequestAction, resetSortAndFilterAction } from '../sort-and-filter/sortAndFiltersActions';

const changeWantListActiveReleasesCountAction = (activeReleasesNew = 0) =>
  createAction(WantListActionsConstants.CHANGE_WANT_LIST_ACTIVE_RELEASES_COUNT, {
    activeReleasesNew,
  });

const getWantListInfoInProcessAction = (getWantListInfoInProcess) =>
  createAction(WantListActionsConstants.GET_WANT_LIST_INFO_IN_PROCESS, {
    getWantListInfoInProcess,
  });

const getWantListInfoSuccessAction = (wantListInfo) =>
  createAction(WantListActionsConstants.GET_WANT_LIST_INFO_SUCCESS, {
    wantListInfo,
  });

export const getWantListInfoRequestAction =
  ({ cookie, changeStatus }) =>
  (dispatch) =>
    new Promise((resolve) => {
      dispatch(getWantListInfoInProcessAction(true));

      api
        .get('personal/wantlist/info', {
          headers: cookie
            ? {
                [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
              }
            : undefined,
        })
        .then(({ data: { data: responseData = {} } = {} }) => {
          const { status, totalReleases } = responseData;

          dispatch(getWantListInfoSuccessAction(responseData));

          if (changeStatus && status === WantListImportStatusConstants.ACTIVE) {
            const { router = {} } = NextRouter.getInstance();

            router.push(RoutePathsConstants.WANTLIST);

            dispatch(closePopupAction(PopupWantListIdsConstants.WantListImportSuccessPopup));
            dispatch(
              showMessageAction('SuccessMessage', {
                messageText: `${totalReleases} ${textForLotsOfUtil(totalReleases, ['item', 'items'])}${
                  MessagesSuccessConstants.WANT_LIST_ADD
                }`,
              })
            );
          }

          resolve(responseData);
        })
        .catch(() => {
          dispatch(getWantListInfoInProcessAction(false));

          resolve();
        });
    });

const importWantListInProcessAction = (importWantListInProcess) =>
  createAction(WantListActionsConstants.IMPORT_WANT_LIST_IN_PROCESS, {
    importWantListInProcess,
  });

const importWantListSuccessAction = (status) =>
  createAction(WantListActionsConstants.IMPORT_WANT_LIST_SUCCESS, {
    status,
  });

export const importWantListRequestAction =
  (formData, { importType: wantlistType }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(importWantListInProcessAction(true));

      api
        .post('personal/wantlist/import', formData)
        .then(({ data: { data: responseData = {}, payload: responsePayload = {} } = {} }) => {
          const { itemsCount: releaseQuantity } = responsePayload;
          dispatch(importWantListSuccessAction(responseData));
          dispatch(resetWantListReleasesItemsAction());
          dispatch(resetSortAndFilterAction(SortAndFiltersLocationsConstants.WANT_LIST_ITEMS));
          dispatch(resetSortAndFilterAction(SortAndFiltersLocationsConstants.WANT_LIST_RELEASES));
          dispatch(
            deleteUnreadPersonalNotificationCountsEventSectionAction({
              sections: [PersonalNotificationsSectionsConstants.WANT_LIST_RELEASES_ITEMS],
            })
          );

          analyticsWantListImportPush({
            wantlistType,
            releaseQuantity,
          });

          resolve(responsePayload);
        })
        .catch((error) => {
          console.error(error);

          const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

          dispatch(importWantListInProcessAction(false));
          reject(errorData);
        });
    });

const loadPlansWantListInProcessAction = (loadPlanWantListInProcess) =>
  createAction(WantListActionsConstants.LOAD_PLANS_WANT_LIST_IN_PROCESS, {
    loadPlanWantListInProcess,
  });

const loadPlansWantListSuccessAction = (plansWantList) =>
  createAction(WantListActionsConstants.LOAD_PLANS_WANT_LIST_SUCCESS, {
    plansWantList,
  });

export const loadPlansWantListRequestAction = (cookie) => (dispatch) =>
  new Promise((resolve) => {
    dispatch(loadPlansWantListInProcessAction(true));

    api
      .get('wantlist-plans', {
        headers: cookie
          ? {
              [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
            }
          : undefined,
      })
      .then(({ data: { data: responseData = {}, payload: responsePayload = {} } = {} }) => {
        dispatch(loadPlansWantListSuccessAction(responseData));

        resolve(responsePayload);
      })
      .catch(() => {
        dispatch(loadPlansWantListInProcessAction(false));
      });
  });

const changePlanWantListInProcessAction = (changePlanWantListInProcess) =>
  createAction(WantListActionsConstants.CHANGE_PLAN_WANT_LIST_IN_PROCESS, {
    changePlanWantListInProcess,
  });

const changePlanWantListSuccessAction = (wantListInfo) =>
  createAction(WantListActionsConstants.CHANGE_PLAN_WANT_LIST_SUCCESS, {
    wantListInfo,
  });

export const changePlanWantListRequestAction =
  (planId, { selectedPlanNew: { selectedPlanName, selectedPlanReleaseCount, selectedPlanSum } = {} }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(changePlanWantListInProcessAction(true));

      api
        .post('personal/wantlist/subscriptions', {
          planId,
        })
        .then(({ data: { data: responseData = {} } = {} }) => {
          dispatch(changePlanWantListSuccessAction(responseData));

          analyticsWantListChangePlanPush({
            planType: selectedPlanName,
            releaseQuantity: selectedPlanReleaseCount,
            planValue: selectedPlanSum,
          });

          resolve();
        })
        .catch((error) => {
          console.error(error);

          const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

          dispatch(changePlanWantListInProcessAction(false));

          reject(errorData);
        });
    });

const loadWantListInProcessAction = (loadWantListInProcess) =>
  createAction(WantListActionsConstants.LOAD_WANT_LIST_IN_PROCESS, {
    loadWantListInProcess,
  });

const loadWantListSuccessAction = (wantList, wantListPageSettings, size, page) => {
  const { store } = ReduxStoreService.getInstance();

  const { WantListReleasesSortAndFiltersReducer: { sortAndFilters: wantListSortAndFilter = {} } = {} } = store.getState();

  const { sort: wantListSort = [] } = wantListSortAndFilter;

  return createAction(WantListActionsConstants.LOAD_WANT_LIST_SUCCESS, {
    wantList,
    wantListPageSettings,
    size,
    page,
    wantListSort,
  });
};

export const searchWantListAction = (searchQuery) =>
  createAction(WantListActionsConstants.SEARCH_WANT_LIST, {
    searchQuery,
  });

let cancelTokenLoadWantListRequest;
export const loadWantListRequestAction =
  ({ searchQuery, cookie, pageSize, pageNumber, pageFilters }) =>
  (dispatch) =>
    new Promise((resolve) => {
      if (cancelTokenLoadWantListRequest) {
        cancelTokenLoadWantListRequest.cancel();
      }

      cancelTokenLoadWantListRequest = axios.CancelToken.source();

      dispatch(loadWantListInProcessAction(true));

      const { store } = ReduxStoreService.getInstance();

      const {
        sortQuery: sortSelected = {},
        filtersApplied = {},
        searchQuery: searchQueryStore,
        wantListPageSettings: { page: { size, currentNumber: page } = {} } = {},
      } = store.getState().WantListReducer;

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

      const { sortAndFilters: { filter: { filters = [] } = {} } = {} } = store.getState().WantListReleasesSortAndFiltersReducer;
      const filtersQuery = pageFilters || getFilterQueryUtil({ filters, filtersApplied });

      getSortAndFiltersRequestAction({
        cookie,
        location: SortAndFiltersLocationsConstants.WANT_LIST_RELEASES,
        query: filtersQuery,
        dispatch,
      });

      api
        .get('personal/wantlist', {
          cancelToken: cancelTokenLoadWantListRequest.token,
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
          dispatch(loadWantListSuccessAction(responseData, responsePayload, pageSize || size, pageNumber || page));

          resolve();
        })
        .catch((error) => {
          dispatch(loadWantListInProcessAction(axios.isCancel(error)));

          resolve();
        });
    });

const removeAllWantListInProcessAction = (removeAllWantListInProcess) =>
  createAction(WantListActionsConstants.REMOVE_ALL_WANT_LIST_IN_PROCESS, {
    removeAllWantListInProcess,
  });

const removeAllWantListSuccessAction = (wantListInfo) =>
  createAction(WantListActionsConstants.REMOVE_ALL_WANT_LIST_SUCCESS, {
    wantListInfo,
  });

export const removeAllWantListRequestAction = () => (dispatch) =>
  new Promise((resolve) => {
    dispatch(removeAllWantListInProcessAction(true));

    api
      .delete('personal/wantlist')
      .then(({ data: { data: responseData = {} } = {} }) => {
        dispatch(removeAllWantListSuccessAction(responseData));
        dispatch(resetWantListReleasesItemsAction());
        dispatch(resetSortAndFilterAction(SortAndFiltersLocationsConstants.WANT_LIST_ITEMS));
        dispatch(resetSortAndFilterAction(SortAndFiltersLocationsConstants.WANT_LIST_RELEASES));
        dispatch(
          deleteUnreadPersonalNotificationCountsEventSectionAction({
            sections: ['WANT_LIST_RELEASES_ITEMS'],
          })
        );

        resolve();
      })
      .catch(() => {
        dispatch(removeAllWantListInProcessAction(false));
      });
  });

export const selectWantListItemAction = ({ wantListRelease, isRemove }) =>
  createAction(WantListActionsConstants.SELECT_WANT_LIST_ITEM, {
    wantListRelease,
    isRemove,
  });

const removeWantListReleaseInProcessAction = (removeWantListReleaseInProcess) =>
  createAction(WantListActionsConstants.REMOVE_WANT_LIST_RELEASE_IN_PROCESS, {
    removeWantListReleaseInProcess,
  });

const removeWantListReleaseSuccessAction = (releaseIds) =>
  createAction(WantListActionsConstants.REMOVE_WANT_LIST_RELEASE_SUCCESS, {
    releaseIds,
  });

export const removeWantListReleaseRequestAction =
  ({ releaseIds, releases, syncWithDiscogs, activeReleasesCount = 0 }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(removeWantListReleaseInProcessAction(true));

      api
        .delete('personal/wantlist/items', {
          data: {
            releases,
            syncWithDiscogs,
          },
        })
        .then(({ data: { data: responseData = {} } = {} }) => {
          dispatch(removeWantListReleaseSuccessAction(responseData));
          dispatch(
            toggleIsAddReleaseItemAction({
              releaseIds,
              isAdded: false,
            })
          );

          dispatch(changeWantListActiveReleasesCountAction(-activeReleasesCount));

          resolve();
        })
        .catch(() => {
          dispatch(removeWantListReleaseInProcessAction(false));

          reject();
        });
    });

const addWantListReleaseInProcessAction = (addWantListReleaseInProcess) =>
  createAction(WantListActionsConstants.ADD_WANT_LIST_RELEASE_IN_PROCESS, {
    addWantListReleaseInProcess,
  });

const addWantListReleaseSuccessAction = () => createAction(WantListActionsConstants.ADD_WANT_LIST_RELEASE_SUCCESS);

export const addWantListReleaseRequestAction =
  ({ releases, releaseIds = [], syncWithDiscogs, addToWatch }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(addWantListReleaseInProcessAction(true));

      api
        .post('personal/wantlist/items', {
          releases,
          syncWithDiscogs,
          addToWatch,
        })
        .then(({ data: { payload: { wantItemsInfo } = {} } = {} }) => {
          if (releaseIds.length > 0) {
            dispatch(
              toggleIsAddReleaseItemAction({
                releaseIds,
                isAdded: true,
                wantItemsInfo,
              })
            );
          }

          dispatch(addWantListReleaseSuccessAction());

          resolve();
        })
        .catch(() => {
          dispatch(addWantListReleaseInProcessAction(false));

          reject();
        });
    });

const addWatchWantListReleaseInProcessAction = (addWatchWantListReleaseInProcess) =>
  createAction(WantListActionsConstants.ADD_WATCH_WANT_LIST_RELEASE_IN_PROCESS, {
    addWatchWantListReleaseInProcess,
  });

const addWatchWantListReleaseSuccessAction = (ids) =>
  createAction(WantListActionsConstants.ADD_WATCH_WANT_LIST_RELEASE_SUCCESS, {
    ids,
  });

const addWatchWantListReleaseFailedAction = () => createAction(WantListActionsConstants.ADD_WATCH_WANT_LIST_RELEASE_FAILED);

export const addWatchWantListReleaseRequestAction =
  (ids = []) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(addWatchWantListReleaseInProcessAction(true));

      api
        .put('personal/wantlist/watch', ids)
        .then(() => {
          dispatch(addWatchWantListReleaseSuccessAction(ids));

          dispatch(changeWantListActiveReleasesCountAction(ids.length));

          resolve();
        })
        .catch((error) => {
          console.error(error);

          const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

          dispatch(addWatchWantListReleaseFailedAction());

          reject(errorData);
        });
    });

const deleteWatchWantListReleaseInProcessAction = (deleteWatchWantListReleaseInProcess) =>
  createAction(WantListActionsConstants.DELETE_WATCH_WANT_LIST_RELEASE_IN_PROCESS, {
    deleteWatchWantListReleaseInProcess,
  });

const deleteWatchWantListReleaseSuccessAction = (ids) =>
  createAction(WantListActionsConstants.DELETE_WATCH_WANT_LIST_RELEASE_SUCCESS, {
    ids,
  });

export const deleteWatchWantListReleaseRequestAction =
  (ids = []) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      dispatch(deleteWatchWantListReleaseInProcessAction(true));

      api
        .delete('personal/wantlist/watch', {
          data: ids,
        })
        .then(() => {
          dispatch(deleteWatchWantListReleaseSuccessAction(ids));

          dispatch(changeWantListActiveReleasesCountAction(-ids.length));

          resolve();
        })
        .catch((error) => {
          console.error(error);

          const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

          dispatch(deleteWatchWantListReleaseInProcessAction(false));

          reject(errorData);
        });
    });

export const setWantListSortSelectedAction = (sortQuery) => (dispatch) => {
  dispatch({
    type: WantListActionsConstants.WANT_LIST_SORT_SELECT,
    payload: {
      sortQuery,
    },
  });
};

export const selectWantListFilterAction =
  ({ categoryId, selected, multi, beforeResetCategory }) =>
  (dispatch) => {
    dispatch({
      type: WantListActionsConstants.WANT_LIST_FILTER_SELECT,
      payload: {
        categoryId,
        selected,
        multi,
        beforeResetCategory,
      },
    });
  };

export const applyWantListFilterAction = () => (dispatch) => {
  dispatch({
    type: WantListActionsConstants.WANT_LIST_FILTER_APPLY,
  });
};
