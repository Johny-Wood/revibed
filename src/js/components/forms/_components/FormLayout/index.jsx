import classNames from 'classnames';

import styles from './styles.module.scss';

function FormLayout({ className, children }) {
  return <div className={classNames(styles.formLayout, className)}>{children}</div>;
}

export default FormLayout;
