import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

function ProjectProcess({ className, statusName, cutsCount, totalCutsCount }) {
  return (
    <div className={classNames([styles.projectProcess, className])}>
      <span
        style={{
          width: `${(cutsCount * 100) / totalCutsCount}%`,
          backgroundColor: `var(--color__${statusName})`,
        }}
      />
    </div>
  );
}

ProjectProcess.defaultProps = {
  cutsCount: 0,
  totalCutsCount: 0,
};

ProjectProcess.propTypes = {
  cutsCount: PropTypes.number,
  totalCutsCount: PropTypes.number,
};

export default ProjectProcess;
