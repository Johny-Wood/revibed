import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';

type MarketplaceDispatchActionInAllLocationsUtilAction = (location: string) => void;

export const marketplaceDispatchActionInAllLocationsUtil = (action: MarketplaceDispatchActionInAllLocationsUtilAction) => {
  Object.values(MarketplaceLocationsConstants).forEach((location) => {
    action(location);
  });
};
