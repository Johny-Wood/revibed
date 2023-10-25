import { useCallback, useEffect, useState } from 'react';

import classNames from 'classnames';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import HorizontalScrollLayout from '@/components/layouts/HorizontalScrollLayout';
import MarketplaceList from '@/components/marketplace/MarketplaceList';
import Preloader from '@/components/ui/Preloader';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import type { MarketplaceListControlProps } from '@/pages/main-projects/MainProjectsPageWrapper/_components/MarketplaceListWidget/_components/MarketplaceListWrapper/_components/MarketplaceListControl';
import MarketplaceListControl from '@/pages/main-projects/MainProjectsPageWrapper/_components/MarketplaceListWidget/_components/MarketplaceListWrapper/_components/MarketplaceListControl';
import MarketplaceListWidgetGoods from '@/pages/main-projects/MainProjectsPageWrapper/_components/MarketplaceListWidget/_components/MarketplaceListWrapper/_components/MarketplaceListWidgetGoods';
import { getMarketplaceListRequestAction } from '@/redux-actions/marketplace/marketplaceActions';

import styles from './styles.module.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;

type MarketplaceListWrapperProps = PropsFromRedux &
  Omit<MarketplaceListControlProps, 'changePage'> & {
    getFromApi: boolean;
    inProcess: boolean;
    location: string;
    query: string;
    items: any[];
  };

const MarketplaceListWrapper = ({
  location,
  items,
  getFromApi,
  inProcess,
  query,
  pageSettings,
  getMarketplaceListRequest,
}: MarketplaceListWrapperProps) => {
  const { isTablet, isLaptop } = ViewportHook();

  const visibleSize = isTablet ? 3 : 2;

  const [visiblePage, setVisiblePage] = useState<number>(0);

  const action = useCallback(
    (pageNumber?: number | string, callback?: (length: number) => void) => {
      const querySplit = query.split('=');

      const pageFilters = {
        [querySplit[0]]: [querySplit[1]],
      };

      getMarketplaceListRequest({
        location,
        pageFilters,
        pageNumber,
      }).then((data: { length?: number }) => {
        if (callback) {
          callback(data?.length ?? 0);
        }
      });
    },
    [getMarketplaceListRequest, location, query]
  );

  const changePage = useCallback(
    (pageNumber?: number | string, direction?: 'next' | 'prev') => {
      let newVisiblePage = visiblePage;

      const hasMaxVisiblePage = Math.ceil(items.length / visibleSize) - 1;

      newVisiblePage = direction === 'next' ? newVisiblePage + 1 : newVisiblePage - 1;

      if (isLaptop) {
        action(pageNumber);

        return;
      }

      if (newVisiblePage > hasMaxVisiblePage) {
        action(pageNumber, () => {
          newVisiblePage = 0;

          setVisiblePage(newVisiblePage);
        });
      } else if (newVisiblePage < 0) {
        action(pageNumber, (length) => {
          setVisiblePage(Math.ceil(length / visibleSize) - 1);
        });
      } else {
        setVisiblePage(newVisiblePage);
      }
    },
    [action, isLaptop, items.length, visiblePage, visibleSize]
  );

  useEffect(() => {
    if (!getFromApi) {
      action();
    }
  }, [action, getFromApi]);

  return (
    <div className={classNames(styles.MarketplaceListWrapper)}>
      <MarketplaceListControl pageSettings={pageSettings} changePage={changePage} />
      <HorizontalScrollLayout
        className={styles.MarketplaceListWrapper__scrolLayout}
        contentClassName={styles.MarketplaceListWrapper__scrolContent}
      >
        <div className={classNames(styles.MarketplaceListWrapper__container)}>
          <MarketplaceList
            items={!isLaptop ? items.slice(visiblePage * visibleSize, visiblePage * visibleSize + visibleSize) : items}
            location={location}
            getFromApi={getFromApi && false}
            withHeaderControl={false}
            withFiltersAndSort={false}
            withPagination={false}
            itemComponent={MarketplaceListWidgetGoods}
            className={classNames(styles.MarketplaceListWrapper__wrapper)}
            listClassName={classNames(styles.MarketplaceListWrapper__list)}
            blockClassName={classNames(styles.MarketplaceListWrapper__block)}
          />
          <Preloader isShown={inProcess} withOffsets={false} opacity={1} withBgColor />
        </div>
      </HorizontalScrollLayout>
    </div>
  );
};

const connector = connect(
  () => ({}),
  (dispatch) => ({
    getMarketplaceListRequest: (params: any) => getMarketplaceListRequestAction({ ...params, dispatch }),
  })
);

export default connector(MarketplaceListWrapper);
