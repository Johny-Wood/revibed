import dayjs from 'dayjs';
import Image from 'next/image';
import { connect } from 'react-redux';

import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import Button from '@/js/components/ui/buttons/Button';

import styles from './styles.module.scss';

// import cover1 from '../../_images/Cover-6.png';
// import cover2 from '../../_images/Cover-7.png';
// import cover3 from '../../_images/Cover-8.png';
// import cover4 from '../../_images/Cover-9.png';

function Preorders({ projectsInfo }) {
  // const cardsData = [
  //   { id: '1', url: cover1, name: 'Saka Mazouki And His...', desc: 'African Fascination' },
  //   { id: '2', url: cover2, name: 'Saka Mazouki And His...', desc: 'African Fascination' },
  //   { id: '3', url: cover3, name: 'Saka Mazouki And His...', desc: 'African Fascination' },
  //   { id: '4', url: cover4, name: 'Saka Mazouki And His...', desc: 'African Fascination' }
  // ];

  console.log(projectsInfo);

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
                  <Image width={180} height={180} src={card.covers[1].path} alt={card.albumTitle} />
                </div>
                <div className={styles.PreordersCard__info}>
                  <div className={styles.PreordersCard__infoTitle}>{artists}</div>
                  <div className={styles.PreordersCard__infoDesc}>{card.albumTitle}</div>
                  <div className={styles.PreordersCard__footer}>
                    <div className={styles.PreordersCard__footerItem}>
                      <strong>{card.cutsCount}</strong> of <strong>{card.totalCutsCount}</strong>
                    </div>
                    {timeLeft ? (
                      <div className={styles.PreordersCard__footerItem}>
                        <strong>{timeLeft} hours</strong> left
                      </div>
                    ) : null}
                  </div>
                  {/* div progress must be progress tag */}
                  {/* <progress value={card.cutsCount} max={card.totalCutsCount} /> */}
                  <div className={styles.PreordersCard__progress}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Button className={styles.Preorders__more}>Find More</Button>
    </SiteWrapperLayout>
  );
}

// export default Preorders;

export default connect((state) => ({
  projectsInfo: state.TrendingReducer.projects,
  getTrendingListFromApi: state.TrendingReducer.getTrendingListFromApi,
}))(Preorders);
