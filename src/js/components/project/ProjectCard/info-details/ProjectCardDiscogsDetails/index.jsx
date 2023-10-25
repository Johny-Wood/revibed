import ProjectCardInfoLayout from '@/components/project/ProjectCard/info-details/ProjectCardInfoLayout';

import styles from './styles.module.scss';

function ProjectCardDiscogsDetails({ discogsDetails: { have = '-', want = '-', ratingAverage = '-', ratingCount = '-' } = {} }) {
  return (
    <ProjectCardInfoLayout title="Discogs statistics">
      <div className={styles.projectCardDiscogsDetails}>
        <div className={styles.projectCardDiscogsDetails__info}>
          <div className={styles.projectCardDiscogsDetails__table}>
            <div className={styles.projectCardDiscogsDetails__block}>
              <div className={styles.projectCardDiscogsDetails__item}>
                <span className={styles.projectCardDiscogsDetails__description}>Have:</span>
                <span>{have || '-'}</span>
              </div>
              <div className={styles.projectCardDiscogsDetails__item}>
                <span className={styles.projectCardDiscogsDetails__description}>Want:</span>
                <span>{want || '-'}</span>
              </div>
              <div className={styles.projectCardDiscogsDetails__item}>
                <span className={styles.projectCardDiscogsDetails__description}>Avg rating:</span>
                <span>{ratingAverage || '-'} / 5</span>
              </div>
              <div className={styles.projectCardDiscogsDetails__item}>
                <span className={styles.projectCardDiscogsDetails__description}>Ratings:</span>
                <span>{ratingCount || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProjectCardInfoLayout>
  );
}

export default ProjectCardDiscogsDetails;
