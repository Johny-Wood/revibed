import Image from 'next/image';
import { useRouter } from 'next/navigation'

import { connect } from 'react-redux';

import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import SearchInput from '@/js/components/common-ui/inputs/SearchInput/';
import Button from '@/js/components/ui/buttons/Button';

import styles from './styles.module.scss';

function MainCards({ events }) {
    const router = useRouter()

  const onSearch = (value) => {
    router.push({
      pathname: "/marketplace",
      query: {query: value}
    })
  }

  return (
    <SiteWrapperLayout direction="column" className={styles.MainCards}>
      <div className={styles.MainCards__header}>
        <SearchInput
          id="MainLandingSearch"
          onSearch={onSearch}
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
                <Image width={160} height={160} src={card?.covers[0]?.path} alt={card.name} />
              </div>
              <div className={styles.MainCard__info}>
                <div className={styles.MainCard__infoTitle}>{artists || ''}</div>
                <div className={styles.MainCard__infoDesc}>{card.name}</div>
                <Button className={styles.MainCard__button}>Buy now</Button>
              </div>
            </div>
          );
        })}
      </div>
      <Button className={styles.MainCards__more} onClick={() => router.push("/marketplace")}>Find More</Button>
    </SiteWrapperLayout>
  );
}

export default connect((state) => ({
  events: state.MarketplaceNewReleasesListReducer.list,
  getMarketplaceListFromApi: state.MarketplaceNewReleasesListReducer.getMarketplaceListFromApi,
}))(MainCards);
