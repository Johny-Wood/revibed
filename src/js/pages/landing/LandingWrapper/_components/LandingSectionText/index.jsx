import classNames from 'classnames';

import styles from './styles.module.scss';

function LandingSectionText({ className, children }) {
  return <p className={classNames([styles.landingSectionText, className])}>{children}</p>;
}

export default LandingSectionText;
