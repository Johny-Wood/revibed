import styles from './styles.module.scss';

function ProfileBar({ children }) {
  return <div className={styles.profileBar}>{children}</div>;
}

export default ProfileBar;
