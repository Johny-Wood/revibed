import classNames from 'classnames';

import PrivateIcon from '@/icons/project/state/PrivateIcon';

import styles from './styles.module.scss';

function PrivateLabel({ isShown, className }) {
  if (!isShown) {
    return null;
  }

  return (
    <div className={classNames(styles.privateLabel, className)}>
      <PrivateIcon />
      <span className={styles.privateLabel__text}>Private</span>
    </div>
  );
}

export default PrivateLabel;
