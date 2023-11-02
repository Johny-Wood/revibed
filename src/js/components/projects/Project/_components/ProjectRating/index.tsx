import classNames from 'classnames';

import styles from './styles.module.scss';

type ProjectRatingProps = {
  currentPosition: number;
  step?: number;
  direction?: 'UP' | 'DOWN' | null;
  isNew?: boolean;
};

function ProjectRating({ currentPosition, step = 0, direction, isNew }: ProjectRatingProps) {
  return (
    <div
      className={classNames(
        styles.projectRating,
        direction === 'UP' && styles.projectRating_up,
        direction === 'DOWN' && styles.projectRating_down
      )}
    >
      <i className={classNames(styles.projectRating__number)}>{currentPosition}</i>
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

export default ProjectRating;
