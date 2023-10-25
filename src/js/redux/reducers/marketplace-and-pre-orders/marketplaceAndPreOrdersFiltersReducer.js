import { marketplaceAndPreOrdersFiltersConstants } from '@/constants/actions/marketplaceAndPreOrdersFilters';

import { createHandlers, createReducer } from '../handler';

const initialState = {
  search: '',
};

const handlers = createHandlers({
  [marketplaceAndPreOrdersFiltersConstants.CHANGE_SEARCH_MARKETPLACE_AND_PRE_ORDERS]: (state, { search }) => ({
    ...state,
    search,
  }),
});

const MarketplaceAndPreOrdersFiltersReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default MarketplaceAndPreOrdersFiltersReducer;
