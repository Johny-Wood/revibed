import { useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';
import isNumber from 'lodash/isNumber';
import { useRouter } from 'next/router';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import newMobileMenuAnimation from '@/assets/styles/animations/new-mobile-menu.module.scss';
import NoResults from '@/components/common/NoResults';
import type { TabConfig } from '@/components/common/tabs/TabsNavigation';
import TabsNavigation from '@/components/common/tabs/TabsNavigation';
import type { HeaderSearchTabItem } from '@/components/global/Header/_components/HeaderSearch/_components/HeaderSearchTabs/_components/HeaderSearchTab';
import HeaderSearchTab from '@/components/global/Header/_components/HeaderSearch/_components/HeaderSearchTabs/_components/HeaderSearchTab';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import LinkRoute from '@/components/ui/links/LinkRoute';
import Preloader from '@/components/ui/Preloader';
import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import { RoutePathsConstants } from '@/constants/routes/routes';
import TitlesConstants from '@/constants/titles/titlesConstants';
import type { ChangeSearchMarketplaceAndPreOrdersFiltersActionConfig } from '@/redux-actions/marketplace-and-pre-orders/marketplaceAndPreOrdersFiltersActions';
import { changeSearchMarketplaceAndPreOrdersFiltersAction } from '@/redux-actions/marketplace-and-pre-orders/marketplaceAndPreOrdersFiltersActions';
import { resetMarketplaceCurrentParamsAction } from '@/redux-actions/marketplace/marketplaceActions';
import { resetProjectsCurrentParamsAction } from '@/redux-actions/projects/projectsActions';
import { createGoodsUrlUtil } from '@/utils/project/goodsUrlUtil';
import { createProjectUrlUtil } from '@/utils/project/projectUrlUtil';
import { textForLotsOfUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const tabs: TabConfig[] = [
  {
    id: 0,
    title: 'Album',
  },
  {
    id: 1,
    title: TitlesConstants.PRE_ORDERS,
  },
];

type PropsFromRedux = ConnectedProps<typeof connector>;

type HeaderSearchTabsProps = PropsFromRedux & {
  shown: boolean;
  location: number;
  list: HeaderSearchTabItem[];
  searchResultsCount: number;
  searchResultsLimit: number;
  marketplaceListStatus: 'idle' | 'inProcess' | 'success';
  preOrdersListStatus: 'idle' | 'inProcess' | 'success';
  query: string;

  setLocation: (location: number) => void;
  resetSearch: () => void;
};

const HeaderSearchTabs = ({
  shown,
  location,
  list,
  searchResultsCount,
  searchResultsLimit,
  marketplaceListStatus,
  preOrdersListStatus,
  resetSearch,
  query,

  setLocation,

  resetMarketplaceCurrentParams,
  resetProjectsCurrentParams,
  changeSearchMarketplaceAndPreOrdersFilters,
}: HeaderSearchTabsProps) => {
  const router = useRouter();

  const [focusedOption, setFocusedOption] = useState(-1);

  const pathnameTabs = location === 0 ? RoutePathsConstants.MARKETPLACE : RoutePathsConstants.PROJECTS;

  const goToLink = useCallback(
    ({ isAll }: { isAll: boolean }) => {
      const { id, title: titleG, release } = list[focusedOption] ?? {};

      const { title = titleG } = release ?? {};

      if (!id && focusedOption <= -1 && !isAll) {
        return;
      }

      resetSearch();

      if (!isAll) {
        if (id) {
          router
            .push({
              pathname: location === 0 ? createGoodsUrlUtil(id) : createProjectUrlUtil(id, title),
            })
            .then();
        }
      } else {
        changeSearchMarketplaceAndPreOrdersFilters({ search: query });

        resetMarketplaceCurrentParams({
          location: MarketplaceLocationsConstants.MARKETPLACE,
        });

        resetProjectsCurrentParams({
          location: ProjectsLocationsConstants.PROJECTS,
        });

        router
          .push({
            pathname: pathnameTabs,
            query: { query },
          })
          .then();
      }
    },
    [
      changeSearchMarketplaceAndPreOrdersFilters,
      focusedOption,
      list,
      location,
      pathnameTabs,
      query,
      resetMarketplaceCurrentParams,
      resetProjectsCurrentParams,
      resetSearch,
      router,
    ]
  );

  const setFocusOptionNext = useCallback(() => {
    const newFocusedOption = focusedOption + (focusedOption < list.length ? 1 : 0);

    setFocusedOption(newFocusedOption !== focusedOption && focusedOption !== list.length ? newFocusedOption : -1);
  }, [focusedOption, list.length]);

  const setFocusOptionPrev = useCallback(() => {
    const newFocusedOption = focusedOption - (focusedOption >= 0 ? 1 : 0);

    setFocusedOption(newFocusedOption !== focusedOption && focusedOption !== -1 ? newFocusedOption : list.length);
  }, [focusedOption, list.length]);

  const keyUpListener = useCallback(
    (event: KeyboardEvent) => {
      const { keyCode } = event;

      switch (keyCode) {
        case 38: {
          event.stopPropagation();
          event.preventDefault();
          setFocusOptionPrev();
          break;
        }
        case 40: {
          event.stopPropagation();
          event.preventDefault();
          setFocusOptionNext();
          break;
        }
        case 13: {
          event.stopPropagation();
          event.preventDefault();
          goToLink({ isAll: focusedOption === list.length });
          break;
        }
        case 27: {
          event.stopPropagation();
          event.preventDefault();
          resetSearch();
          break;
        }
        default:
          break;
      }
    },
    [focusedOption, goToLink, list.length, resetSearch, setFocusOptionNext, setFocusOptionPrev]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyUpListener, false);

    return () => {
      document.removeEventListener('keydown', keyUpListener, false);
    };
  }, [keyUpListener]);

  useEffect(() => {
    if (marketplaceListStatus) {
      setFocusedOption(-1);
    }
  }, [marketplaceListStatus]);

  useEffect(() => {
    if (preOrdersListStatus) {
      setFocusedOption(-1);
    }
  }, [preOrdersListStatus]);

  useEffect(() => {
    if (isNumber(location)) {
      setFocusedOption(-1);
    }
  }, [location]);

  return (
    <TransitionSwitchLayout
      isShown={shown}
      duration={240}
      animationClassNames={{
        enter: newMobileMenuAnimation.newMobileMenuAnimationEnter,
        enterActive: newMobileMenuAnimation.newMobileMenuAnimationEnter_active,
        exit: newMobileMenuAnimation.newMobileMenuAnimationExit,
        exitActive: newMobileMenuAnimation.newMobileMenuAnimationExit_active,
      }}
    >
      <div className={classNames(styles.HeaderSearchTabs)}>
        <TabsNavigation
          className={classNames(styles.HeaderSearchTabs__navigation)}
          buttonClassName={classNames(styles.HeaderSearchTabs__button)}
          tabs={tabs}
          activeTabId={location}
          setActiveTab={setLocation}
        />
        <div className={classNames(styles.HeaderSearchTabs__content)}>
          <Preloader
            className={styles.HeaderSearchTabs__loader}
            containerClassName={styles.HeaderSearchTabs__loaderContainer}
            isShown={
              (marketplaceListStatus === 'inProcess' && location === 0) || (preOrdersListStatus === 'inProcess' && location === 1)
            }
            withOffsets={false}
          />
          {list.length > 0 ? (
            <div className={classNames(styles.HeaderSearchTabs__info)}>
              <div className={classNames(styles.HeaderSearchTabs__list)}>
                {list.map((item, idx) => {
                  const { id } = item;

                  return (
                    <HeaderSearchTab
                      key={`HeaderSearchTabs-${location}-${id}`}
                      item={item}
                      location={location}
                      focused={focusedOption === idx}
                    />
                  );
                })}
              </div>
              {searchResultsCount - searchResultsLimit > 0 && (
                <div className={classNames(styles.HeaderSearchTabs__count, 'c-gray-2 t-center')}>
                  +{searchResultsCount - searchResultsLimit}{' '}
                  {textForLotsOfUtil(searchResultsCount - searchResultsLimit, ['item', 'items'])}
                </div>
              )}
              <LinkRoute
                type="button"
                focused={focusedOption === list.length}
                className={classNames(styles.HeaderSearchTabs__link)}
                text="See all results"
                transparent
                borderColor="gray-4"
                href={{
                  pathname: pathnameTabs,
                  query: { query },
                }}
                onClick={(e) => {
                  e.preventDefault();

                  goToLink({
                    isAll: true,
                  });
                }}
              />
            </div>
          ) : (
            ((marketplaceListStatus === 'success' && location === 0) ||
              (preOrdersListStatus === 'success' && location === 1)) && (
              <NoResults className={styles.HeaderSearchTabs__noResults} />
            )
          )}
        </div>
      </div>
    </TransitionSwitchLayout>
  );
};

const connector = connect(
  () => ({}),
  (dispatch) => ({
    changeSearchMarketplaceAndPreOrdersFilters: (params: ChangeSearchMarketplaceAndPreOrdersFiltersActionConfig) => {
      dispatch(changeSearchMarketplaceAndPreOrdersFiltersAction(params));
    },
    resetMarketplaceCurrentParams: (params: { location: any }) => {
      dispatch(resetMarketplaceCurrentParamsAction(params));
    },
    resetProjectsCurrentParams: (params: { location: any }) => {
      dispatch(resetProjectsCurrentParamsAction(params));
    },
  })
);

export default connector(HeaderSearchTabs);
