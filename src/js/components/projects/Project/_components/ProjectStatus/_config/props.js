import PropTypes from 'prop-types';

export const ProjectStatusPropTypes = {
  projectInfo: PropTypes.object,
  isFilter: PropTypes.bool,
  withFilter: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  changeFilterCallBack: PropTypes.func,
  tooltip: PropTypes.object,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export const ProjectStatusDefaultProps = {
  projectInfo: {},
  isFilter: false,
  withFilter: false,
  disabled: false,
  className: '',
  changeFilterCallBack: () => {},
  tooltip: {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
};
