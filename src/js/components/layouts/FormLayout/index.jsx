import classNames from 'classnames';

import styles from './styles.module.scss';

function FormLayout({ title, className, formContentClassName, children }) {
  return (
    <div className={classNames([styles.form, className])}>
      <h1>{title}</h1>
      <div className={classNames([formContentClassName])}>{children}</div>
    </div>
  );
}

export default FormLayout;
