import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import type { RootState } from '@/js/redux/reducers';
import MarketplaceListWrapper from '@/pages/main-projects/MainProjectsPageWrapper/_components/MarketplaceListWidget/_components/MarketplaceListWrapper';

type PropsFromRedux = ConnectedProps<typeof connector>;

type MarketplaceListComingSoonProps = PropsFromRedux;

const MarketplaceListComingSoon = ({ marketplaceList, getMarketplaceListInProcess }: MarketplaceListComingSoonProps) => (
  <MarketplaceListWrapper
    location={MarketplaceLocationsConstants.COMING_SOON}
    items={marketplaceList}
    inProcess={getMarketplaceListInProcess}
  />
);

const connector = connect((state: RootState) => ({
  marketplaceList: state.MarketplaceComingSoonListReducer.list,
  getMarketplaceListInProcess: state.MarketplaceComingSoonListReducer.getMarketplaceListInProcess,
}));

export default connector(MarketplaceListComingSoon);
