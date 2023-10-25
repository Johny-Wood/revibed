import classNames from 'classnames';

import styles from './styles.module.scss';

function PopupTextContent({ className, children }) {
  return <div className={classNames(styles.popupContentText, className)}>{children}</div>;
}

export default PopupTextContent;
