import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';

export const MarketplaceReducersConstants = {
  [MarketplaceLocationsConstants.MARKETPLACE]: 'MarketplaceListReducer',
  [MarketplaceLocationsConstants.NEW_RELEASES]: 'MarketplaceNewReleasesListReducer',
  [MarketplaceLocationsConstants.COMING_SOON]: 'MarketplaceComingSoonListReducer',
};
