import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import SearchInput from '@/components/common-ui/inputs/SearchInput';
import HeaderSearchTabs from '@/components/global/Header/_components/HeaderSearch/_components/HeaderSearchTabs';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import SearchIcon from '@/icons/SearchIcon';
import { getMarketplaceListRequestAction } from '@/redux-actions/marketplace/marketplaceActions';
import { getProjectsRequestAction } from '@/redux-actions/projects/projectsActions';

import styles from './styles.module.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;

type ProjectHeaderSearchProps = PropsFromRedux & {
  iconColor: string;
  shown: boolean;
  toggleShow: (shown: boolean) => void;
};

function HeaderSearch({
  iconColor,
  shown,

  toggleShow,

  getProjects,
  getMarketplaceListRequest,
}: ProjectHeaderSearchProps) {
  const searchResultsLimit: number = 5;
  const timer = useRef<NodeJS.Timeout>();
  const querySearchCurrent = useRef<string>('');
  const querySearchPrev = useRef<string>(querySearchCurrent.current);

  const [location, setLocation] = useState<number>(0);

  const [marketplaceListStatus, setMarketplaceListStatus] = useState<'idle' | 'inProcess' | 'success'>('idle');
  const [preOrdersListStatus, setPreOrdersListStatus] = useState<'idle' | 'inProcess' | 'success'>('idle');

  const [marketplaceList, setMarketplaceList] = useState([]);
  const [marketplaceListCount, setMarketplaceListCount] = useState<number>(0);
  const [preOrdersList, setPreOrdersList] = useState([]);
  const [preOrdersListCount, setPreOrdersListCount] = useState<number>(0);

  const searchConfig = useMemo(
    () => ({
      pageNumber: 0,
      pageSize: searchResultsLimit,
      withInProcess: false,
      withSort: false,
      withFilters: false,
      useCustomResponseHandler: true,
    }),
    []
  );

  const changeSearch = useCallback(
    (querySearch: string = '', newLocation: number = location, isChangeLocation?: boolean) =>
      new Promise((resolve, reject) => {
        if (isChangeLocation && querySearchPrev.current === querySearchCurrent.current) {
          resolve(null);

          return;
        }

        if (newLocation === 0) {
          setMarketplaceListStatus('inProcess');

          getMarketplaceListRequest({
            ...searchConfig,
            location: MarketplaceLocationsConstants.MARKETPLACE,
            querySearch,
          })
            .then(
              ({
                responseData,
                payload: {
                  page: { totalElements = 0 },
                },
              }) => {
                setMarketplaceList(responseData);
                setMarketplaceListCount(totalElements);

                resolve(null);
              }
            )
            .catch(reject)
            .finally(() => {
              setMarketplaceListStatus(querySearch ? 'success' : 'idle');

              querySearchCurrent.current = querySearch;
            });
        } else if (newLocation === 1) {
          setPreOrdersListStatus('inProcess');

          getProjects({
            ...searchConfig,
            location: ProjectsLocationsConstants.PROJECTS,
            querySearch,
          })
            .then(
              ({
                responseData,
                payload: {
                  page: { totalElements = 0 },
                },
              }) => {
                setPreOrdersList(responseData);
                setPreOrdersListCount(totalElements);

                resolve(null);
              }
            )
            .catch(reject)
            .finally(() => {
              setPreOrdersListStatus(querySearch ? 'success' : 'idle');

              querySearchCurrent.current = querySearch;
            });

          resolve(null);
        }
      }),
    [getMarketplaceListRequest, getProjects, location, searchConfig]
  );

  const resetSearch = useCallback(() => {
    toggleShow(false);
    setLocation(0);
    setMarketplaceListStatus('idle');
    setPreOrdersListStatus('idle');
    setMarketplaceList([]);
    setPreOrdersList([]);
    setMarketplaceListCount(0);
    setPreOrdersListCount(0);

    querySearchCurrent.current = '';
    querySearchPrev.current = '';
  }, [toggleShow]);

  useEffect(
    () => () => {
      clearTimeout(timer.current);
    },
    []
  );

  return (
    <div className={styles.headerSearch}>
      <TransitionSwitchLayout isShown={!shown}>
        {/* @ts-ignore */}
        <ButtonIcon
          className={styles.headerSearch__preview}
          aria-label="search"
          type="button_string"
          icon={SearchIcon}
          iconColor={iconColor}
          transparent
          onClick={() => {
            toggleShow(true);
          }}
        />
      </TransitionSwitchLayout>
      <TransitionSwitchLayout
        isShown={shown}
        animationClassNames={{
          enter: styles.responseAnimationEnter,
          enterActive: styles.responseAnimationEnter_active,
          enterDone: styles.responseAnimationEnter_done,
          exit: styles.responseAnimationExit,
          exitActive: styles.responseAnimationExit_active,
        }}
        duration={400}
      >
        <div className={styles.headerSearch__content}>
          <SearchInput
            id="MarketplaceAndPreOrdersHeaderSearch"
            border
            autoFocus
            onSearch={changeSearch}
            resetSearch={changeSearch}
            size="large"
            searched={marketplaceListStatus !== 'idle' || preOrdersListStatus !== 'idle'}
            className={classNames(styles.headerSearch__block)}
            inputClassName={classNames(styles.headerSearch__input)}
            onBlur={() => {
              clearTimeout(timer.current);

              timer.current = setTimeout(() => {
                resetSearch();
              }, 400);
            }}
          />
          <HeaderSearchTabs
            shown={marketplaceListStatus !== 'idle' || preOrdersListStatus !== 'idle'}
            location={location}
            list={location === 0 ? marketplaceList : preOrdersList}
            setLocation={(newLocation) => {
              setLocation(newLocation);

              changeSearch(querySearchCurrent.current, newLocation, true).finally(() => {
                querySearchPrev.current = querySearchCurrent.current;
              });
            }}
            searchResultsCount={location === 0 ? marketplaceListCount : preOrdersListCount}
            searchResultsLimit={searchResultsLimit}
            marketplaceListStatus={marketplaceListStatus}
            preOrdersListStatus={preOrdersListStatus}
            resetSearch={resetSearch}
            query={querySearchCurrent.current}
          />
        </div>
      </TransitionSwitchLayout>
    </div>
  );
}

const connector = connect(
  () => ({}),
  (dispatch) => ({
    getProjects: (params: any) => getProjectsRequestAction(params)(dispatch),
    getMarketplaceListRequest: (params: any) =>
      getMarketplaceListRequestAction({
        ...params,
        dispatch,
      }),
  })
);

export default connector(HeaderSearch);
