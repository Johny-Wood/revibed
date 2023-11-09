import { useState } from 'react';

import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { connect } from 'react-redux';

import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import { RoutePathsConstants } from '@/constants/routes/routes';
import SearchInput from '@/js/components/common-ui/inputs/SearchInput/';
import Button from '@/js/components/ui/buttons/Button';
import LinkRoute from '@/js/components/ui/links/LinkRoute';
import { MarketplaceLocationsConstants } from '@/js/constants/marketplace/location';
import { setMarketplaceSearchAction } from '@/js/redux/actions/marketplace/marketplaceActions';

import styles from './styles.module.scss';

function MainCards({ events, setMarketplaceSearch }) {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const onSearch = (value) => {
    setMarketplaceSearch({ search: value, location: MarketplaceLocationsConstants.MARKETPLACE });
    setSearch(value);
  };

  const onSubmitSearch = () => {
    router.push({
      pathname: '/marketplace',
      query: { query: search },
    });
  };

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
        <Button className={styles.MainCards__button} onClick={onSubmitSearch}>
          Find music
        </Button>
      </div>
      <div className={styles.MainCards__items}>
        {events?.slice(0, 5).map((card) => {
          const artists = card.release.artists.map((item) => item.name).join(', ');

          return (
            <div key={card.id} className={styles.MainCard}>
              <div className={styles.MainCard__cover}>
                <Image width={160} height={160} src={card?.covers[0]?.path} alt={card.name} />
              </div>
              <div className={styles.MainCard__info}>
                <div className={styles.MainCard__infoTitle}>{artists || ''}</div>
                <div className={styles.MainCard__infoDesc}>{card.name}</div>
                <LinkRoute className={classNames("button", styles.MainCard__button)} href={`${RoutePathsConstants.MARKETPLACE}/${card.id}`}>
                  Buy now
                </LinkRoute>
              </div>
            </div>
          );
        })}
      </div>
      <LinkRoute className={classNames('button', styles.MainCards__more)} href={RoutePathsConstants.MARKETPLACE}>
        Find More
      </LinkRoute>
    </SiteWrapperLayout>
  );
}

const connector = connect(
  (state) => ({
    events: state.MarketplaceNewReleasesListReducer.list,
    getMarketplaceListFromApi: state.MarketplaceNewReleasesListReducer.getMarketplaceListFromApi,
  }),
  (dispatch) => ({
    setMarketplaceSearch: (params) => {
      dispatch(setMarketplaceSearchAction(params));
    },
  })
);

export default connector(MainCards);
