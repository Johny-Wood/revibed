import classNames from 'classnames';

import styles from './styles.module.scss';

function Progress({ shown, progress }) {
  if (!shown) {
    return null;
  }

  return <span className={classNames(styles.processInfo, 'process-info')}>{Math.round(progress)}%</span>;
}

export default Progress;
