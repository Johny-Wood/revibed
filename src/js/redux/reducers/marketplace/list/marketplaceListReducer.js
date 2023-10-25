import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import createMarketplaceReducer from '@/js/redux/reducers/marketplace/list/createMarketplaceReducer';

const MarketplaceListReducer = (state, action) =>
  createMarketplaceReducer(state, action, MarketplaceLocationsConstants.MARKETPLACE);

export default MarketplaceListReducer;
