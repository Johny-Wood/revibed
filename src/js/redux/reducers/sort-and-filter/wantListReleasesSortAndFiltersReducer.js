import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';

import createSortAndFiltersReducer from './createSortAndFiltersReducer';

const WantListReleasesSortAndFiltersReducer = (state, action) =>
  createSortAndFiltersReducer(state, action, SortAndFiltersLocationsConstants.WANT_LIST_RELEASES);

export default WantListReleasesSortAndFiltersReducer;
