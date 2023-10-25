import classNames from 'classnames';

import globalStyles from '@/assets/styles/global-classes.module.scss';

import styles from './styles.module.scss';

function TextContentLayout({ className, children }) {
  return <div className={classNames(styles.textContent, globalStyles.breakWord, className)}>{children}</div>;
}

export default TextContentLayout;
