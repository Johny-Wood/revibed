import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './styles.module.scss';

function ProjectRating({ number, step, direction, isNew }) {
  return (
    <div
      className={classNames([
        styles.projectRating,
        direction === 'UP' && styles.projectRating_up,
        direction === 'DOWN' && styles.projectRating_down,
      ])}
    >
      <span className={classNames([styles.projectRating__number, 't-bold'])}>{number}</span>
      {isNew && (
        <span className={styles.projectRating__new__step}>
          <i>new</i>
        </span>
      )}
      {!isNew && step !== 0 && (
        <>
          <span className={styles.projectRating__triangle} />
          <span className={styles.projectRating__step}>
            {direction === 'UP' ? '+' : '-'}
            {step}
          </span>
        </>
      )}
    </div>
  );
}

ProjectRating.defaultProps = {
  step: 0,
  direction: '',
  isNew: false,
};

ProjectRating.propTypes = {
  number: PropTypes.number.isRequired,
  step: PropTypes.number,
  direction: PropTypes.oneOf(['UP', 'DOWN', '']),
  isNew: PropTypes.bool,
};

export default ProjectRating;
