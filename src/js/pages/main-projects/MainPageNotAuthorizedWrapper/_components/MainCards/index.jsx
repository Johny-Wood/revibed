import Image from 'next/image';
import { connect } from 'react-redux';

import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import SearchInput from '@/js/components/common-ui/inputs/SearchInput/';
// import HorizontalScrollLayout from '@/js/components/layouts/HorizontalScrollLayout';
import Button from '@/js/components/ui/buttons/Button';

// import MainCard from './Cards/MainCard';
import styles from './styles.module.scss';

// import cover1 from '../../_images/Cover-1.png';
// import cover2 from '../../_images/Cover-2.png';
// import cover3 from '../../_images/Cover-3.png';
// import cover4 from '../../_images/Cover-4.png';
// import cover5 from '../../_images/Cover-5.png';

function MainCards({ events }) {
  // const cardsData = [
  //   { id: '1', url: cover1, name: 'Saka Mazouki And His...', desc: 'African Fascination' },
  //   { id: '2', url: cover2, name: 'Saka Mazouki And His...', desc: 'African Fascination' },
  //   { id: '3', url: cover3, name: 'Saka Mazouki And His...', desc: 'African Fascination' },
  //   { id: '4', url: cover4, name: 'Saka Mazouki And His...', desc: 'African Fascination' },
  //   { id: '5', url: cover5, name: 'Saka Mazouki And His...', desc: 'African Fascination' },
  // ];

  return (
    <SiteWrapperLayout direction="column" className={styles.MainCards}>
      <div className={styles.MainCards__header}>
        <SearchInput
          id="MainLandingSearch"
          onSearch={() => {}}
          border={false}
          className={styles.MainCards__input}
          size="large"
          label="Search by artist or album name"
        />
        <Button className={styles.MainCards__button}>Find music</Button>
      </div>
      <div className={styles.MainCards__items}>
        {events.slice(0, 5).map((card) => {
          const artists = card.release.artists.map((item) => item.name).join(', ');

          return (
            <div key={card.id} className={styles.MainCard}>
              <div className={styles.MainCard__cover}>
                <Image width={160} height={160} src={card.covers[1].path} alt={card.name} />
              </div>
              <div className={styles.MainCard__info}>
                <div className={styles.MainCard__infoTitle}>{artists ? artists : ' '}</div>
                <div className={styles.MainCard__infoDesc}>{card.name}</div>
                <Button className={styles.MainCard__button}>Buy now</Button>
              </div>
            </div>
          );
        })}
      </div>
      <Button className={styles.MainCards__more}>Find More</Button>
    </SiteWrapperLayout>
  );
}

export default connect((state) => ({
  events: state.MarketplaceNewReleasesListReducer.list,
  getMarketplaceListFromApi: state.MarketplaceNewReleasesListReducer.getMarketplaceListFromApi,
}))(MainCards);
