import classNames from 'classnames';

import styles from './styles.module.scss';

function WantListImportText({
  className,

  children,
}) {
  return <div className={classNames(styles.formWantListImportText, className)}>{children}</div>;
}

export default WantListImportText;
