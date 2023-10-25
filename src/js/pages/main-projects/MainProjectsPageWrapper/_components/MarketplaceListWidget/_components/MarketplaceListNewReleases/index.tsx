import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import type { RootState } from '@/js/redux/reducers';
import MarketplaceListWrapper from '@/pages/main-projects/MainProjectsPageWrapper/_components/MarketplaceListWidget/_components/MarketplaceListWrapper';

type PropsFromRedux = ConnectedProps<typeof connector>;

type MarketplaceListNewReleasesProps = PropsFromRedux;

const MarketplaceListNewReleases = ({
  getMarketplaceListInProcess,
  getMarketplaceListFromApi,
  marketplaceList,
  pageSettings,
}: MarketplaceListNewReleasesProps) => (
  <MarketplaceListWrapper
    location={MarketplaceLocationsConstants.NEW_RELEASES}
    items={marketplaceList}
    query="inSale=true"
    inProcess={getMarketplaceListInProcess}
    getFromApi={getMarketplaceListFromApi}
    pageSettings={pageSettings}
  />
);

const connector = connect((state: RootState) => ({
  getMarketplaceListInProcess: state.MarketplaceNewReleasesListReducer.getMarketplaceListInProcess,
  getMarketplaceListFromApi: state.MarketplaceNewReleasesListReducer.getMarketplaceListFromApi,
  marketplaceList: state.MarketplaceNewReleasesListReducer.list,
  pageSettings: state.MarketplaceNewReleasesListReducer.pageSettings,
}));

export default connector(MarketplaceListNewReleases);
