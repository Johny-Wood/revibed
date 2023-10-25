import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';
import { getSortAndFiltersRequestAction } from '@/redux-actions/sort-and-filter/sortAndFiltersActions';
import { applyWantedFilterAction, loadWantedRequestAction, selectWantedFilterAction } from '@/redux-actions/wanted/wantedActions';
import { getQueryPageParamsUtil } from '@/utils/routeUtils';
import { applyFiltersQueryUtil, getSelectedFiltersQueryUtil } from '@/utils/sort-and-filter/sortAndFilterQueryUtils';

export const SSRLoadWantedSortAndFilter = async ({ query, store, store: { dispatch } = {}, req }) => {
  const { WantedSortAndFiltersReducer: { loadedSortAndFiltersFromApi } = {} } = store.getState();

  if (req) {
    const { pageFilters } = getQueryPageParamsUtil({ query });

    await getSortAndFiltersRequestAction({
      location: SortAndFiltersLocationsConstants.SYSTEM_WANT_LIST_ITEMS,
      query: pageFilters,
      dispatch,
    })
      .then()
      .catch();
  } else if (!loadedSortAndFiltersFromApi) {
    getSortAndFiltersRequestAction({
      location: SortAndFiltersLocationsConstants.SYSTEM_WANT_LIST_ITEMS,
      dispatch,
    })
      .then()
      .catch();
  }
};

export const SSRLoadWantedRequest = async (ctx) => {
  const { store, store: { dispatch } = {}, query, req } = ctx;

  const { WantedReducer: { loadWantedFromApi } = {} } = store.getState();

  await SSRLoadWantedSortAndFilter(ctx).then(async () => {
    const { WantedSortAndFiltersReducer: { sortAndFilters: { filter: { filters = {} } = {} } = {} } = {} } = store.getState();

    if (req) {
      const queryParams = getQueryPageParamsUtil({ query });
      const { pageFilters = {} } = queryParams;
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

      applyFiltersQueryUtil({
        selectedFilters,
        filtersQuery,
        dispatchAction: ({ categoryId, selected, multi }) => {
          dispatch(
            selectWantedFilterAction({
              categoryId,
              selected: [selected],
              multi,
            })
          );
        },
        dispatchCallback: () => {
          dispatch(applyWantedFilterAction());
        },
      });

      await loadWantedRequestAction({
        ...pageQueryParams,
        dispatch,
      })
        .then()
        .catch();
    } else if (!loadWantedFromApi) {
      loadWantedRequestAction({
        dispatch,
      })
        .then()
        .catch();
    }
  });
};
