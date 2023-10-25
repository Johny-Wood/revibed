import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import { MarketplaceReducersConstants } from '@/constants/marketplace/reducers';
import { RoutePathsConstants } from '@/constants/routes/routes';
import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';
import { changeSearchMarketplaceAndPreOrdersFiltersAction } from '@/redux-actions/marketplace-and-pre-orders/marketplaceAndPreOrdersFiltersActions';
import {
  applyMarketplaceFilterAction,
  getMarketplaceListRequestAction,
  selectMarketplaceFilterAction,
  setMarketplaceSortSelectedAction,
} from '@/redux-actions/marketplace/marketplaceActions';
import { getMarketplaceCardRequestAction } from '@/redux-actions/marketplace/marketplaceCardActions';
import { getCartInfoRequestAction, getCartRequestAction } from '@/redux-actions/marketplace/marketplaceCartActions';
import { setProjectsSortSelectedAction } from '@/redux-actions/projects/projectsActions';
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

const redirectFromCard = ({ req, res, location = RoutePathsConstants.MARKETPLACE }) => {
  if (req) {
    res.statusCode = 302;
    res.setHeader('Location', location);
    res.end();
  } else {
    const { router = {} } = NextRouter.getInstance();
    router.push(location);
  }
};

export const SSRGetMarketplaceCardWithCookie = async ({ ctx }) => {
  const { store } = ReduxStoreService.getInstance();

  const { refreshedToken, req, res, store: { dispatch } = {}, query: { marketplaceCardId } = {} } = ctx;

  const { MarketplaceCardReducer: { marketplaceCards = [] } = {} } = store.getState();
  const foundMarketplaceCard = marketplaceCards[marketplaceCardId];

  if (req) {
    await getMarketplaceCardRequestAction({
      marketplaceCardId,
      dispatch,
      cookie: refreshedToken,
    })
      .then(({ error } = {}) => {
        if (error) {
          if (res) {
            redirectFromCard({
              req,
              res,
            });
          }
        }
      })
      .catch();
  } else if (!foundMarketplaceCard) {
    getMarketplaceCardRequestAction({
      marketplaceCardId,
      dispatch,
      cookie: refreshedToken,
    })
      .then(({ error } = {}) => {
        if (error) {
          redirectFromCard({
            req,
            res,
          });
        }
      })
      .catch();
  }
};

export const SSRGetMarketPlaceSortAndFilter = async ({ query, store, store: { dispatch } = {}, req }) => {
  const { MarketplaceSortAndFiltersReducer: { loadedSortAndFiltersFromApi } = {} } = store.getState();

  if (req) {
    const { pageFilters } = getQueryPageParamsUtil({ query });

    await getSortAndFiltersRequestAction({
      location: SortAndFiltersLocationsConstants.MARKETPLACE,
      query: pageFilters,
      dispatch,
    })
      .then()
      .catch();
  } else if (!loadedSortAndFiltersFromApi) {
    await getSortAndFiltersRequestAction({
      location: SortAndFiltersLocationsConstants.MARKETPLACE,
      dispatch,
    })
      .then()
      .catch();
  }
};

export const SSRGetMarketplaceWithCookie = async ({ ctx, location, externalQuery }) => {
  const { refreshedToken, store, store: { dispatch } = {}, query, req } = ctx;

  const { sortSelected: sortSelectedFromStore = {} } = store.getState()[MarketplaceReducersConstants[location]];

  await SSRGetMarketPlaceSortAndFilter(ctx).then(async () => {
    const queryParams = getQueryPageParamsUtil({ query: externalQuery || query });
    const {
      pageFilters = {},
      pageFilters: { query: querySearch = [] } = {},
      pageSort: { sort: sortQuery = [] } = {},
    } = queryParams;

    if (req) {
      const { MarketplaceSortAndFiltersReducer: { sortAndFilters: { sort = [], filter: { filters = {} } = {} } = {} } = {} } =
        store.getState();

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
          dispatch(setProjectsSortSelectedAction(SortAndFiltersLocationsConstants.MARKETPLACE, name, sortPropertyItem));
        },
      });

      applyFiltersQueryUtil({
        selectedFilters,
        filtersQuery,
        dispatchAction: ({ categoryId, selected, multi }) => {
          dispatch(
            selectMarketplaceFilterAction({
              categoryId,
              selected: [selected],
              multi,
              location,
            })
          );
        },
        dispatchCallback: () => {
          dispatch(applyMarketplaceFilterAction(location));
        },
      });

      if (querySearch.length > 0 && location === MarketplaceLocationsConstants.MARKETPLACE) {
        dispatch(changeSearchMarketplaceAndPreOrdersFiltersAction({ search: querySearch[0] }));
      }

      await getMarketplaceListRequestAction({
        ...pageQueryParams,
        cookie: refreshedToken,
        location,
        dispatch,
      }).then(({ sortSelected }) => {
        applySortFromRequestUtil({
          sortSelected,
          sort,
          sortQuery,
          sortSelectedFromStore,
          dispatchAction: ({ name, sortPropertyItem }) => {
            dispatch(setMarketplaceSortSelectedAction(name, sortPropertyItem, location));
          },
        });
      });
    } else {
      getMarketplaceListRequestAction({
        cookie: refreshedToken,
        location,
        dispatch,
      })
        .then(({ sortSelected }) => {
          const { MarketplaceSortAndFiltersReducer: { sortAndFilters: { sort = [] } = {} } = {} } = store.getState();

          applySortFromRequestUtil({
            sortSelected,
            sort,
            sortQuery,
            sortSelectedFromStore,
            dispatchAction: ({ name, sortPropertyItem }) => {
              dispatch(setMarketplaceSortSelectedAction(name, sortPropertyItem, location));
            },
          });
        })
        .catch();
    }
  });
};

export const SSRGetMarketPlaceCartInfoWithCookie = async ({ ctx }) => {
  const { store, store: { dispatch } = {}, req, refreshedToken } = ctx;
  const { MarketplaceCartReducer: { getCartInfoInProcessFromApi } = {} } = store.getState();

  if (req) {
    await getCartInfoRequestAction({
      cookie: refreshedToken,
      dispatch,
    })
      .then()
      .catch();
  } else if (!getCartInfoInProcessFromApi) {
    getCartInfoRequestAction({
      cookie: refreshedToken,
      dispatch,
    })
      .then()
      .catch();
  }
};

export const SSRGetMarketPlaceCartWithCookie = async ({ ctx }) => {
  const { store: { dispatch } = {}, req, refreshedToken } = ctx;

  if (req) {
    await getCartRequestAction({
      cookie: refreshedToken,
      dispatch,
    })
      .then()
      .catch();
  } else {
    getCartRequestAction({
      cookie: refreshedToken,
      dispatch,
    })
      .then()
      .catch();
  }
};
