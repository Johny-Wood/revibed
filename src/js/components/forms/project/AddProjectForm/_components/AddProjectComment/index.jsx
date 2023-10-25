import styles from './styles.module.scss';

function AddProjectComment({ label = '', text = '' }) {
  return (
    <div className={styles.draftProjectComment}>
      <div className="m-bottom-5">
        <b>{label}</b>
      </div>
      <p className={styles.draftProjectComment__text}>{text}</p>
    </div>
  );
}

export default AddProjectComment;
