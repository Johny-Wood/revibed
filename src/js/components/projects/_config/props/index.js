import { ProjectsPreviewTypesConstants } from '@/constants/projects/previewTypes';

const ProjectsProps = {
  projects: [],
  pageSettings: {},
  getProjectsInProcess: false,
  loadedProjectsFromApi: false,

  filtersSelected: {},
  filtersApplied: {},
  filterApplied: false,
  withFilters: true,
  withDiscogsFilters: true,

  sortSelected: {},
  withSort: true,

  withPageSize: true,
  withPagination: true,
  isFullType: false,
  withAnimation: false,
  className: '',
  secondOffset: 80,

  previewType: {
    activePreviewType: ProjectsPreviewTypesConstants.LIST,
  },
};

export default ProjectsProps;
