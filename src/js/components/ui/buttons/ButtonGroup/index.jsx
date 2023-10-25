import styles from './styles.module.scss';

function ButtonGroup({ children }) {
  return <div className={styles.buttonGroup}>{children}</div>;
}

export default ButtonGroup;
