import { useCallback } from 'react';

import classNames from 'classnames';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import SearchInput from '@/components/common-ui/inputs/SearchInput';
import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import { ProjectsLocationsConstants } from '@/constants/projects/location';
import type { RootState } from '@/js/redux/reducers';
import type { ChangeSearchMarketplaceAndPreOrdersFiltersActionConfig } from '@/redux-actions/marketplace-and-pre-orders/marketplaceAndPreOrdersFiltersActions';
import { changeSearchMarketplaceAndPreOrdersFiltersAction } from '@/redux-actions/marketplace-and-pre-orders/marketplaceAndPreOrdersFiltersActions';
import { resetMarketplaceCurrentParamsAction } from '@/redux-actions/marketplace/marketplaceActions';
import { resetProjectsCurrentParamsAction } from '@/redux-actions/projects/projectsActions';

import styles from './styles.module.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;

type GetProjectsConfig = {
  location: string;
  querySearch?: string;
  isNowSending?: boolean;
  withScroll?: boolean;
  pageNumber?: number;
  updateSortAndFilters?: boolean;
  pageFilters?: Record<string, string[]>;
};

export type MarketplaceAndPreOrdersSearchExternalProps = {
  location: string;
  onGetProjects: (config: GetProjectsConfig) => Promise<unknown>;
};

export type MarketplaceAndPreOrdersSearchProps = PropsFromRedux & MarketplaceAndPreOrdersSearchExternalProps;

const MarketplaceAndPreOrdersSearch = ({
  location,

  onGetProjects,

  search,

  changeSearchMarketplaceAndPreOrdersFilters,
  resetMarketplaceCurrentParams,
  resetProjectsCurrentParams,
}: MarketplaceAndPreOrdersSearchProps) => {
  const changeSearch = useCallback(
    (newSearch: string = '') =>
      new Promise((resolve, reject) => {
        if (location !== MarketplaceLocationsConstants.MARKETPLACE) {
          resetMarketplaceCurrentParams({ location: MarketplaceLocationsConstants.MARKETPLACE });
        }

        if (location !== ProjectsLocationsConstants.PROJECTS) {
          resetProjectsCurrentParams({ location: ProjectsLocationsConstants.PROJECTS });
        }

        changeSearchMarketplaceAndPreOrdersFilters({ search: newSearch });

        onGetProjects({
          location,
          isNowSending: true,
          withScroll: false,
          pageNumber: 0,
          updateSortAndFilters: true,
          querySearch: newSearch,
        })
          .then(resolve)
          .catch(reject);
      }),
    [
      changeSearchMarketplaceAndPreOrdersFilters,
      location,
      onGetProjects,
      resetMarketplaceCurrentParams,
      resetProjectsCurrentParams,
    ]
  );

  return (
    <SearchInput
      id="MarketplaceAndPreOrdersSearch"
      border
      initialValue={search}
      searched={!!search}
      onSearch={changeSearch}
      resetSearch={changeSearch}
      size="large"
      className={classNames(styles.MarketplaceAndPreOrdersSearch)}
      inputClassName={classNames(styles.MarketplaceAndPreOrdersSearch__input)}
    />
  );
};

const connector = connect(
  (state: RootState) => ({
    search: state.MarketplaceAndPreOrdersFiltersReducer.search,
  }),
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

export default connector(MarketplaceAndPreOrdersSearch);
