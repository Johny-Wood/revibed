import dayjs from 'dayjs';
import Image from 'next/image';
import { connect } from 'react-redux';
import { useRouter } from 'next/navigation'

import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import Button from '@/js/components/ui/buttons/Button';

import styles from './styles.module.scss';

function Preorders({ projectsInfo }) {
  const router = useRouter()

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
      <Button className={styles.Preorders__more} onClick={() => router.push("/music-legacy-projects")}>Find More</Button>
    </SiteWrapperLayout>
  );
}

export default connect((state) => ({
  projectsInfo: state.TrendingReducer.projects,
  getTrendingListFromApi: state.TrendingReducer.getTrendingListFromApi,
}))(Preorders);
