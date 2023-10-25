import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import createMarketplaceReducer from '@/js/redux/reducers/marketplace/list/createMarketplaceReducer';

const MarketplaceNewReleasesListReducer = (state, action) =>
  createMarketplaceReducer(state, action, MarketplaceLocationsConstants.NEW_RELEASES);

export default MarketplaceNewReleasesListReducer;
