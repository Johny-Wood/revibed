import styles from './styles.module.scss';

function AddProjectStep({ stepNumber = 1, stepName = 'Step', children, headerChild }) {
  return (
    <div className={styles.draftProjectStep}>
      <div className={styles.draftProjectStep__header}>
        <span className={styles.draftProjectStep__number}>{stepNumber}</span>
        <h2>{stepName}</h2>
        {headerChild}
      </div>
      {children}
    </div>
  );
}

export default AddProjectStep;
