import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';

import createSortAndFiltersReducer from './createSortAndFiltersReducer';

const MarketplaceSortAndFiltersReducer = (state, action) =>
  createSortAndFiltersReducer(state, action, SortAndFiltersLocationsConstants.MARKETPLACE);

export default MarketplaceSortAndFiltersReducer;
