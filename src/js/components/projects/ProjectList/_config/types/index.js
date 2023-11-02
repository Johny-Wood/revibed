import PropTypes from 'prop-types';

const ProjectsListTypes = {
  location: PropTypes.string.isRequired,
  className: PropTypes.string,
  projectBlockClassName: PropTypes.string,
  projects: PropTypes.array,
  changeFilterProps: PropTypes.object,
  sortAndFilters: PropTypes.object,
  isFullType: PropTypes.bool,
  projectsLength: PropTypes.number,
  previewType: PropTypes.object,
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  withFilters: PropTypes.bool,
  withPagination: PropTypes.bool,
  withPageSize: PropTypes.bool,
  pageSettings: PropTypes.object,
  withDiscogsFilters: PropTypes.bool,
  withSort: PropTypes.bool,
  renderProjectFilters: PropTypes.any,
  getProjectsInProcess: PropTypes.bool,
  changeFilterCallBack: PropTypes.func,
  changePage: PropTypes.func,
};

export default ProjectsListTypes;
