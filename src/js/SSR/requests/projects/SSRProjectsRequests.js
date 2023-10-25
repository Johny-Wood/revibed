import isEmpty from 'lodash/isEmpty';

import { MessagesIdConstants } from '@/constants/messages/ids';
import { ProjectsFilterDestinationsConstants } from '@/constants/projects/filters/projectFilterDestinations';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { ProjectsNotificationLocationsConstants } from '@/constants/projects/notifications';
import { RoutePathsConstants } from '@/constants/routes/routes';
import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';
import { showMessageAction } from '@/redux-actions/components/messageActions';
import { changeSearchMarketplaceAndPreOrdersFiltersAction } from '@/redux-actions/marketplace-and-pre-orders/marketplaceAndPreOrdersFiltersActions';
import { getProjectCardRequestAction } from '@/redux-actions/project/projectCardActions';
import {
  applyProjectsFilterAction,
  getProjectsRequestAction,
  selectProjectsFilterAction,
  setProjectsSortSelectedAction,
} from '@/redux-actions/projects/projectsActions';
import { getSortAndFiltersRequestAction } from '@/redux-actions/sort-and-filter/sortAndFiltersActions';
import NextRouter from '@/services/NextRouter';
import ReduxStoreService from '@/services/ReduxStoreService';
import { getQueryPageParamsUtil } from '@/utils/routeUtils';
import {
  applyFiltersQueryUtil,
  applySortFromRequestUtil,
  applySortQueryUtil,
  getSelectedFiltersQueryUtil,
} from '@/utils/sort-and-filter/sortAndFilterQueryUtils';

const getProjects = async ({ getState, dispatch, refreshedToken, reducerName, location, query, userId, req, resolve }) => {
  const queryParams = getQueryPageParamsUtil({ query });

  const isWithoutQuery =
    location === ProjectsLocationsConstants.FUNDING_NOW ||
    location === ProjectsLocationsConstants.TRENDING ||
    location === ProjectsLocationsConstants.NEW_ARRIVALS ||
    location === ProjectsLocationsConstants.LATE_ENTRY;

  const { pageNumber = '0', pageFilters: pageFiltersFromUrl = {}, pageSort: { sort: sortQuery = [] } = {} } = queryParams;

  const {
    [reducerName]: { filtersApplied: filtersAppliedFromStore = {}, sortSelected: sortSelectedFromStore = {} } = {},
    ProjectsSortAndFiltersReducer: { sortAndFilters: { sort = [], filter: { filters = {} } = {} } = {} } = {},
    PersonalNotificationCountsReducer: { unreadEvents: [unreadEvents = {}] = [] } = {},
  } = getState();

  const { filterProperty: { pathName: unreadablePathName = '' } = {} } =
    filters[ProjectsFilterDestinationsConstants.UNREADABLE] || {};

  const pageQueryUnreadParam =
    ProjectsNotificationLocationsConstants.includes(location) &&
    !filtersAppliedFromStore[ProjectsFilterDestinationsConstants.UNREADABLE] &&
    !!unreadablePathName
      ? {
          [unreadablePathName.toLowerCase()]: `${!isEmpty(unreadEvents[location])}`,
        }
      : {};

  const filtersQueryForFirst = req
    ? {
        ...pageQueryUnreadParam,
        ...pageFiltersFromUrl,
      }
    : {
        ...pageQueryUnreadParam,
      };

  const { filtersQuery, selectedFilters } = getSelectedFiltersQueryUtil({
    filters,
    filtersQuery:
      isEmpty(pageFiltersFromUrl) && pageNumber === '0'
        ? filtersQueryForFirst
        : {
            ...pageFiltersFromUrl,
          },
  });

  const pageQueryParamsForFirst = req
    ? {
        ...queryParams,
        pageFilters: {
          ...pageFiltersFromUrl,
          ...filtersQuery,
        },
      }
    : {
        pageFilters: {
          ...filtersQuery,
        },
      };

  const pageQueryParams = !isWithoutQuery ? pageQueryParamsForFirst : {};

  if (!isWithoutQuery) {
    applySortQueryUtil({
      sort,
      sortQuery,
      dispatchAction: ({ name, sortPropertyItem }) => {
        dispatch(setProjectsSortSelectedAction(location, name, sortPropertyItem));
      },
    });

    applyFiltersQueryUtil({
      selectedFilters,
      filtersQuery: {
        ...filtersQuery,
      },
      dispatchAction: ({ categoryId, selected, multi }) => {
        dispatch(
          selectProjectsFilterAction({
            location,
            categoryId,
            selected: [selected],
            multi,
          })
        );
      },
      dispatchCallback: () => {
        dispatch(applyProjectsFilterAction(location));
      },
    });
  }

  const { sortSelected } = await getProjectsRequestAction({
    ...pageQueryParams,
    location,
    userId,
    updateSortAndFilters: !isWithoutQuery ? !isEmpty(pageQueryParams.pageFilters) : false,
    cookie: refreshedToken,
  })(dispatch);

  if (!isWithoutQuery) {
    applySortFromRequestUtil({
      sortSelected,
      sort,
      sortQuery,
      sortSelectedFromStore,
      dispatchAction: ({ name: name_1, sortPropertyItem: sortPropertyItem_1 }) => {
        dispatch(setProjectsSortSelectedAction(location, name_1, sortPropertyItem_1));
      },
    });
  }

  if (resolve) {
    resolve();
  }
};

export const SSRGetProjectsWithCookie = async ({ ctx, location, reducerName, withoutLoadedFromApi = false }) => {
  const { refreshedToken, query, req, store: { dispatch, getState } = {} } = ctx;

  const { userId } = query || {};
  const { pageFilters = {}, pageFilters: { query: querySearch = [] } = {} } = getQueryPageParamsUtil({ query });

  const { [reducerName]: { loadedProjectsFromApi } = {} } = getState();

  const withoutFilters =
    location === ProjectsLocationsConstants.FUNDING_NOW ||
    location === ProjectsLocationsConstants.TRENDING ||
    location === ProjectsLocationsConstants.NEW_ARRIVALS ||
    location === ProjectsLocationsConstants.LATE_ENTRY ||
    location === ProjectsLocationsConstants.LATE_ENTRY_FULL;

  if (req) {
    if (withoutFilters) {
      await getProjects({
        getState,
        dispatch,
        refreshedToken,
        reducerName,
        location,
        query,
        userId,
      });
    } else {
      await new Promise((resolve) => {
        if (querySearch.length > 0 && location === ProjectsLocationsConstants.PROJECTS) {
          dispatch(changeSearchMarketplaceAndPreOrdersFiltersAction({ search: querySearch[0] }));
        }

        getSortAndFiltersRequestAction({
          cookie: refreshedToken,
          location: SortAndFiltersLocationsConstants.PROJECTS,
          query: pageFilters,
          dispatch,
        }).then(() => {
          getProjects({
            getState,
            dispatch,
            refreshedToken,
            reducerName,
            location,
            query,
            userId,
            resolve,
          });
        });
      });
    }
  } else if (!loadedProjectsFromApi || withoutLoadedFromApi) {
    const { ProjectsSortAndFiltersReducer: { loadedSortAndFiltersFromApi, loadSortAndFiltersInProcess } = {} } = getState();

    if (!loadedSortAndFiltersFromApi && !loadSortAndFiltersInProcess && !withoutFilters) {
      getSortAndFiltersRequestAction({
        cookie: refreshedToken,
        location: SortAndFiltersLocationsConstants.PROJECTS,
        query: pageFilters,
        dispatch,
      }).then(() => {
        getProjects({
          getState,
          dispatch,
          refreshedToken,
          reducerName,
          location,
          query,
          userId,
        }).then();
      });
    } else {
      getProjects({
        getState,
        dispatch,
        refreshedToken,
        reducerName,
        location,
        query,
        userId,
      }).then();
    }
  }
};

export const SSRGetProjectCardWithCookie = async ({
  ctx,
  projectCardId,
  isEditRequest,
  location = RoutePathsConstants.PROJECTS,
}) => {
  const { store } = ReduxStoreService.getInstance();

  const { refreshedToken, store: { dispatch } = {}, req, res } = ctx;

  const { ProjectCardReducer: { projectCards = [] } = {} } = store.getState();

  const foundProjects = projectCards[0] || {};
  const foundProject = foundProjects[projectCardId];

  const redirectFromProject = () => {
    if (req) {
      res.statusCode = 302;
      res.setHeader('Location', `${location}/?show-error=${MessagesIdConstants.ProjectNoAccessMessage}`);
      res.end();
    } else {
      const { router = {} } = NextRouter.getInstance();
      router.push(location);
    }

    store.dispatch(showMessageAction(MessagesIdConstants.ProjectNoAccessMessage));
  };

  if (req) {
    await getProjectCardRequestAction(
      {
        projectCardId,
        isEditRequest,
      },
      refreshedToken
    )(dispatch)
      .then(({ error } = {}) => {
        if (error) {
          if (res) {
            redirectFromProject();
          }
        }
      })
      .catch();
  } else if (!foundProject || isEditRequest) {
    getProjectCardRequestAction(
      {
        projectCardId,
        isEditRequest,
      },
      refreshedToken
    )(dispatch)
      .then(({ error } = {}) => {
        if (error) {
          redirectFromProject();
        }
      })
      .catch();
  }
};
