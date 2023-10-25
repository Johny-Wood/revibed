import SortAndFiltersLocationsConstants from '@/constants/sortAndFilters/locations';

import createSortAndFiltersReducer from './createSortAndFiltersReducer';

const ProjectsSortAndFiltersReducer = (state, action) =>
  createSortAndFiltersReducer(state, action, SortAndFiltersLocationsConstants.PROJECTS);

export default ProjectsSortAndFiltersReducer;
