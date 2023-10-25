const ProjectsListProps = {
  className: '',
  projectBlockClassName: '',

  projects: [],

  getProjectsInProcess: false,
  withRating: false,
  withFilters: false,
  withPagination: true,
  withPageSize: true,
  isFullType: true,
  withDiscogsFilters: false,
  withSort: false,

  projectsLength: 0,

  changeFilterProps: {},
  sortAndFilters: {},
  previewType: {},
  pageSettings: {},

  userId: undefined,
  renderProjectFilters: undefined,

  changeFilterCallBack: () => {},
  changePage: () => {},
};

export default ProjectsListProps;
