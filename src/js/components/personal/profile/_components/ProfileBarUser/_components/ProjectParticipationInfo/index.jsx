import styles from './styles.module.scss';

function ProjectParticipationInfo({ userInfo: { contributed = 0, subscribersCount = 0 } = {} }) {
  return (
    <div className={styles.userProjectsInfo}>
      <span className={styles.userProjectsInfo__item}>
        <span className="c-gray-2">projects:&nbsp;</span>
        <span className="t-medium">{contributed}</span>
      </span>
      <span className={styles.userProjectsInfo__item}>
        <span className="c-gray-2">followers:&nbsp;</span>
        <span className="t-medium">{subscribersCount}</span>
      </span>
    </div>
  );
}

export default ProjectParticipationInfo;
