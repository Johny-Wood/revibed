import classNames from 'classnames';

import styles from './styles.module.scss';

export default function RightsholdersWrapperDisclaimer() {
  return (
    <div className={classNames(styles.RightsholdersWrapperDisclaimer)}>
      <h1 className={classNames(styles.RightsholdersWrapperDisclaimer__title)}>Disclaimer</h1>
      <div className={classNames(styles.RightsholdersWrapperDisclaimer__description)}>
        RIGHTS IN&nbsp;THE RECORDINGS OFFERED THROUGH OUR PLATFORM
      </div>
    </div>
  );
}
