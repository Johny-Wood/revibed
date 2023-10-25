import { RoutePathsConstants } from '@/constants/routes/routes';
import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';
import WantListImportStatusConstants from '@/constants/wantList/status';
import { getSortAndFiltersRequestAction } from '@/redux-actions/sort-and-filter/sortAndFiltersActions';
import {
  applyWantListFilterAction,
  getWantListInfoRequestAction,
  loadPlansWantListRequestAction,
  loadWantListRequestAction,
  selectWantListFilterAction,
  setWantListSortSelectedAction,
} from '@/redux-actions/wantList/wantListActions';
import { getWantListReleaseItemRequestAction } from '@/redux-actions/wantList/wantListReleaseItemActions';
import {
  applyWantListReleasesItemsFilterAction,
  loadWantListReleasesItemsRequestAction,
  selectWantListReleasesItemsFilterAction,
  setWantListReleasesItemsSortSelectedAction,
} from '@/redux-actions/wantList/wantListReleasesItemsActions';
import NextRouter from '@/services/NextRouter';
import ReduxStoreService from '@/services/ReduxStoreService';
import { getQueryPageParamsUtil } from '@/utils/routeUtils';
import {
  applyFiltersQueryUtil,
  applySortQueryUtil,
  getSelectedFiltersQueryUtil,
} from '@/utils/sort-and-filter/sortAndFilterQueryUtils';

export const SSRLoadWantListSortAndFilter = async ({ ctx }) => {
  const { query, refreshedToken, store: { dispatch } = {}, req } = ctx;

  const { store } = ReduxStoreService.getInstance();

  const {
    AuthReducer: { userIsAuthorized } = {},
    WantListReleasesSortAndFiltersReducer: { loadedSortAndFiltersFromApi: loadedWantListSortAndFilterFromApi } = {},
  } = store.getState();

  if (userIsAuthorized) {
    if (req) {
      const { pageFilters } = getQueryPageParamsUtil({ query });

      await getSortAndFiltersRequestAction({
        cookie: refreshedToken,
        location: SortAndFiltersLocationsConstants.WANT_LIST_RELEASES,
        query: pageFilters,
        dispatch,
      })
        .then()
        .catch();
    } else if (!loadedWantListSortAndFilterFromApi) {
      getSortAndFiltersRequestAction({
        cookie: refreshedToken,
        location: SortAndFiltersLocationsConstants.WANT_LIST_RELEASES,
        dispatch,
      })
        .then()
        .catch();
    }
  }
};

export const SSRLoadWantListReleasesItemsSortAndFilter = async ({ ctx }) => {
  const { query, refreshedToken, store: { dispatch } = {}, req } = ctx;

  const { store } = ReduxStoreService.getInstance();

  const {
    AuthReducer: { userIsAuthorized } = {},
    WantListReleasesItemsSortAndFiltersReducer: { loadedSortAndFiltersFromApi } = {},
  } = store.getState();

  if (userIsAuthorized) {
    if (req) {
      const { pageFilters } = getQueryPageParamsUtil({ query });

      await getSortAndFiltersRequestAction({
        cookie: refreshedToken,
        location: SortAndFiltersLocationsConstants.WANT_LIST_ITEMS,
        query: pageFilters,
        dispatch,
      })
        .then()
        .catch();
    } else if (!loadedSortAndFiltersFromApi) {
      getSortAndFiltersRequestAction({
        cookie: refreshedToken,
        location: SortAndFiltersLocationsConstants.WANT_LIST_ITEMS,
        dispatch,
      })
        .then()
        .catch();
    }
  }
};

export const SSRGetWantListRequest = async ({ dispatch, query, refreshedToken }) => {
  const { store } = ReduxStoreService.getInstance();

  const { WantListReleasesSortAndFiltersReducer: { sortAndFilters: { sort = [], filter: { filters = {} } = {} } = {} } = {} } =
    store.getState();

  const queryParams = getQueryPageParamsUtil({ query });
  const { pageFilters = {}, pageSort: { sort: sortQuery = [] } = {} } = queryParams;
  const { filtersQuery, selectedFilters } = getSelectedFiltersQueryUtil({
    filters,
    filtersQuery: pageFilters,
  });

  const pageQueryParams = {
    ...queryParams,
    pageFilters: {
      ...queryParams.pageFilters,
      ...filtersQuery,
    },
  };

  applySortQueryUtil({
    sort,
    sortQuery,
    dispatchAction: ({ name, sortPropertyItem }) => {
      dispatch(
        setWantListSortSelectedAction({
          [name]: {
            ...sortPropertyItem,
          },
        })
      );
    },
  });

  applyFiltersQueryUtil({
    selectedFilters,
    filtersQuery,
    dispatchAction: ({ categoryId, selected, multi }) => {
      dispatch(
        selectWantListFilterAction({
          categoryId,
          selected,
          multi,
        })
      );
    },
    dispatchCallback: () => {
      dispatch(applyWantListFilterAction());
    },
  });

  await loadWantListRequestAction({
    ...pageQueryParams,
    cookie: refreshedToken,
  })(dispatch)
    .then()
    .catch();
};

export const SSRGetWantListReleasesItemsRequest = async ({ dispatch, query, refreshedToken }) => {
  const { store } = ReduxStoreService.getInstance();

  const {
    WantListReleasesItemsSortAndFiltersReducer: { sortAndFilters: { sort = [], filter: { filters = {} } = {} } = {} } = {},
  } = store.getState();

  const queryParams = getQueryPageParamsUtil({ query });
  const { pageFilters = {}, pageSort: { sort: sortQuery = [] } = {} } = queryParams;
  const { filtersQuery, selectedFilters } = getSelectedFiltersQueryUtil({
    filters,
    filtersQuery: pageFilters,
  });

  const pageQueryParams = {
    ...queryParams,
    pageFilters: {
      ...queryParams.pageFilters,
      ...filtersQuery,
    },
  };

  applySortQueryUtil({
    sort,
    sortQuery,
    dispatchAction: ({ name, sortPropertyItem }) => {
      dispatch(
        setWantListReleasesItemsSortSelectedAction({
          [name]: {
            ...sortPropertyItem,
          },
        })
      );
    },
  });

  applyFiltersQueryUtil({
    selectedFilters,
    filtersQuery,
    dispatchAction: ({ categoryId, selected, multi }) => {
      dispatch(
        selectWantListReleasesItemsFilterAction({
          categoryId,
          selected,
          multi,
        })
      );
    },
    dispatchCallback: () => {
      dispatch(applyWantListReleasesItemsFilterAction());
    },
  });

  await loadWantListReleasesItemsRequestAction({
    cookie: refreshedToken,
    ...pageQueryParams,
  })(dispatch)
    .then()
    .catch();
};

export const SSRGetWantListInfoWithCookie = async ({ ctx = {} }) => {
  const { refreshedToken, store, store: { dispatch } = {}, req } = ctx;

  const { AuthReducer: { userIsAuthorized } = {} } = store.getState();

  if (userIsAuthorized) {
    if (req) {
      await getWantListInfoRequestAction({ cookie: refreshedToken })(dispatch).then().catch();
    } else {
      getWantListInfoRequestAction({ cookie: refreshedToken })(dispatch).then().catch();
    }
  }
};

export const SSRGetWantListInfoAndListWithCookie = async ({ ctx = {}, withRedirect = false, location }) => {
  const { refreshedToken, store, store: { dispatch } = {}, req, res, query } = ctx;

  const {
    AuthReducer: { userIsAuthorized } = {},
    WantListReducer: { getWantListInfoFromApi, loadWantListFromApi, wantListInfo = {} } = {},
    WantListReleasesItemsReducer: { loadWantListReleasesItemsFromApi } = {},
  } = store.getState();

  const hasNotWantList = (status) => !status || status !== WantListImportStatusConstants.ACTIVE;

  let getListFromApi = false;

  switch (location) {
    case SortAndFiltersLocationsConstants.WANT_LIST_RELEASES: {
      await SSRLoadWantListSortAndFilter({ ctx });
      getListFromApi = loadWantListFromApi;
      break;
    }
    case SortAndFiltersLocationsConstants.WANT_LIST_ITEMS: {
      await SSRLoadWantListReleasesItemsSortAndFilter({ ctx });
      getListFromApi = loadWantListReleasesItemsFromApi;
      break;
    }
    default: {
      break;
    }
  }

  const redirectSSR = () => {
    if (res && withRedirect) {
      res.statusCode = 302;
      res.setHeader('Location', RoutePathsConstants.WANTLIST_ADD);
      res.end();
    }
  };

  const onRedirectSSR = (status) => {
    if (hasNotWantList(status)) {
      redirectSSR();
    }
  };

  const redirect = () => {
    const { router = {} } = NextRouter.getInstance();

    if (withRedirect) {
      router.push(RoutePathsConstants.WANTLIST_ADD);
    }
  };

  const onRedirect = (status) => {
    if (hasNotWantList(status)) {
      redirect();
    }
  };

  if (userIsAuthorized) {
    if (req) {
      await getWantListInfoRequestAction({ cookie: refreshedToken })(dispatch)
        .then(async ({ status }) => {
          if (!hasNotWantList(status)) {
            switch (location) {
              case SortAndFiltersLocationsConstants.WANT_LIST_RELEASES: {
                await SSRGetWantListRequest({
                  dispatch,
                  query,
                  refreshedToken,
                });
                break;
              }
              case SortAndFiltersLocationsConstants.WANT_LIST_ITEMS: {
                await SSRGetWantListReleasesItemsRequest({
                  dispatch,
                  query,
                  refreshedToken,
                });
                break;
              }
              default: {
                break;
              }
            }
          }

          onRedirectSSR(status);
        })
        .catch(() => {
          onRedirectSSR();
        });
    } else if (!getWantListInfoFromApi) {
      getWantListInfoRequestAction({ cookie: refreshedToken })(dispatch)
        .then(({ status }) => {
          if (!hasNotWantList(status)) {
            loadWantListRequestAction({ cookie: refreshedToken })(dispatch).then().catch();
          }

          onRedirect(status);
        })
        .catch(() => {
          onRedirect();
        });
    } else if (!getListFromApi) {
      const { status } = wantListInfo;

      if (!hasNotWantList(status)) {
        switch (location) {
          case SortAndFiltersLocationsConstants.WANT_LIST_RELEASES: {
            loadWantListRequestAction({ cookie: refreshedToken })(dispatch).then().catch();
            break;
          }
          case SortAndFiltersLocationsConstants.WANT_LIST_ITEMS: {
            loadWantListReleasesItemsRequestAction({
              cookie: refreshedToken,
            })(dispatch)
              .then()
              .catch();
            break;
          }
          default: {
            break;
          }
        }
      } else {
        redirect();
      }
    }
  } else if (req) {
    redirectSSR();
  } else {
    redirect();
  }
};

export const SSRLoadWantListPlan = async ({ ctx }) => {
  const { refreshedToken, store, store: { dispatch } = {}, req } = ctx;

  const { WantListReducer: { loadPlanWantListFromApi } = {} } = store.getState();

  if (req) {
    await loadPlansWantListRequestAction(refreshedToken)(dispatch).then().catch();
  } else if (!loadPlanWantListFromApi) {
    loadPlansWantListRequestAction(refreshedToken)(dispatch).then().catch();
  }
};

export const SSRLoadReleaseItem = async ({ ctx }) => {
  const { refreshedToken, store, store: { dispatch } = {}, req, query: { releaseItemId } = {} } = ctx;

  const { WantListReleaseItemReducer: { wantlistReleaseItem = {} } = {} } = store.getState();

  const findReleaseItem = wantlistReleaseItem && wantlistReleaseItem[releaseItemId];

  if (req) {
    await getWantListReleaseItemRequestAction({
      cookie: refreshedToken,
      releaseId: releaseItemId,
    })(dispatch)
      .then()
      .catch();
  } else if (!findReleaseItem) {
    getWantListReleaseItemRequestAction({
      cookie: refreshedToken,
      releaseId: releaseItemId,
    })(dispatch)
      .then()
      .catch();
  }
};
