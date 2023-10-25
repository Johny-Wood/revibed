import { SortAndFiltersActionsConstants } from '@/constants/actions/projects/sortAndFilters';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  loadSortAndFiltersInProcess: false,
  loadedSortAndFiltersFromApi: false,
  sortAndFilters: {},
};

const createLocalHandlers = (location) =>
  createHandlers({
    [`${location}_${SortAndFiltersActionsConstants.GET_SORT_AND_FILTERS_IN_PROCESS}`]: (
      state,
      { loadSortAndFiltersInProcess }
    ) => ({
      ...state,
      loadSortAndFiltersInProcess,
    }),
    [`${location}_${SortAndFiltersActionsConstants.GET_SORT_AND_FILTERS_SUCCESS}`]: (state, { sortAndFilters }) => ({
      ...state,
      sortAndFilters: {
        ...sortAndFilters,
      },
      loadSortAndFiltersInProcess: false,
      loadedSortAndFiltersFromApi: true,
    }),
    [`${location}_${SortAndFiltersActionsConstants.RESET_SORT_AND_FILTERS}`]: () => ({
      ...initialState,
    }),
  });

const createSortAndFiltersReducer = (state = initialState, action, location) => {
  const handlers = createLocalHandlers(location);

  return createReducer(state, action, handlers);
};

export { createHandlers, createReducer };

export default createSortAndFiltersReducer;
