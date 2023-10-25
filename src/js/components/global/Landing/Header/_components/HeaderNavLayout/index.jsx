import styles from './styles.module.scss';

function HeaderNavLayout({ children }) {
  return <div className={styles.headerNavLayout}>{children}</div>;
}

export default HeaderNavLayout;
