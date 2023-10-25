import { memo } from 'react';

import ProjectContributorInfo from '@/components/projects/Project/_components/ProjectContributorInfo';
import ComponentsCommonConstants from '@/constants/components/common';

import styles from './styles.module.scss';

const FollowerCard = memo(({ item: { userInfo } = {} }) => (
  <div className={styles.followerCard}>
    <ProjectContributorInfo
      avatar={{ size: 120 }}
      contributor={userInfo}
      withFollowers
      withFollow
      withDescription={false}
      withDescriptionRole={false}
      className={styles.userInfo}
      userAvatarClassName={styles.userInfo__avatar}
      paramsClassName={styles.userInfoParams}
      nameClassName={styles.name}
      nickClassName={styles.nickName}
      flagClassName={styles.nickNameFlag}
      roleInfoCountsClassName={styles.userInfoCounts}
      followButtonsSize={ComponentsCommonConstants.Size.SMALL35}
      followButtonsClassName={styles.followButtons}
      isRoute
    />
  </div>
));

FollowerCard.displayName = 'FollowerCard';

export default FollowerCard;
