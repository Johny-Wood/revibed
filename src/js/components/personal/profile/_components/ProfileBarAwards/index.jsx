import RatingDescriptionTooltip from '@/components/RatingDescriptionTooltip';
import TopLaurelIcon from '@/icons/top-users/TopLaurelIcon';

import styles from './styles.module.scss';

function ProfileBarAwards({ userInfo: { ratingGroups = [] } = {} }) {
  if (ratingGroups.length === 0) {
    return null;
  }

  return (
    <div className={styles.profileBarAwards}>
      <div className={styles.profileBarAwards__content}>
        {Object.values(ratingGroups).map((item = []) =>
          item.map(({ id, type, count }) => (
            <div className={styles.profileBarAwards__item} key={`profile-bar-awards-${id}`}>
              <RatingDescriptionTooltip
                descriptionIconClassName={styles.userRatingInfo__icon}
                descriptionCountClassName={styles.userRatingInfo__count}
                type={type}
                rating={count}
                withTooltipTitle={false}
              >
                <div className={styles.profileBarAwards__decoration}>
                  <TopLaurelIcon />
                </div>
              </RatingDescriptionTooltip>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProfileBarAwards;
