import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import createMarketplaceReducer from '@/js/redux/reducers/marketplace/list/createMarketplaceReducer';

const MarketplaceComingSoonListReducer = (state, action) =>
  createMarketplaceReducer(state, action, MarketplaceLocationsConstants.COMING_SOON);

export default MarketplaceComingSoonListReducer;
