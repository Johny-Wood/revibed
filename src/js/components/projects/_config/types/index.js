import PropTypes from 'prop-types';

import { ProjectsPreviewTypesConstants } from '@/constants/projects/previewTypes';

const ProjectsTypes = {
  location: PropTypes.string.isRequired,

  projects: PropTypes.array,
  pageSettings: PropTypes.object,
  getProjectsInProcess: PropTypes.bool,
  withPagination: PropTypes.bool,
  loadedProjectsFromApi: PropTypes.bool,

  filtersSelected: PropTypes.object,
  filtersApplied: PropTypes.object,
  filterApplied: PropTypes.bool,
  withFilters: PropTypes.bool,
  withDiscogsFilters: PropTypes.bool,

  sortSelected: PropTypes.object,
  withSort: PropTypes.bool,

  withPageSize: PropTypes.bool,
  isFullType: PropTypes.bool,
  withAnimation: PropTypes.bool,
  className: PropTypes.string,
  secondOffset: PropTypes.number,

  previewType: PropTypes.shape({
    activePreviewType: PropTypes.oneOf([ProjectsPreviewTypesConstants.CARD, ProjectsPreviewTypesConstants.LIST]),
  }),
};

export default ProjectsTypes;
