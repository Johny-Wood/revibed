import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';

import createSortAndFiltersReducer from './createSortAndFiltersReducer';

const WantedSortAndFiltersReducer = (state, action) =>
  createSortAndFiltersReducer(state, action, SortAndFiltersLocationsConstants.SYSTEM_WANT_LIST_ITEMS);

export default WantedSortAndFiltersReducer;
