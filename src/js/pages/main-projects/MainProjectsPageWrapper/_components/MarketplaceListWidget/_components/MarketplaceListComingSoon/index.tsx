import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import type { RootState } from '@/js/redux/reducers';
import MarketplaceListWrapper from '@/pages/main-projects/MainProjectsPageWrapper/_components/MarketplaceListWidget/_components/MarketplaceListWrapper';

type PropsFromRedux = ConnectedProps<typeof connector>;

type MarketplaceListComingSoonProps = PropsFromRedux;

const MarketplaceListComingSoon = ({
  getMarketplaceListInProcess,
  getMarketplaceListFromApi,
  marketplaceList,
  pageSettings,
}: MarketplaceListComingSoonProps) => (
  <MarketplaceListWrapper
    location={MarketplaceLocationsConstants.COMING_SOON}
    items={marketplaceList}
    query="inSale=false"
    inProcess={getMarketplaceListInProcess}
    getFromApi={getMarketplaceListFromApi}
    pageSettings={pageSettings}
  />
);

const connector = connect((state: RootState) => ({
  getMarketplaceListInProcess: state.MarketplaceComingSoonListReducer.getMarketplaceListInProcess,
  getMarketplaceListFromApi: state.MarketplaceComingSoonListReducer.getMarketplaceListFromApi,
  marketplaceList: state.MarketplaceComingSoonListReducer.list,
  pageSettings: state.MarketplaceComingSoonListReducer.pageSettings,
}));

export default connector(MarketplaceListComingSoon);
