import classNames from 'classnames';
import dayjs from 'dayjs';
import Image from 'next/image';
import { connect } from 'react-redux';

import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import { RoutePathsConstants } from '@/constants/routes/routes';
import LinkRoute from '@/js/components/ui/links/LinkRoute';

import styles from './styles.module.scss';

function Preorders({ projectsInfo }) {
  return (
    <SiteWrapperLayout direction="column" className={styles.Preorders}>
      <div className={styles.Preorders__content}>
        <div className={styles.Preorders__title}>Preorders</div>
        <div className={styles.Preorders__items}>
          {projectsInfo.slice(0, 4).map((card) => {
            const artists = card.artists.map((item) => item.name).join(', ');
            const timeLeft = dayjs(card?.closeDate).diff(dayjs(), 'h');

            return (
              <div key={card.id} className={styles.PreordersCard}>
                <div className={styles.PreordersCard__cover}>
                  <Image width={180} height={180} src={card?.covers[0]?.path} alt={card?.albumTitle} />
                </div>
                <div className={styles.PreordersCard__info}>
                  <div className={styles.PreordersCard__infoTitle}>{artists}</div>
                  <div className={styles.PreordersCard__infoDesc}>{card?.albumTitle}</div>
                  <div className={styles.PreordersCard__footer}>
                    <div>
                      <strong>{card.cutsCount}</strong> of <strong>{card?.totalCutsCount}</strong>
                    </div>
                    {timeLeft ? (
                      <div>
                        <strong>{timeLeft} hours</strong> left
                      </div>
                    ) : null}
                  </div>
                  <div className={styles.PreordersCard__progress} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <LinkRoute
        type="button"
        href={RoutePathsConstants.PROJECTS}
        text="Find more"
        className={classNames(styles.Preorders__more)}
      />
    </SiteWrapperLayout>
  );
}

export default connect((state) => ({
  projectsInfo: state.TrendingReducer.projects,
  getTrendingListFromApi: state.TrendingReducer.getTrendingListFromApi,
}))(Preorders);
