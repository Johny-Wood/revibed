import ProjectCardInfoLayout from '@/components/project/ProjectCard/info-details/ProjectCardInfoLayout';

import styles from '../ProjectCardReleaseDetails/styles.module.scss';

function ProjectCardItemDetails({
  shippingFrom,
  titleDiscogs,
  sleeveCondition: { title: sleeveConditionTitle, shortTitle: sleeveConditionShortTitle } = {},
  mediaCondition: { title: mediaConditionTitle, shortTitle: mediaConditionShortTitle } = {},
}) {
  return (
    <ProjectCardInfoLayout title="Item details">
      <div className={styles.projectCardReleaseDetails}>
        <div className={styles.projectCardReleaseDetails__info}>
          <div className={styles.projectCardReleaseDetails__item}>
            <span className={styles.projectCardReleaseDetails__description}>Media Condition:</span>
            <span>
              {mediaConditionShortTitle ? (
                <>
                  {mediaConditionTitle} ({mediaConditionShortTitle})
                </>
              ) : (
                <>---</>
              )}
            </span>
          </div>
          <div className={styles.projectCardReleaseDetails__item}>
            <span className={styles.projectCardReleaseDetails__description}>Sleeve Condition:</span>
            <span>
              {sleeveConditionShortTitle ? (
                <>
                  {sleeveConditionTitle} ({sleeveConditionShortTitle})
                </>
              ) : (
                <>---</>
              )}
            </span>
          </div>
          <div className={styles.projectCardReleaseDetails__item}>
            <span className={styles.projectCardReleaseDetails__description}>Ships from:</span>
            <span>{shippingFrom && titleDiscogs ? titleDiscogs : <>---</>}</span>
          </div>
        </div>
      </div>
    </ProjectCardInfoLayout>
  );
}

export default ProjectCardItemDetails;
