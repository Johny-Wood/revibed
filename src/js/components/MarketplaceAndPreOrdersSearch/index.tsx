import { useCallback } from 'react';

import classNames from 'classnames';

import SearchInput from '@/components/common-ui/inputs/SearchInput';
import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';

import styles from './styles.module.scss';

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
  onChangeSearch: (search: string) => void;
};

export type MarketplaceAndPreOrdersSearchProps = MarketplaceAndPreOrdersSearchExternalProps & {
  search: string;
};

const MarketplaceAndPreOrdersSearch = ({
  location,

  onGetProjects,
  onChangeSearch,

  search,
}: MarketplaceAndPreOrdersSearchProps) => {
  const changeSearch = useCallback(
    (newSearch: string = '') =>
      new Promise((resolve, reject) => {
        onChangeSearch(newSearch);

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
    [location, onChangeSearch, onGetProjects]
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
      className={classNames(
        styles.MarketplaceAndPreOrdersSearch,
        location === MarketplaceLocationsConstants.MARKETPLACE && styles.MarketplaceAndPreOrdersSearch_location_MARKETPLACE
      )}
      inputClassName={classNames(styles.MarketplaceAndPreOrdersSearch__input)}
    />
  );
};

export default MarketplaceAndPreOrdersSearch;
