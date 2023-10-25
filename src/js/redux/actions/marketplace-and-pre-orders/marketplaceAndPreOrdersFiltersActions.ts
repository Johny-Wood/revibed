import { marketplaceAndPreOrdersFiltersConstants } from '@/constants/actions/marketplaceAndPreOrdersFilters';

import createAction from '../actionCreator';

export type ChangeSearchMarketplaceAndPreOrdersFiltersActionConfig = {
  search: string;
};

export const changeSearchMarketplaceAndPreOrdersFiltersAction = ({
  search,
}: ChangeSearchMarketplaceAndPreOrdersFiltersActionConfig) =>
  createAction(marketplaceAndPreOrdersFiltersConstants.CHANGE_SEARCH_MARKETPLACE_AND_PRE_ORDERS, {
    search,
  });
