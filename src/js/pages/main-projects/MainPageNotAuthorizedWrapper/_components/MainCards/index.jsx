import { useCallback, useMemo, useRef, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { connect } from 'react-redux';

import SiteWrapperLayout from '@/components/layouts/SiteWrapperLayout';
import SearchInput from '@/js/components/common-ui/inputs/SearchInput/';
import Button from '@/js/components/ui/buttons/Button';
import { MarketplaceLocationsConstants } from '@/js/constants/marketplace/location';
// import { ProjectsLocationsConstants } from '@/js/constants/projects/location';
import { getMarketplaceListRequestAction, setMarketplaceSearchAction } from '@/js/redux/actions/marketplace/marketplaceActions';

import styles from './styles.module.scss';

function MainCards({ events, getProjects, getMarketplaceListRequest, setMarketplaceSearch }) {
  const router = useRouter();

  // const searchResultsLimit = 5;
  // const querySearchCurrent = useRef('');
  // const querySearchPrev = useRef(querySearchCurrent.current);

  // const [location, setLocation] = useState(0);
  //
  // const [marketplaceListStatus, setMarketplaceListStatus] = useState('idle');
  // const [preOrdersListStatus, setPreOrdersListStatus] = useState('idle');
  //
  // const [marketplaceList, setMarketplaceList] = useState([]);
  // const [marketplaceListCount, setMarketplaceListCount] = useState(0);
  // const [preOrdersList, setPreOrdersList] = useState([]);
  // const [preOrdersListCount, setPreOrdersListCount] = useState(0);

  // const searchConfig = useMemo(
  //   () => ({
  //     pageNumber: 0,
  //     pageSize: searchResultsLimit,
  //     withInProcess: false,
  //     withSort: false,
  //     withFilters: false,
  //     useCustomResponseHandler: true,
  //   }),
  //   []
  // );
  //
  // const changeSearch = useCallback(
  //   (querySearch = '', newLocation = location, isChangeLocation) =>
  //     new Promise((resolve, reject) => {
  //       if (isChangeLocation && querySearchPrev.current === querySearchCurrent.current) {
  //         resolve(null);
  //
  //         return;
  //       }
  //
  //       if (newLocation === 0) {
  //         setMarketplaceListStatus('inProcess');
  //
  //         getMarketplaceListRequest({
  //           ...searchConfig,
  //           location: MarketplaceLocationsConstants.MARKETPLACE,
  //           querySearch,
  //         })
  //           .then(
  //             ({
  //               responseData,
  //               payload: {
  //                 page: { totalElements = 0 },
  //               },
  //             }) => {
  //               setMarketplaceList(responseData);
  //               setMarketplaceListCount(totalElements);
  //               setMarketplaceSearch({ search: querySearch, location: MarketplaceLocationsConstants.MARKETPLACE });
  //               router.push({
  //                 pathname: '/marketplace',
  //                 query: { query: querySearch},
  //               });
  //
  //
  //
  //
  //               resolve(null);
  //             }
  //           )
  //           .catch(reject)
  //           .finally(() => {
  //             setMarketplaceListStatus(querySearch ? 'success' : 'idle');
  //
  //             querySearchCurrent.current = querySearch;
  //           });
  //       } else if (newLocation === 1) {
  //         setPreOrdersListStatus('inProcess');
  //
  //         getProjects({
  //           ...searchConfig,
  //           location: ProjectsLocationsConstants.PROJECTS,
  //           querySearch,
  //         })
  //           .then(
  //             ({
  //               responseData,
  //               payload: {
  //                 page: { totalElements = 0 },
  //               },
  //             }) => {
  //               setPreOrdersList(responseData);
  //               setPreOrdersListCount(totalElements);
  //
  //               resolve(null);
  //             }
  //           )
  //           .catch(reject)
  //           .finally(() => {
  //             setPreOrdersListStatus(querySearch ? 'success' : 'idle');
  //
  //             querySearchCurrent.current = querySearch;
  //           });
  //
  //         resolve(null);
  //       }
  //     }),
  //   [getMarketplaceListRequest, getProjects, location, searchConfig]
  // );

  const onSearch = (value) => {
    setMarketplaceSearch({ search: value, location: MarketplaceLocationsConstants.MARKETPLACE });
    router.push({
      pathname: '/marketplace',
      query: { query: value},
    });
    // router.push({
    //   pathname: '/marketplace',
    //   query: { query: value },
    // });
  };

  return (
    <SiteWrapperLayout direction="column" className={styles.MainCards}>
      <div className={styles.MainCards__header}>
        <SearchInput
          id="MainLandingSearch"
          onSearch={onSearch}
          // onSearch={changeSearch}
          // searched={marketplaceListStatus !== 'idle' || preOrdersListStatus !== 'idle'}
          border={false}
          className={styles.MainCards__input}
          size="large"
          label="Search by artist or album name"
        />
        <Button className={styles.MainCards__button}>Find music</Button>
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
                <Button className={styles.MainCard__button} onClick={() => router.push('/marketplace/' + card.id)}>
                  Buy now
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <Button className={styles.MainCards__more} onClick={() => router.push('/marketplace')}>
        Find More
      </Button>
    </SiteWrapperLayout>
  );
}

const connector = connect(
  (state) => ({
    events: state.MarketplaceNewReleasesListReducer.list,
    getMarketplaceListFromApi: state.MarketplaceNewReleasesListReducer.getMarketplaceListFromApi,
  }),
  (dispatch) => ({
    // getProjects: (params) => getProjectsRequestAction(params)(dispatch),
    // getMarketplaceListRequest: (params) =>
    //   getMarketplaceListRequestAction({
    //     ...params,
    //     dispatch,
    //   }),
    setMarketplaceSearch: (params) => {
      dispatch(setMarketplaceSearchAction(params));
    },
  })
);

export default connector(MainCards);
// export default connect((state, dispatch) => ({
//   events: state.MarketplaceNewReleasesListReducer.list,
//   getMarketplaceListFromApi: state.MarketplaceNewReleasesListReducer.getMarketplaceListFromApi,
//   setMarketplaceSearch: (params) => {
//     dispatch(setMarketplaceSearchAction(params));
//   },
// }))(MainCards);
