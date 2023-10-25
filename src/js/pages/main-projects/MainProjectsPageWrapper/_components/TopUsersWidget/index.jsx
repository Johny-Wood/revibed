import classNames from 'classnames';
import { connect } from 'react-redux';

import NoResults from '@/components/common/NoResults';
import SecondaryTitle from '@/components/common/titles/SecondaryTitle';
import Contributor from '@/components/project/_components/Contributor';
import Preloader from '@/components/ui/Preloader';

import styles from './styles.module.scss';

function TopUsersWidget({ getRatingInProcessFromApi, getRatingInProcess, rating }) {
  return (
    <div className={classNames(styles.TopUsersWidget)}>
      <SecondaryTitle title="Top users" />
      <div className={classNames(styles.TopUsersWidget__wrapper)}>
        {getRatingInProcessFromApi &&
          (rating.length > 0 ? (
            <div className={classNames(styles.TopUsersWidget__list)}>
              {rating.map((user) => (
                <Contributor
                  isRoute
                  key={`TopUsersWidget-${user.id}`}
                  contributor={user}
                  withFollow
                  withFollowers
                  avatar={{
                    size: 60,
                  }}
                  className={styles.TopUsersWidget__item}
                />
              ))}
            </div>
          ) : (
            <NoResults minPaddings />
          ))}
        <Preloader isShown={getRatingInProcess && !getRatingInProcessFromApi} withOffsets={false} opacity={1} withBgColor />
      </div>
    </div>
  );
}

export default connect((state) => ({
  getRatingInProcessFromApi: state.RatingReducer.getRatingInProcessFromApi,
  getRatingInProcess: state.RatingReducer.getRatingInProcess,
  rating: state.RatingReducer.rating,
}))(TopUsersWidget);
