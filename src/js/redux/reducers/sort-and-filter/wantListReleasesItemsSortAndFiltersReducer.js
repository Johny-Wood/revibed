import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';

import createSortAndFiltersReducer from './createSortAndFiltersReducer';

const WantListReleasesItemsSortAndFiltersReducer = (state, action) =>
  createSortAndFiltersReducer(state, action, SortAndFiltersLocationsConstants.WANT_LIST_ITEMS);

export default WantListReleasesItemsSortAndFiltersReducer;
