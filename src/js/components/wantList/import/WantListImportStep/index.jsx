import styles from './styles.module.scss';

function WantListImportStep({ title = '', children }) {
  return (
    <div className={styles.wantListImport}>
      <div className={styles.wantListImport__title}>{title}</div>
      {children}
    </div>
  );
}

export default WantListImportStep;
