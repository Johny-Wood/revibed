import parse from 'html-react-parser';

import FollowLocationsConstants from '@/constants/follow/locations';

import styles from './styles.module.scss';

function NoFollowers({ name, location, description = '' }) {
  return (
    <div className={styles.noFollowers}>
      <div>
        {parse(
          location === FollowLocationsConstants.FOLLOWERS || location === FollowLocationsConstants.USER_FOLLOWERS
            ? `Nobody is following ${name || 'you'}.`
            : `${name ? `${name} is` : 'You&rsquo;re'} not following anyone.`
        )}
      </div>
      <div className={styles.noFollowers__description}>
        <i>{description}</i>
      </div>
    </div>
  );
}

export default NoFollowers;
