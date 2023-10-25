import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import qs from 'qs';

import api from '@/api';
import { ProjectsActionsConstants } from '@/constants/actions/projects/projects';
import { CommonVariablesConstants } from '@/constants/common/variables';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ProjectsReducersMapConstants } from '@/constants/projects/reducersMap';
import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';
import ReduxStoreService from '@/services/ReduxStoreService';
import { extractErrorDataFromResponseApiUtil } from '@/utils/apiUtils';
import { subscribeProjectUtil, unsubscribeProjectUtil } from '@/utils/project/projectsWebsocketUtil';
import { getFilterQueryUtil, getSortQueryUtil } from '@/utils/sort-and-filter/sortAndFilterQueryUtils';

import createAction from '../actionCreator';
import { getSortAndFiltersRequestAction } from '../sort-and-filter/sortAndFiltersActions';

export const updateProjectsAction = ({
  location,
  projects,
  pageSettings,
  filtersApplied,
  filtersSelected,
  loadedProjectsFromApi,
}) =>
  createAction(`${location}_${ProjectsActionsConstants.PROJECTS_UPDATE}`, {
    projects,
    pageSettings,
    filtersApplied,
    filtersSelected,
    loadedProjectsFromApi,
  });

const getProjectsInProcessAction = (location, getProjectsInProcess) =>
  createAction(`${location}_${ProjectsActionsConstants.GET_PROJECTS_IN_PROCESS}`, {
    getProjectsInProcess,
  });

const getProjectsSuccessAction = ({ location, ...params }) =>
  createAction(`${location}_${ProjectsActionsConstants.GET_PROJECTS_SUCCESS}`, {
    ...params,
  });

export const deleteFreeBonusSlotFromPreviewAction = ({ type, projectId, removeAll }) =>
  createAction(ProjectsActionsConstants.PROJECT_PREVIEW_DELETE_FREE_BONUS_SLOT, {
    type,
    projectId,
    removeAll,
  });

let getProjectsRequestActionCancelToken;

export const getProjectsRequestAction =
  ({
    location,
    userId,
    cookie,
    pageSize,
    pageNumber,
    pageFilters,
    pageSort,
    setProjectPosition,
    withInProcess = true,
    withFilters = true,
    withSort = true,
    updateSortAndFilters,
    useCustomResponseHandler = false,
    savePageSettings,
    querySearch,
  }) =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      if (getProjectsRequestActionCancelToken) {
        getProjectsRequestActionCancelToken.cancel();
      }

      getProjectsRequestActionCancelToken = axios.CancelToken.source();

      const { store } = ReduxStoreService.getInstance();

      if (withInProcess) {
        dispatch(getProjectsInProcessAction(location, true));
      }

      const {
        filtersApplied,
        sortSelected,
        pageSettings: { currentNumber: page = 0, size = 25 } = {},
      } = store.getState()[ProjectsReducersMapConstants[location]] || {};

      const localPageSize = pageSize || size;

      const {
        MarketplaceAndPreOrdersFiltersReducer: { search } = {},
        ProjectsSortAndFiltersReducer: { sortAndFilters: { filter: { filters = [] } = {} } = {} } = {},
      } = store.getState();

      const sortQuery = pageSort?.sort ? pageSort : getSortQueryUtil({ sortSelected });

      const filtersQuery = !isEmpty(pageFilters)
        ? pageFilters
        : getFilterQueryUtil({
            filters,
            filtersApplied,
          });

      if (location !== ProjectsLocationsConstants.NEW_ARRIVALS && location !== ProjectsLocationsConstants.LATE_ENTRY) {
        if (
          location !== ProjectsLocationsConstants.TRENDING &&
          location !== ProjectsLocationsConstants.FUNDING_NOW &&
          updateSortAndFilters
        ) {
          getSortAndFiltersRequestAction({
            cookie,
            location: SortAndFiltersLocationsConstants.PROJECTS,
            query: filtersQuery,
            dispatch,
          }).then();
        }
      }

      api
        .get('projects', {
          cancelToken: getProjectsRequestActionCancelToken.token,
          headers: cookie
            ? {
                [CommonVariablesConstants.AUTH_TOKEN_COOKIE_NAME]: cookie,
              }
            : undefined,
          params: {
            size: location === ProjectsLocationsConstants.NEW_ARRIVALS ? 24 : localPageSize,
            page: pageNumber >= 0 ? pageNumber : page,
            location,
            userId,
            ...{ query: location === ProjectsLocationsConstants.PROJECTS ? querySearch || search || undefined : undefined },
            ...(withFilters ? filtersQuery : {}),
            ...(withSort ? sortQuery : {}),
          },
          paramsSerializer(params) {
            return qs.stringify(params, { arrayFormat: 'repeat' });
          },
        })
        .then(({ data: { data: responseData = [], payload, payload: { page: pageSettings = {}, sort = [] } = {} } = {} }) => {
          if (useCustomResponseHandler) {
            resolve({ responseData, payload });
            return;
          }

          const projectsCurrentLocationPrev = cloneDeep(store.getState()[ProjectsReducersMapConstants[location]].projects).map(
            ({ id }) => id
          );

          const subscribeProjects = () => {
            responseData.forEach(({ id: projectId, status }) => {
              subscribeProjectUtil({ projectId, status });
            });
          };

          if (!useCustomResponseHandler && localPageSize !== 1) {
            unsubscribeProjectUtil({
              webSocketSubscriptionIds: projectsCurrentLocationPrev,
              unsubscribeCallback: subscribeProjects,
            });
          }

          dispatch(
            getProjectsSuccessAction({
              location,
              projects: responseData,
              pageSettings,
              setProjectPosition,
              savePageSettings,
            })
          );

          resolve({ sortSelected: sort });
        })
        .catch((error) => {
          console.error(error);

          dispatch(getProjectsInProcessAction(location, axios.isCancel(error)));

          const { data: errorData } = extractErrorDataFromResponseApiUtil(error);

          reject(errorData);
        });
    });

export const resetProjectsFiltersAndSortAction =
  ({ location }) =>
  (dispatch) => {
    dispatch({
      type: `${location}_${ProjectsActionsConstants.PROJECTS_RESET_FILTERS_AND_SORT}`,
    });
  };

export const selectProjectsFilterAction =
  ({ location, categoryId, selected, multi, beforeResetCategory, beforeResetCategoryNow }) =>
  (dispatch) => {
    dispatch({
      type: `${location}_${ProjectsActionsConstants.FILTER_SELECT}`,
      payload: {
        categoryId,
        selected,
        multi,
        beforeResetCategory,
        beforeResetCategoryNow,
      },
    });
  };

export const setProjectsSortSelectedAction = (location, categoryId, selected) => (dispatch) => {
  dispatch({
    type: `${location}_${ProjectsActionsConstants.SORT_SELECT}`,
    payload: {
      categoryId,
      selected,
    },
  });
};

export const applyProjectsFilterAction = (location) => (dispatch) => {
  dispatch({
    type: `${location}_${ProjectsActionsConstants.FILTER_APPLY}`,
  });
};

export const resetGetProjectsFromApiAction =
  (location, resetPageSettings = false) =>
  (dispatch) => {
    dispatch({
      type: `${location}_${ProjectsActionsConstants.RESET_GET_PROJECTS_FROM_API}`,
      payload: {
        resetPageSettings,
      },
    });
  };

export const projectsChangePreviewTypeAction = (location, previewType) => (dispatch) => {
  dispatch({
    type: `${location}_${ProjectsActionsConstants.CHANGE_PREVIEW_TYPE}`,
    payload: {
      previewType,
    },
  });
};

export const projectsUpdatePageSettingsAction =
  ({ location, filters, sort, size, page, filterApplied }) =>
  (dispatch) => {
    dispatch({
      type: `${location}_${ProjectsActionsConstants.UPDATE_PROJECTS_PAGE_SETTINGS}`,
      payload: {
        filters,
        sort,
        size,
        page,
        filterApplied,
      },
    });
  };

export const projectsUpdateProjectAction = ({ location, projectId, projectInfo }) =>
  createAction(`${location}_${ProjectsActionsConstants.UPDATE_PROJECTS_PROJECT}`, {
    projectId,
    projectInfo,
  });

export const changeProjectsCurrentPageAction = ({ location, currentNumber }) =>
  createAction(`${location}_${ProjectsActionsConstants.CHANGE_PROJECTS_CURRENT_PAGE}`, {
    currentNumber,
  });

export const resetProjectsCurrentParamsAction = ({ location }) =>
  createAction(`${location}_${ProjectsActionsConstants.RESET_PROJECTS_CURRENT_PARAMS}`);
