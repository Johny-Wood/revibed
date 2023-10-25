import FollowButtons from '@/components/follow/FollowButtons';
import ComponentsCommonConstants from '@/constants/components/common';

import styles from './styles.module.scss';

function UserFollowButtons({ userId, userInfo: { subscription, subscriber } = {} }) {
  return (
    <FollowButtons
      id={userId}
      subscription={subscription}
      subscriber={subscriber}
      className={styles.userFollowButton}
      size={ComponentsCommonConstants.Size.LARGE}
    />
  );
}

export default UserFollowButtons;
