import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import type { RootState } from '@/js/redux/reducers';
import MarketplaceListWrapper from '@/pages/main-projects/MainProjectsPageWrapper/_components/MarketplaceListWidget/_components/MarketplaceListWrapper';

type PropsFromRedux = ConnectedProps<typeof connector>;

type MarketplaceListNewReleasesProps = PropsFromRedux;

const MarketplaceListNewReleases = ({ marketplaceList, getMarketplaceListInProcess }: MarketplaceListNewReleasesProps) => (
  <MarketplaceListWrapper
    location={MarketplaceLocationsConstants.NEW_RELEASES}
    items={marketplaceList}
    inProcess={getMarketplaceListInProcess}
  />
);

const connector = connect((state: RootState) => ({
  marketplaceList: state.MarketplaceNewReleasesListReducer.list,
  getMarketplaceListInProcess: state.MarketplaceNewReleasesListReducer.getMarketplaceListInProcess,
}));

export default connector(MarketplaceListNewReleases);
